from fastapi import FastAPI
from services.level_service import generate_level_json, find_objects_with_id_and_inspection
from postprocess.normalize_ids import normalize_level_id_structures
from services.sprite_service import generate_ui_sprites, generate_game_object_sprites
from config import PROJECT_ROOT
import json
from pathlib import Path

app = FastAPI()

@app.get("/generate")
def generate():

    # level_obj, out_dir = generate_level_json()
    # normalized_level, id_map = normalize_level_id_structures(level_obj)
    # generate_ui_sprites(out_dir=PROJECT_ROOT)
    
    

    # JSON fájl útvonala
    json_path = PROJECT_ROOT / "levels/39e0f002-544b-4584-aa23-777d35700e5f/final_level.json"

    # JSON beolvasása
    with open(json_path, "r", encoding="utf-8") as f:
        normalized_level = json.load(f)
    
    found_objects = find_objects_with_id_and_inspection(normalized_level)
    generate_game_object_sprites(found_objects, PROJECT_ROOT)

    # return {
    #     "response": normalized_level,
    #     "id_map": id_map
    # }
    