import os
import json

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
                "color": "0x1099bb",
                "objects": {
                    "exit": {
                        "keeyId": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                        "sprites": [
                            {
                                "state": "CLOSED",
                                "name": "exit_closed.png",
                                "width": "350",
                                "height": "500"
                            },
                            {
                                "state": "OPEN",
                                "name": "exit_opened.png",
                                "width": "350",
                                "height": "500"
                            }
                        ]
                    },
                    "pickables": [
                        {
                            "id": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                            "position": "FT2",
                            "name": "Exit Key",
                            "sprite": {
                                "width": "199",
                                "height": "471",
                                "name": "exit_key.png"
                            },
                        }
                    ]
                }
            },
            {
                "color": "0xffc300",
                "objects": {}
            },
            {
                "color": "0xff5733",
                "objects": {}
            },
            {
                "color": "0x581845",
                "objects": {}
            }
        ]
    }

    return Response(json.dumps(level_information), content_type="application/json")

if __name__ == "__main__":
    app.run(debug=True)