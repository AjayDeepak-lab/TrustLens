import requests
from bs4 import BeautifulSoup

def extract_article_text(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove noise
        for element in soup(["script", "style", "nav", "footer", "header", "aside"]):
            element.decompose()
            
        # Focus on article body or paragraphs
        paragraphs = soup.find_all('p')
        text = " ".join([p.get_text() for p in paragraphs])
        
        # Return first 3000 chars to keep LLM context clean
        return text[:3000].strip()
    except Exception as e:
        print(f"Scraping error: {e}")
        return None