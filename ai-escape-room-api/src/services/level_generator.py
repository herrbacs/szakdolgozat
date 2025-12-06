import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_level_information():
    file_path = os.path.join(BASE_DIR, "level.json")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# def generate_perspective_of_images(level_information):
#     for wall in level_information["walls"]:    
#         if wall['inspectables']:
#             for inspectable in wall['inspectables']:
#                 for sprite in inspectable['sprites']:
#                     generatePerspectiveTransformationsOfImage(sprite['name'])
#         if wall['interactables']:
#             for interactable in wall['interactables']:
#                 for sprite in interactable['sprites']:
#                     generatePerspectiveTransformationsOfImage(sprite['name'])
#                 if interactable['holds']['pickable'] is not None:
#                     generatePerspectiveTransformationsOfImage(interactable['holds']['pickable']['sprite']['name'])    
#                 if interactable['holds']['inspectable'] is not None:
#                     for sprite in interactable['holds']['inspectable']['sprites']:
#                         generatePerspectiveTransformationsOfImage(sprite['name'])
          
# def generate_blob_to_images(level_information):
#     for wall in level_information["walls"]:    
#         if "exit" in wall:
#             for sprite in wall['exit']['sprites']:
#                 sprite['blob'] = convert_images_into_blob(sprite['name'])
#         if wall['pickables']:
#             for pickable in wall['pickables']:
#                     pickable['sprite']['blob'] = convert_images_into_blob(pickable['sprite']['name'])
#         if wall['inspectables']:
#             for inspectable in wall['inspectables']:
#                 for sprite in inspectable['sprites']:
#                     sprite['blob'] = convert_images_into_blob(sprite['name'])
#                     if sprite['perspective']:
#                         sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
#                         sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])
#         if wall['interactables']:
#             for interactable in wall['interactables']:
#                 for sprite in interactable['sprites']:
#                     sprite['blob'] = convert_images_into_blob(sprite['name'])
#                     if sprite['perspective']:
#                         sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
#                         sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])
#                 if interactable['holds']['pickable'] is not None:
#                     sprite = interactable['holds']['pickable']['sprite']
#                     sprite['blob'] = convert_images_into_blob(sprite['name'])
#                     if sprite['perspective']:
#                         sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
#                         sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])    
#                 if interactable['holds']['inspectable'] is not None:
#                     for sprite in interactable['holds']['inspectable']['sprites']:
#                         sprite['blob'] = convert_images_into_blob(sprite['name'])
#                     if sprite['perspective']:
#                         sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
#                         sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])
