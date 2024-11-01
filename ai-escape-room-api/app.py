import os, json, io, base64

from PIL import Image
from flask import Flask, send_from_directory, Response
from flask_cors import CORS
import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt

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
                    "state": "CLOSED",
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
                ],
                "inspectables": [],
            },
            {
                "id": "e4843042-0ca9-4e03-b45e-c860b56b390a",
                "color": "0xffc300",
                "pickables": [],
                "inspectables": [
                    {
                        "id": "4558d2bb-8af1-4d38-9b64-cdefe6031cf9",
                        "position": "WT1",
                        "text": "The time is 14:30",
                        "type": "CLOCK",
                        "sprites": [
                            {
                                "state": "DEFAULT",
                                "name": "clock.png",
                                "dimension": {
                                    "width": "327",
                                    "height": "326"
                                },
                                "perspective": {
                                    "right": {
                                        "state": "DEFAULT",
                                        "name": "clock_right_perspective.png",
                                        "dimension": {
                                            "width": "327",
                                            "height": "326"
                                        },
                                    },
                                    "left": {
                                        "state": "DEFAULT",
                                        "name": "clock_left_perspective.png",
                                        "dimension": {
                                            "width": "327",
                                            "height": "326"
                                        },
                                    },
                                },
                            }
                        ]
                    }
                ],
            },
            {
                "id": "3f3c2958-bbe7-448a-b58c-98385540f5b1",
                "color": "0xff5733",
                "pickables": [],
                "inspectables": [],
            },
            {
                "id": "85d55920-9bd1-45f8-ac9d-bc413db42f8e",
                "color": "0x581845",
                "pickables": [],
                "inspectables": [],
            }
        ]
    }

    for wall in level_information["walls"]:    
        if wall['inspectables']:
            for inspectable in wall['inspectables']:
                for sprite in inspectable['sprites']:
                    generatePerspectiveTransformationsOfImage(sprite['name'])

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

def generatePerspectiveTransformationsOfImage(imgName):
    root = os.getcwd()
    imgPath = os.path.join(root, 'sprites/', imgName)
    img = cv.imread(imgPath, cv.IMREAD_UNCHANGED)

    height, width = img.shape[:2]

    # The Original Image 4 corners
    p1 = np.array([[0, 0],
                   [width, 0],
                   [0, height],
                   [width, height]], dtype=np.float32)

    perspective = 80

    r_topLeft = [perspective, perspective]
    r_topRight = [width - perspective, 0]
    r_bottomLeft = [perspective, height - perspective]
    r_bottomRight = [width - perspective, height]
    desiredRightTransformation = np.array([r_topLeft, r_topRight, r_bottomLeft, r_bottomRight], dtype=np.float32)

    l_topLeft = [perspective, 0]
    l_topRight = [width - perspective, perspective]
    l_bottomLeft = [perspective, height]
    l_bottomRight = [width - perspective, height-perspective]
    desiredLeftTransformation = np.array([l_topLeft, l_topRight, l_bottomLeft, l_bottomRight], dtype=np.float32)

    # Compute the perspective transformation matrix
    RT = cv.getPerspectiveTransform(p1, desiredRightTransformation)
    LT = cv.getPerspectiveTransform(p1, desiredLeftTransformation)

    # Apply the transformation
    rightImgTrans = cv.warpPerspective(img, RT, (width, height))
    leftImgTrans = cv.warpPerspective(img, LT, (width, height))

    filename = imgName.replace('.png', '')
    cv.imwrite(os.path.join(root, 'sprites/', f'{filename}_right_perspective.png'), rightImgTrans)
    cv.imwrite(os.path.join(root, 'sprites/', f'{filename}_left_perspective.png'), leftImgTrans)
