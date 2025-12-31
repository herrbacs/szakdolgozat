import json
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from typing import Any

app = FastAPI()

client = OpenAI(
  api_key="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"
)

@app.get("/generate")
def generate():
  generated_level = callOpenAI(
    input=load_prompt([
        "prompt_pseudo_code",
        "prompt_principals",
        "prompt_graph",
        "prompt_level_examples",
    ]),
    save_file_name="generated_level.json",
  )

  print("Level generated")

  repaired_level = callOpenAI(
    save_file_name="repaired_level.json",
    input=assemble_repaired_level_prompt(generated_level)
  )
  print("Level repaired")

  return {"response": json.loads(repaired_level)}

def assemble_repaired_level_prompt(generated_level):
    prompt = load_prompt(["prompt_level_repair"])

    repaired_prompt = f"""
{prompt}
```json
{generated_level}
```
"""

    return repaired_prompt

    
    

def callOpenAI(*, save_file_name: str, **open_ai_client_parameters: Any) -> str:
  kwargs = {"model": "gpt-5.2", **open_ai_client_parameters}
  response = client.responses.create(**kwargs)

  text = (response.output_text or "").strip()
  if not text:
    raise HTTPException(
        status_code=502,
        detail={
            "message": "OpenAI üres output_text-et adott vissza",
            "output_types": [o.type for o in (response.output or [])],
        },
    )

  return saveLevel(text, save_file_name)

def saveLevel(json_text: str, save_file_name: str) -> str:
  # Ha a modell ```json ...```-t küld, tisztítsd le
  cleaned = json_text.strip()
  if cleaned.startswith("```"):
    cleaned = cleaned.strip("`")
    cleaned = cleaned.replace("json", "", 1).strip()

  data = json.loads(cleaned)
  with open(save_file_name, "w", encoding="utf-8") as f:
      json.dump(data, f, ensure_ascii=False, indent=2)

  return cleaned

def load_prompt(prompt_files):
  base_path = r"C:\UNIVERSITY\Szakdolgozat\ai-escape-room-api"
  prompts = []

  for file in prompt_files:
      with open(f"{base_path}\\{file}", "r", encoding="utf-8") as f:
          prompts.append(f.read())

  return "\n\n".join(prompts)
