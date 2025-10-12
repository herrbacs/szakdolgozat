from flask import Blueprint, Response, send_from_directory
import json
from .services.level_generator import generate_level_information

routes = Blueprint("routes", __name__)

@routes.route("/")
def hello_world():
    return { "message": "Hello World" }

@routes.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('./sprites', filename)

@routes.route("/generate-level")
def generate_level():
    return Response(json.dumps(generate_level_information()), content_type="application/json")
