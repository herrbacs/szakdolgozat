import json
from pathlib import Path
from fastapi import HTTPException

def strip_code_fences(text: str) -> str:
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()
    return cleaned

def ensure_valid_json_and_save(json_text: str, save_file_path: str | Path) -> str:
    save_file_path = Path(save_file_path)
    cleaned = strip_code_fences(json_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        save_file_path.parent.mkdir(parents=True, exist_ok=True)
        bad_path = save_file_path.parent / "last_bad_json.txt"
        bad_path.write_text(cleaned, encoding="utf-8")

        start = max(0, e.pos - 200)
        end = min(len(cleaned), e.pos + 200)
        snippet = cleaned[start:end]

        raise HTTPException(status_code=502, detail={
            "message": "OpenAI nem érvényes JSON-t adott vissza",
            "error": str(e),
            "pos": e.pos,
            "context_snippet": snippet,
            "hint": f"Nézd meg: {str(bad_path)}"
        })

    save_file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(save_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return cleaned
