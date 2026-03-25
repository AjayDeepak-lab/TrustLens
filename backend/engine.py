import os
from tavily import TavilyClient
from langchain_ollama import ChatOllama
from dotenv import load_dotenv

load_dotenv()

# Using the 1.5B model for maximum speed on your laptop
llm = ChatOllama(model="qwen2.5:1.5b", temperature=0)

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def verify_content(text: str):
    print(f"\n⚡ [FAST-TRACK] Processing: {text[:50]}...")
    
    # STEP 1: Fast Extraction
    # We limit to 2 claims to save verification time
    extract_prompt = f"Extract the 2 most important factual claims from this text. Return as a numbered list only: {text}"
    
    try:
        claims_raw = llm.invoke(extract_prompt).content
        claims = [c.strip() for c in claims_raw.split('\n') if c.strip() and any(char.isdigit() for char in c[:2])]
        
        if not claims:
            claims = [text[:100]] # Fallback to first 100 chars
    except Exception as e:
        print(f"❌ Extraction Error: {e}")
        return [{"claim": "Error", "analysis": "Check if Ollama is running."}]

    final_results = []

    # STEP 2 & 3: Optimized Research & Single-Sentence Verdict
    for claim in claims[:2]: # Processing 2 claims is 33% faster than 3
        try:
            print(f"🔍 Searching: {claim[:40]}...")
            # max_results=2 is faster than 3
            search_data = tavily.search(query=claim, search_depth="basic", max_results=2)
            
            # Simplified prompt for faster text generation
            verify_prompt = f"""
            Evidence: {search_data}
            Claim: {claim}
            Task: Provide Verdict (True/False) and a 1-sentence reason.
            """
            
            print(f"🧠 Reasoning...")
            verdict = llm.invoke(verify_prompt).content
            
            final_results.append({
                "claim": claim,
                "analysis": verdict.strip()
            })
        except Exception as e:
            print(f"⚠️ Skip: {e}")
            continue

    print("🏁 Done.")
    return final_results