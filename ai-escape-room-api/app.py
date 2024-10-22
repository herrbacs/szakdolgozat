import os, json, io, base64

from PIL import Image
from flask import Flask, send_from_directory, Response
from flask_cors import CORS

app = Flask(__name__)

if os.environ["ENVIRONMENT"] == "development":
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/")
def hello_world():
    return {
        "message": "Hello World"
    }

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('./sprites', filename)

@app.route("/generate-level")
def generate_level():
    level_information = {
       "walls": [
            {
                "id": "bc654ebc-1c6b-4355-8aec-01f12ab39fad",
                "color": "0x1099bb",
                "exit": {
                    "keeyId": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                    "sprites": [
                        {
                            "state": "CLOSED",
                            "name": "exit_closed.png",
                            "dimension": {
                                "width": "350",
                                "height": "500"
                            }
                        },
                        {
                            "state": "OPEN",
                            "name": "exit_opened.png",
                            "dimension": {
                                "width": "350",
                                "height": "500"
                            }
                        }
                    ]
                },
                "pickables": [
                    {
                        "id": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                        "position": "FT2",
                        "name": "Exit Key",
                        "sprite": {
                            "dimension": {
                                "width": "199",
                                "height": "471",
                            },
                            "name": "exit_key.png"
                        },
                        "reusable": "false",
                    }
                ]
            },
            {
                "id": "e4843042-0ca9-4e03-b45e-c860b56b390a",
                "color": "0xffc300",
                "pickables": [],
            },
            {
                "id": "3f3c2958-bbe7-448a-b58c-98385540f5b1",
                "color": "0xff5733",
                "pickables": [],
            },
            {
                "id": "85d55920-9bd1-45f8-ac9d-bc413db42f8e",
                "color": "0x581845",
                "pickables": [],
            }
        ]
    }

    for wall in level_information["walls"]:    
        if "exit" in wall:
            for sprite in wall['exit']['sprites']:
                sprite['blob'] = convert_images_into_blob(sprite['name'])
        if wall['pickables']:
            for pickable in wall['pickables']:
                    pickable['sprite']['blob'] = convert_images_into_blob(pickable['sprite']['name'])

    return Response(json.dumps(level_information), content_type="application/json")

if __name__ == "__main__":
    app.run(debug=True)

def convert_images_into_blob(img_name):
    root_folder = './sprites/'
    with open(root_folder+img_name, 'rb') as image_file:
        image = Image.open(image_file)
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_blob = img_byte_arr.getvalue()
        img_base64 = base64.b64encode(img_blob).decode('utf-8')
    return img_base64