from __future__ import annotations
import json
import uuid
from typing import Any, Dict, List
from fastapi import HTTPException

from config import GPT_MINI, GPT_5_2, MAX_REPAIR_ROUNDS
from openai_client import get_openai_client
from prompts import load_prompt
from utils.json_utils import ensure_valid_json_and_save, strip_code_fences
from utils.path_utils import level_dir
from pathlib import Path

client = get_openai_client()

def call_openai_json(*, out_dir: Path, file_name: str, **openai_params: Any) -> str:
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

    return ensure_valid_json_and_save(text, out_dir / file_name)

def generate_level(*, out_dir: Path) -> str:
    generated_level = call_openai_json(
        out_dir=out_dir,
        file_name="generated_level.json",
        model=GPT_MINI,
        input=load_prompt([
            "prompt_pseudo_code",
            "prompt_principals",
            "prompt_graph",
            "prompt_level_examples",
        ]),
    )
    print("Level generated")
    return generated_level

def parse_validator_verdict(text: str) -> Dict[str, Any]:
    cleaned = strip_code_fences(text)
    try:
        obj = json.loads(cleaned)
    except Exception as e:
        raise HTTPException(status_code=502, detail={
            "message": "Validator nem érvényes JSON-t adott vissza",
            "raw": text[:500],
            "error": str(e),
        })

    if not isinstance(obj, dict):
        raise HTTPException(status_code=502, detail={"message": "Validator output nem objektum", "raw": obj})

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

def validate_level(*, level_json: str, out_dir: Path) -> Dict[str, Any]:
    validator_prompt = load_prompt(["prompt_level_validate"])
    verdict_text = call_openai_json(
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
{level_json}
""",
    )
    return parse_validator_verdict(verdict_text)

def assemble_repair_prompt(level_json: str, issue_report: List[str] | None) -> str:
    prompt = load_prompt(["prompt_level_repair"])
    issue_text = json.dumps(issue_report, ensure_ascii=False, indent=2)
    return f"""
{prompt}
Issue Report:
{issue_text}

Generated Level Json:
{level_json}

JSON code rules:
{load_prompt(["prompt_pseudo_code"])}

Level structure principals:
{load_prompt(["prompt_principals"])}
"""

def repair_level(*, current_level: str, validation: Dict[str, Any], round_idx: int, out_dir: Path) -> str:
    repaired = call_openai_json(
        out_dir=out_dir,
        file_name=f"repaired_level_round{round_idx}.json",
        model=GPT_5_2,
        input=assemble_repair_prompt(current_level, issue_report=validation["issues"]),
        reasoning={"effort": "none"},
        temperature=0,
    )
    return repaired

def generate_level_json() -> Dict[str, Any]:
    level_id = str(uuid.uuid4())
    out_dir = level_dir(level_id)

    current_level = generate_level(out_dir=out_dir)
    last_validation: Dict[str, Any] | None = None

    for round_idx in range(0, MAX_REPAIR_ROUNDS):
        validation = validate_level(level_json=current_level, out_dir=out_dir)
        last_validation = validation

        if validation["solvable"] is True:
            level_obj = json.loads(current_level)
            level_obj["derivation"] = validation.get("derivation")
            level_obj["id"] = level_id
            ensure_valid_json_and_save(
                json.dumps(level_obj, ensure_ascii=False),
                out_dir / "final_level.json"
            )
            return level_obj, out_dir

        print(f"Validation failed (round {round_idx}): {validation['issues']}")
        current_level = repair_level(
            current_level=current_level,
            validation=validation,
            round_idx=round_idx,
            out_dir=out_dir,
        )

    raise HTTPException(
        status_code=500,
        detail={
            "message": "Nem sikerült végigjátszható pályát generálni.",
            "level_id": level_id,
            "out_dir": str(out_dir),
            "max_repair_rounds": MAX_REPAIR_ROUNDS,
            "last_validation": last_validation,
        },
    )

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
