from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import os
import fitz


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
    model: str = "gryphe/mythomax-l2-13b"  # Default model
    tone: str = "professional"

@app.post("/generate-cover-letter")
def generate_cover_letter(data: CoverLetterInput):
    prompt = f"""
Write a {data.tone} cover letter using the following resume and job description:

Resume:
{data.resume}

Job Description:
{data.job_description}

Output only the cover letter.
"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "resume-genie"
    }

    body = {
        "model": data.model, 
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

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Accept common iPhone content types
        allowed_types = ['application/pdf', 'text/plain', 'application/octet-stream']
        if file.content_type not in allowed_types:
            return JSONResponse(status_code=400, content={"error": "Unsupported file type. Only PDF and text files are allowed."})

        content = await file.read()

        # Try to detect PDF by file extension if content_type is ambiguous
        is_pdf = file.content_type == 'application/pdf' or (file.filename and file.filename.lower().endswith('.pdf'))

        if is_pdf:
            try:
                with fitz.open(stream=content, filetype="pdf") as pdf_document:
                    text = ""
                    for page in pdf_document:
                        text += page.get_text()
            except Exception as e:
                return JSONResponse(status_code=500, content={"error": f"Failed to extract text from PDF: {str(e)}"})
        else:
            try:
                # Try utf-8, fallback to latin-1 if utf-8 fails
                try:
                    text = content.decode('utf-8')
                except UnicodeDecodeError:
                    text = content.decode('latin-1')
            except Exception as e:
                return JSONResponse(status_code=500, content={"error": f"Failed to decode text file: {str(e)}"})

        return {"text": text.strip()}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"An error occurred: {str(e)}"})
