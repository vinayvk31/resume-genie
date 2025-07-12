# 📄 Resume Genie – AI-Powered Cover Letter Generator

Generate tailored cover letters instantly using LLMs like Mistral via OpenRouter. Built with FastAPI, React, TailwindCSS, and deployed on Render + Vercel.

---

## 🚀 Live Demo

- 🌐 Frontend: [https://resume-genie-frontend-alpha.vercel.app](https://resume-genie-frontend-alpha.vercel.app)
- 🔗 Backend: [https://resume-genie-backend-1.onrender.com/generate-cover-letter](https://resume-genie-backend-1.onrender.com/generate-cover-letter)

---

## 🧠 Tech Stack

- 🟦 React + Tailwind CSS
- ⚙️ FastAPI + Pydantic
- 🤖 LLMs via OpenRouter (Mistral)
- 📄 HTML2PDF for downloading cover letters
- 🌐 Hosted on Render (Backend) & Vercel (Frontend)

---

## 🛠️ Local Development

### 📦 Backend (FastAPI)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```
### 📄 .env Setup (in `backend/` folder)

Create a `.env` file (Do NOT commit this file to GitHub — it's listed in .gitignore) inside your `backend/` directory with the following content:

```env
OPENROUTER_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxx
```

## Run the backend:
```bash
uvicorn main:app --reload
```
## 🖥️ Frontend (React + TailwindCSS)
```bash
cd frontend
npm install
npm start
```
Edit App.js to use the local backend or deployed URL:
'http://localhost:8000/generate-cover-letter' OR 'https://resume-genie-backend-1.onrender.com/generate-cover-letter'

## 🙌 Author

Built with ❤️ by [Vinay Chowdry](https://github.com/vinaychowdry)
