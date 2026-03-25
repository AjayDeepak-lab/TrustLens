# 🛡️ TrustLens AI 
An advanced fact-checking engine that utilizes **Local LLMs** and **Real-time Web Search** to verify claims.

### 🚀 Tech Stack
- **Frontend:** React + Tailwind CSS + Lucide Icons
- **Backend:** FastAPI (Python)
- **AI Brain:** Ollama (Llama 3 / Phi-3 / Qwen2.5)
- **Search Engine:** Tavily API

### 🛠️ Setup Instructions
1. **Ollama:** Install Ollama and run `ollama pull phi3`.
2. **Backend:** - `cd backend`
   - `pip install -r requirements.txt`
   - Create `.env` with `TAVILY_API_KEY`.
   - `python main.py`
3. **Frontend:** - `cd frontend`
   - `npm install`
   - `npm run dev`
