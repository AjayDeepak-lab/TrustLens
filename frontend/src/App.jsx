import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Search, Loader2, Globe, CheckCircle, Info } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend is unreachable. Ensure 'python main.py' is running!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                TrustLens <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Fact-Check Engine</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Globe size={16} />
            <span>Powered by qwen2.5 & Tavily</span>
          </div>
        </header>

        {/* Input Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-blue-100/50 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Info size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Verification Portal
            </h2>
          </div>
          
          <textarea 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-lg"
            rows="4"
            placeholder="Paste news text or a URL to verify..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24}/> Cross-Referencing Evidence...</>
            ) : (
              <><Search size={22}/> Verify Authenticity</>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {results.length > 0 ? (
            results.map((res, index) => (
              <div key={index} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-md hover:shadow-lg transition-shadow border-t-8 border-t-blue-600 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3 text-blue-600 mb-4">
                  <CheckCircle size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Verified Claim {index + 1}</span>
                </div>
                
                <h3 className="font-extrabold text-xl text-slate-800 mb-6 leading-snug">
                  {res.claim}
                </h3>
                
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                  <p className="text-slate-700 leading-relaxed font-medium italic">
                    {res.analysis}
                  </p>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-24 border-4 border-dashed border-slate-200 rounded-[40px] bg-white/50">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-semibold">System idle. Awaiting input for analysis.</p>
              </div>
            )
          )}
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm font-medium border-t border-slate-200 pt-8">
          TrustLens AI © 2026 • Advanced Information Security Project
        </footer>
      </div>
    </div>
  );
}

export default App;