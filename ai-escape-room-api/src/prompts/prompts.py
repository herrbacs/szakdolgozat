from config import PROMPTS_DIR
from collections.abc import Mapping

def load_prompt(prompt_files: list[str], replacements: Mapping[str, str] | None = None) -> str:
    prompts: list[str] = []
    for file in prompt_files:
        with open((PROMPTS_DIR / file ), "r", encoding="utf-8") as f:
            content = f.read()
            if replacements:
                for key, value in replacements.items():
                    content = content.replace(key, value)
            prompts.append(content)
    return "\n\n".join(prompts)
