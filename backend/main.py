import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from engine import verify_content
from scraper import extract_article_text

# Initialize FastAPI app
app = FastAPI(title="TrustLens AI API")

# --- CORS CONFIGURATION ---
# This is CRITICAL. It allows your React app (on port 5173) 
# to talk to this Python server (on port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data structure for the request
class AnalysisRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "TrustLens AI Backend is running!"}

@app.post("/analyze")
async def analyze_news(request: AnalysisRequest):
    input_data = request.text.strip()
    
    if not input_data:
        raise HTTPException(status_code=400, detail="Input cannot be empty.")

    # Step 1: Check if input is a URL or raw text
    if input_data.startswith("http://") or input_data.startswith("https://"):
        print(f"Scraping URL: {input_data}")
        content = extract_article_text(input_data)
    else:
        content = input_data
    
    # Step 2: Safety Check
    if not content or len(content) < 10:
        raise HTTPException(status_code=400, detail="Could not extract enough text to analyze.")

    # Step 3: Run the AI Verification Engine
    try:
        print("Starting AI analysis...")
        results = verify_content(content)
        return {"status": "success", "results": results}
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Run the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)