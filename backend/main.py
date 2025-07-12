from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import os


load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://resume-genie-frontend-alpha.vercel.app"],  # or ["*"] for all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CoverLetterInput(BaseModel):
    resume: str
    job_description: str

@app.post("/generate-cover-letter")
def generate_cover_letter(data: CoverLetterInput):
    prompt = f"""
Write a cover letter using the following resume and job description:

Resume:
{data.resume}

Job Description:
{data.job_description}

Output only the cover letter.
"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/your-github-username/resume-genie",  # optional
        "X-Title": "resume-genie"
    }

    body = {
        "model": "gryphe/mythomax-l2-13b",  # Free, fast, high quality
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
        response.raise_for_status()
        result = response.json()

        return {
            "cover_letter": result['choices'][0]['message']['content'].strip()
        }

    except Exception as e:
        return {"error": str(e)}
