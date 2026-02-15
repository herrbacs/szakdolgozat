from config import PROMPTS_DIR

def load_prompt(prompt_files: list[str]) -> str:
    prompts: list[str] = []
    for file in prompt_files:
        with open((PROMPTS_DIR / file ), "r", encoding="utf-8") as f:
            prompts.append(f.read())
    return "\n\n".join(prompts)
