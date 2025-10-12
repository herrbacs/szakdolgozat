from flask import Flask
from flask_cors import CORS
import os
from src.routes import routes

app = Flask(__name__)
app.register_blueprint(routes)

if os.environ.get("ENVIRONMENT") == "development":
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

if __name__ == "__main__":
    app.run(debug=True)
