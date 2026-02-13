from config import PROMPT_BASE_PATH

def load_prompt(prompt_files: list[str]) -> str:
    prompts: list[str] = []
    for file in prompt_files:
        with open(f"{PROMPT_BASE_PATH}\\{file}", "r", encoding="utf-8") as f:
            prompts.append(f.read())
    return "\n\n".join(prompts)
