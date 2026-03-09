from pathlib import Path
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

GPT_MINI = "gpt-5-mini"
GPT_5_2 = "gpt-5.2"
MAX_REPAIR_ROUNDS = 4

PROJECT_ROOT = Path(__file__).resolve().parent
PROMPTS_DIR = PROJECT_ROOT / "src" / "prompts"
SOCKET_SERVER_URL = os.getenv("SOCKET_SERVER_URL", "http://localhost:4000")

STORAGE_ENDPOINT = os.getenv("STORAGE_ENDPOINT", "localhost:9000")
STORAGE_ACCESS_KEY = os.getenv("STORAGE_ACCESS_KEY", "minioadmin")
STORAGE_SECRET_KEY = os.getenv("STORAGE_SECRET_KEY", "minioadmin")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "levels")
STORAGE_SECURE = os.getenv("STORAGE_SECURE", "false").lower() == "true"
STORAGE_PUBLIC_BASE_URL = os.getenv("STORAGE_PUBLIC_BASE_URL", "http://localhost:9000")

with open( PROJECT_ROOT / "jwt_private.pem", "rb") as f:
    JWT_PRIVATE_KEY = f.read()

with open( PROJECT_ROOT / "jwt_public.pem", "rb") as f:
    JWT_PUBLIC_KEY = f.read()
