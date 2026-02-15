from src.services.level_service import generate_new_level, find_objects_with_id_and_inspection
from src.services.sprite_service import generate_ui_sprites, generate_level_object_sprites

def generate_new_level_handler():
    level, level_id = generate_new_level()
    level_objects = find_objects_with_id_and_inspection(level)
    generate_ui_sprites(level_id)
    generate_level_object_sprites(level_objects, level_id)

    return level
