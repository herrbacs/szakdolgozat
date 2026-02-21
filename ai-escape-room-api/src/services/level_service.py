from __future__ import annotations
import json
import uuid
from typing import Any, Dict, List, Optional, Tuple
from fastapi import HTTPException
from config import GPT_MINI, GPT_5_2, MAX_REPAIR_ROUNDS
from openai_client import get_openai_client
from src.prompts.prompts import load_prompt
from src.utils.json_utils import ensure_valid_json_and_save, strip_code_fences
from src.utils.path_utils import ensure_and_get_level_dir
from src.postprocess.normalize_ids import normalize_level_id_structures
from pathlib import Path
from sqlalchemy.orm import Session
from db.models.level import Level

client = get_openai_client()

def call_openai(*, out_dir: Path, file_name: str, **openai_params: Any) -> Dict[str, Any]:
    response = client.responses.create(**openai_params)
    text = (response.output_text or "").strip()

    if not text:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "OpenAI üres output_text-et adott vissza",
                "output_types": [o.type for o in (response.output or [])],
            },
        )

    valid_json_str = ensure_valid_json_and_save(text, out_dir / file_name)
    return json.loads(valid_json_str)

def parse_validator_verdict_obj(obj: Dict[str, Any]) -> Dict[str, Any]:
    if "solvable" not in obj or "issues" not in obj:
        raise HTTPException(status_code=502, detail={"message": "Validator schema hiba", "raw": obj})

    if not isinstance(obj["solvable"], bool):
        raise HTTPException(status_code=502, detail={"message": "solvable nem bool", "raw": obj})

    if not isinstance(obj["issues"], list) or not all(isinstance(x, str) for x in obj["issues"]):
        raise HTTPException(status_code=502, detail={"message": "issues nem string lista", "raw": obj})

    if obj["solvable"] is True and len(obj["issues"]) != 0:
        raise HTTPException(status_code=502, detail={"message": "solvable=true de issues nem üres", "raw": obj})

    if obj["solvable"] is False and len(obj["issues"]) == 0:
        raise HTTPException(status_code=502, detail={"message": "solvable=false de issues üres", "raw": obj})

    return obj


def validate_level(*, level_obj: Dict[str, Any], out_dir: Path) -> Dict[str, Any]:
    validator_prompt = load_prompt(["prompt_level_validate"])

    verdict_obj = call_openai(
        out_dir=out_dir,
        file_name="last_validator_output.json",
        model=GPT_MINI,
        input=f"""
{validator_prompt}

JSON code rules:
{load_prompt(["prompt_pseudo_code"])}

Level structure principals:
{load_prompt(["prompt_principals"])}

Generated Level Json:
{json.dumps(level_obj, ensure_ascii=False)}
""",
    )

    return parse_validator_verdict_obj(verdict_obj)


def repair_level(*, current_level_obj: Dict[str, Any], validation: Dict[str, Any], round_idx: int, out_dir: Path) -> Dict[str, Any]:
    repaired_obj = call_openai(
        out_dir=out_dir,
        file_name=f"repaired_level_round{round_idx}.json",
        model=GPT_5_2,
        input=assemble_repair_prompt(current_level_obj, issue_report=validation["issues"]),
        reasoning={"effort": "none"},
        temperature=0,
    )
    print("Level Repaired")
    return repaired_obj


def assemble_repair_prompt(level_obj: Dict[str, Any], issue_report: List[str] | None) -> str:
    prompt = load_prompt(["prompt_level_repair"])
    issue_text = json.dumps(issue_report, ensure_ascii=False, indent=2)
    return f"""
{prompt}
Issue Report:
{issue_text}

Generated Level Json:
{json.dumps(level_obj, ensure_ascii=False)}

JSON code rules:
{load_prompt(["prompt_pseudo_code"])}

Level structure principals:
{load_prompt(["prompt_principals"])}
"""

def generate_new_level() -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    level_id = str(uuid.uuid4())
    level_dir = ensure_and_get_level_dir(level_id)
    
    current_level = call_openai(
        out_dir=level_dir,
        file_name="generated_level.json",
        model=GPT_MINI,
        input=load_prompt([
            "prompt_pseudo_code",
            "prompt_principals",
            "prompt_graph",
            "prompt_level_examples",
        ]),
    )
    print("Prototype level generated")

    for round_idx in range(0, MAX_REPAIR_ROUNDS):
        validation = validate_level(level_obj=current_level, out_dir=level_dir)

        if validation["solvable"] is True:
            print("Level validated sucessfully")

            level = normalize_level_id_structures(current_level)
            level["derivation"] = validation.get("derivation")
            level["id"] = level_id

            with open((level_dir / "final_level.json"), "w", encoding="utf-8") as f:
                json.dump(level, f, ensure_ascii=False, indent=2)

            return True, level, level_id

        print(f"Level validation failed (round {round_idx}): {validation['issues']}")
        current_level = repair_level(
            current_level_obj=current_level,
            validation=validation,
            round_idx=round_idx,
            out_dir=level_dir,
        )

    return False, None, None

def find_objects_with_id_and_inspection(obj: Any, results=None, path=()):
    if results is None:
        results = []

    if isinstance(obj, dict):
        if "id" in obj and "inspectionData" in obj:
            is_exit = "exit" in path
            results.append({
                "object": obj,
                "path": path,
                "is_exit": is_exit,
            })

        for key, value in obj.items():
            find_objects_with_id_and_inspection(value, results, path + (key,))

    elif isinstance(obj, list):
        for idx, item in enumerate(obj):
            find_objects_with_id_and_inspection(item, results, path + (idx,))

    return results

def create_level_with_id(
    db: Session,
    level_id: uuid.UUID,
    success: bool,
    story: str = "",
    title: str = ""
) -> Level:
    level = Level(
        id=level_id,
        title=title,
        story=story,
        sucessfull_level_generation=success,
        sucessfull_sprite_generation=False
    )

    db.add(level)
    db.commit()
    db.refresh(level)

    return level

def update_level_successful_sprite_generation(
    db: Session,
    level: Level
) -> Level:
    level.sucessfull_sprite_generation = True
    db.commit()
    db.refresh(level)
    return level