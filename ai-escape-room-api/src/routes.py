from flask import Blueprint, Response, send_from_directory
import json
from .services.level_generator import get_level_information
from .services.image_utils import convert_images_into_blob, generatePerspectiveTransformationsOfImage

routes = Blueprint("routes", __name__)

@routes.route("/")
def hello_world():
    return { "message": "Hello World" }

@routes.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('./sprites', filename)

@routes.route("/generate-level")
def generate_level():
    level_information = get_level_information()

    for wall in level_information["walls"]:    
        if wall['inspectables']:
            for inspectable in wall['inspectables']:
                for sprite in inspectable['sprites']:
                    generatePerspectiveTransformationsOfImage(sprite['name'])
        if wall['interactables']:
            for interactable in wall['interactables']:
                for sprite in interactable['sprites']:
                    generatePerspectiveTransformationsOfImage(sprite['name'])
                if interactable['holds']['pickable'] is not None:
                    generatePerspectiveTransformationsOfImage(interactable['holds']['pickable']['sprite']['name'])    
                if interactable['holds']['inspectable'] is not None:
                    for sprite in interactable['holds']['inspectable']['sprites']:
                        generatePerspectiveTransformationsOfImage(sprite['name'])    

    # Convert Images Into Blob
    for wall in level_information["walls"]:    
        if "exit" in wall:
            for sprite in wall['exit']['sprites']:
                sprite['blob'] = convert_images_into_blob(sprite['name'])
        if wall['pickables']:
            for pickable in wall['pickables']:
                    pickable['sprite']['blob'] = convert_images_into_blob(pickable['sprite']['name'])
        if wall['inspectables']:
            for inspectable in wall['inspectables']:
                for sprite in inspectable['sprites']:
                    sprite['blob'] = convert_images_into_blob(sprite['name'])
                    if sprite['perspective']:
                        sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
                        sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])
        if wall['interactables']:
            for interactable in wall['interactables']:
                for sprite in interactable['sprites']:
                    sprite['blob'] = convert_images_into_blob(sprite['name'])
                    if sprite['perspective']:
                        sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
                        sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])
                if interactable['holds']['pickable'] is not None:
                    sprite = interactable['holds']['pickable']['sprite']
                    sprite['blob'] = convert_images_into_blob(sprite['name'])
                    if sprite['perspective']:
                        sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
                        sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])    
                if interactable['holds']['inspectable'] is not None:
                    for sprite in interactable['holds']['inspectable']['sprites']:
                        sprite['blob'] = convert_images_into_blob(sprite['name'])
                    if sprite['perspective']:
                        sprite['perspective']['left']['blob'] = convert_images_into_blob(sprite['perspective']['left']['name'])
                        sprite['perspective']['right']['blob'] = convert_images_into_blob(sprite['perspective']['right']['name'])   

    return Response(json.dumps(level_information), content_type="application/json")
