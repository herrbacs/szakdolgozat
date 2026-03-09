import json
from fastapi import HTTPException
from src.services.storage_service import upload_json, upload_text, delete_level_prefix


def strip_code_fences(text: str) -> str:
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()
    return cleaned


def ensure_valid_json_and_save(json_text: str, level_id: str, file_name: str) -> str:
    cleaned = strip_code_fences(json_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        upload_text(level_id, "last_bad_json.txt", cleaned)

        start = max(0, e.pos - 200)
        end = min(len(cleaned), e.pos + 200)
        snippet = cleaned[start:end]

        # Generation fails here and level is not persisted in DB, so we clean orphaned objects.
        delete_level_prefix(level_id)

        raise HTTPException(status_code=502, detail={
            "message": "OpenAI nem érvényes JSON-t adott vissza",
            "error": str(e),
            "pos": e.pos,
            "context_snippet": snippet,
            "hint": f"Nézd meg: {level_id}/last_bad_json.txt"
        })

    upload_json(level_id, file_name, data)

    return cleaned
