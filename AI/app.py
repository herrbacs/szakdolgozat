from fastapi import FastAPI
from services.level_service import generate_level_json
from postprocess.normalize_ids import normalize_level_id_structures

app = FastAPI()

@app.get("/generate")
def generate():
    level_obj, out_dir = generate_level_json()
    normalized_level, id_map = normalize_level_id_structures(level_obj)

    return {
        "response": normalized_level,
        "id_map": id_map
    }