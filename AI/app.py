import json
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from typing import Any, Dict, List, Tuple

app = FastAPI()

client = OpenAI(
  api_key="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"
)

GPT_MINI = "gpt-5-mini"
GPT_5_2 = "gpt-5.2"
MAX_REPAIR_ROUNDS = 4

@app.get("/generate")
def generate():
    current_level = generate_level()

    for round_idx in range(0, MAX_REPAIR_ROUNDS):
        validation = validate_level(current_level)

        if validation["solvable"] is True:
            level_json = json.loads(current_level)
            level_json["derivation"] = validation["derivation"]
            saveResponseJson(json.dumps(level_json), "final_level.json")
            return {"response": json.loads(json.dumps(level_json)), "validation": validation}

        print(f"Validation failed (round {round_idx}): {validation['issues']}")

        current_level = repair_level(current_level, validation, round_idx)

    raise HTTPException(
        status_code=500,
        detail={
            "message": "Nem sikerült végigjátszható pályát generálni a megadott javítási körökön belül.",
            "max_repair_rounds": MAX_REPAIR_ROUNDS,
            "last_validation": validation,
        },
    )

def generate_level():
    generated_level = callOpenAI(
        model=GPT_MINI,
        input=load_prompt([
            "prompt_pseudo_code",
            "prompt_principals",
            "prompt_graph",
            "prompt_level_examples",
        ]),
        save_file_name="generated_level.json",
    )
    print("Level generated")
    return generated_level

def validate_level(level_json: str) -> Dict[str, Any]:
    if level_json is None:
        raise HTTPException(
        status_code=500,
        detail={ "message": "Hiányzó generated level" },
    )

    validator_prompt = load_prompt(["prompt_level_validate"])
    verdict_text = callOpenAI(
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
        save_file_name="last_validator_output.json"
    )

    return parse_validator_verdict(verdict_text)

def repair_level(current_level, validation, round_idx):
    callOpenAI(
        model=GPT_5_2,
        input=assemble_repair_prompt(current_level, issue_report=validation["issues"]),
        save_file_name=f"repaired_level_round{round_idx}.json",
        reasoning={"effort": "none"},
        temperature=0,
    )
    print(f"Level repaired round {round_idx}")


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

def parse_validator_verdict(text: str) -> Dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()

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


def callOpenAI(*, save_file_name: str, **open_ai_client_parameters: Any) -> str:
    kwargs = {**open_ai_client_parameters}
    response = client.responses.create(**kwargs)

    text = (response.output_text or "").strip()
    if not text:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "OpenAI üres output_text-et adott vissza",
                "output_types": [o.type for o in (response.output or [])],
            },
        )

    return saveResponseJson(text, save_file_name)


def saveResponseJson(json_text: str, save_file_name: str) -> str:
    cleaned = json_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        # mentsük le debug fájlba
        with open("last_bad_json.txt", "w", encoding="utf-8") as f:
            f.write(cleaned)

        # mutassunk egy kontextus snippetet is
        start = max(0, e.pos - 200)
        end = min(len(cleaned), e.pos + 200)
        snippet = cleaned[start:end]

        raise HTTPException(status_code=502, detail={
            "message": "OpenAI nem érvényes JSON-t adott vissza",
            "error": str(e),
            "pos": e.pos,
            "context_snippet": snippet,
            "hint": "Nézd meg a last_bad_json.txt fájlt a pontos hibás résznél (valszeg hiányzó vessző)."
        })

    with open(save_file_name, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return cleaned



def load_prompt(prompt_files):
    base_path = r"C:\UNIVERSITY\Szakdolgozat\ai-escape-room-api"
    prompts = []

    for file in prompt_files:
        with open(f"{base_path}\\{file}", "r", encoding="utf-8") as f:
            prompts.append(f.read())

    return "\n\n".join(prompts)
