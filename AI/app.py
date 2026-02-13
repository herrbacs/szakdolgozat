from fastapi import FastAPI
from services.level_service import generate_level_json
from postprocess.normalize_ids import normalize_level_id_structures
from services.sprite_service import generate_ui_sprites
from config import PROJECT_ROOT

app = FastAPI()

@app.get("/generate")
def generate():

    # level_obj, out_dir = generate_level_json()
    # normalized_level, id_map = normalize_level_id_structures(level_obj)
    # generate_ui_sprites(out_dir)
    generate_ui_sprites(out_dir=PROJECT_ROOT)
    # return {
    #     "response": normalized_level,
    #     "id_map": id_map
    # }