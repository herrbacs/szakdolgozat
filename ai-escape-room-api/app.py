import os
import json

from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)

if os.environ["ENVIRONMENT"] == "development":
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/")
def hello_world():
    return {
        "message": "Hello World"
    }

@app.route("/generate-level")
def generate_level():
    level_information = {
       "walls": [
            {
                "color": "0x1099bb" 
            },
            {
                "color": "0xffc300" 
            },
            {
                "color": "0xff5733" 
            },
            {
                "color": "0x581845" 
            }
        ]
    }

    return Response(json.dumps(level_information), content_type="application/json")

if __name__ == "__main__":
    app.run(debug=True)