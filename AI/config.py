from pathlib import Path

OPENAI_API_KEY = "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"
GPT_MINI = "gpt-5-mini"
GPT_5_2 = "gpt-5.2"
MAX_REPAIR_ROUNDS = 4
PROMPT_BASE_PATH = r"C:\UNIVERSITY\Szakdolgozat\ai-escape-room-api"

PROJECT_ROOT = Path(__file__).resolve().parent
LEVELS_DIR = PROJECT_ROOT / "levels"
LEVELS_DIR.mkdir(parents=True, exist_ok=True)
