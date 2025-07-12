from fastapi import FastAPI
import requests

app=FastAPI()

@app.get("/")
def root():
    return {"message":"Resume Genie backend is running"}

@app.post("/generate-cover-letter")
def generate_cover_letter():
    prompt = """
    write a professional, concise cover letter for a Software Engineer applying to a role at Google. The candidate has 4 years of experience in full stack development, Java, React, AWS.
    """

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model":"mistral",
            "prompt":prompt,
            "stream":False
        }
    )
    print("Ollama raw response:", response.text)

    result=response.json()
    return {"cover_letter":result.get("response")}