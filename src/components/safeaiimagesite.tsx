import React, { useState } from "react";

const BLOCK = [
  "porn","nsfw","nude","nudity","explicit","sex","sexual","fetish","erotic","adult",
  "xxx","underage","incest","rape","loli","shota","revenge porn","deepfake",
  "strip","boobs","genitals","penis","vagina"
];

function checkPrompt(p: string): string | null {
  const t = p.toLowerCase().trim();
  if (!t) return "Please enter a prompt.";
  if (t.length > 300) return "Prompt too long (max 300 chars).";
  if (BLOCK.some(k => t.includes(k))) return "Blocked by safety policy. Use non-explicit ideas.";
  return null;
}

export default function SafeAIImageSite() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setImageUrl(null);
    const bad = checkPrompt(prompt);
    if (bad) { setError(bad); return; }

    setLoading(true);
    try {
      // Demo image (no external APIs). Always enforce server-side moderation if you add one later.
      const svg = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='1024' height='640'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#eaeef6'/>
              <stop offset='100%' stop-color='#cfd8ea'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                font-family='Segoe UI, system-ui, sans-serif' font-size='28' fill='#111'>
            ${prompt.replace(/</g, "&lt;").slice(0, 60)}
          </text>
        </svg>
      `);
      setImageUrl(`data:image/svg+xml;charset=utf-8,${svg}`);
    } catch (e: any) {
      setError(e?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  const box: React.CSSProperties = {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,.06)"
  };

  return (
    <div>
      <h1 style={{fontSize: 28, fontWeight: 600, margin: "0 0 8px"}}>Safe AI Image Playground</h1>
      <p style={{margin: "0 0 20px", color: "#475569"}}>
        Generate creative, non-explicit images. This demo uses a local SVG preview.
      </p>

      <div style={{display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr"}}>
        <div style={box}>
          <label htmlFor="p" style={{display:"block", fontWeight:600, marginBottom:8}}>Prompt</label>
          <textarea
            id="p"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g., a futuristic glass city at sunset"
            style={{width:"100%", height:140, border:"1px solid #cbd5e1", borderRadius:12, padding:12, resize:"vertical"}}
          />
          <div style={{display:"flex", gap:8, marginTop:12}}>
            <button
              onClick={generate}
              disabled={loading}
              style={{padding:"10px 16px", borderRadius:12, border:"none", background:"#111827", color:"#fff", cursor:"pointer", opacity: loading ? .7 : 1}}
            >
              {loading ? "Generating…" : "Generate"}
            </button>
            <button
              onClick={() => { setPrompt(""); setImageUrl(null); setError(null); }}
              style={{padding:"10px 14px", borderRadius:12, border:"1px solid #cbd5e1", background:"#fff", cursor:"pointer"}}
            >
              Reset
            </button>
          </div>
          {error && (
            <div role="alert" style={{marginTop:12, color:"#7f1d1d", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:12, padding:10}}>
              {error}
            </div>
          )}
          <ul style={{marginTop:12, color:"#475569", fontSize:14, lineHeight:1.5}}>
            <li>Client filter is a UX guardrail. Add server-side moderation if you integrate a real API.</li>
            <li>Keep content non-explicit and lawful.</li>
          </ul>
        </div>

        <div style={box}>
          <div style={{aspectRatio: "16 / 10", width: "100%", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", borderRadius:12, background:"#f8fafc", border:"1px solid #e2e8f0"}}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Generated" style={{width:"100%", height:"100%", objectFit:"cover"}} />
            ) : (
              <span style={{color:"#64748b"}}>Your generated image will appear here</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


