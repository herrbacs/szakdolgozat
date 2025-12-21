from fastapi import FastAPI
from openai import OpenAI

app = FastAPI()

client = OpenAI(
  api_key="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"
)



@app.get("/generate")
def generate():
    print("Hello Request")

    file_path = f'C:\\UNIVERSITY\\Szakdolgozat\\ai-escape-room-api\\prompt'
    with open(file_path, "r", encoding="utf-8") as f:
        prompt = f.read()

    response = client.responses.create(
      model="gpt-5-mini",
      input=prompt,
      store=True,
    )

    return {"response": response}
