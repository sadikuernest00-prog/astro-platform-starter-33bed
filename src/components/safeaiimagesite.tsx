import React, { useState } from "react";
import { motion } from "framer-motion";

const NSFW_KEYWORDS = [
  "porn", "nsfw", "nude", "nudity", "explicit", "sex", "sexual", "fetish",
  "erotic", "adult", "xxx", "underage", "incest", "rape", "loli", "shota",
  "revenge porn", "deepfake", "strip", "boobs", "genitals", "penis", "vagina"
];

function looksUnsafe(prompt: string): string | null {
  const p = prompt.toLowerCase();
  if (!p.trim()) return "Please enter a prompt.";
  if (p.length > 300) return "Prompt too long.";
  if (NSFW_KEYWORDS.some(k => p.includes(k))) {
    return "Explicit or harmful content is blocked.";
  }
  return null;
}

export default function SafeAIImageSite() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateImage() {
    setError(null);
    setImageUrl(null);
    const unsafe = looksUnsafe(prompt);
    if (unsafe) { setError(unsafe); return; }

    setLoading(true);
    try {
      // Demo image instead of API call:
      const svg = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='1024' height='768'>
          <rect width='100%' height='100%' fill='#e5e7eb'/>
          <text x='50%' y='50%' text-anchor='middle' font-family='sans-serif'
                font-size='28' fill='#111827'>
            ${prompt.replace(/</g, "&lt;").slice(0, 60)}
          </text>
        </svg>
      `);
      setImageUrl(`data:image/svg+xml;charset=utf-8,${svg}`);
    } catch (e: any) {
      setError(e?.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 p-8">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold"
        >
          Safe AI Image Playground
        </motion.h1>
        <p className="text-slate-600 mt-2">
          Generate creative, non-explicit images safely.
        </p>
      </header>

      <main className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g., a futuristic city made of glass"
            className="w-full h-40 p-4 border border-slate-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-slate-400"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={generateImage}
              disabled={loading}
              className="px-5 py-2 bg-slate-900 text-white rounded-2xl shadow hover:shadow-md disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => { setPrompt(""); setImageUrl(null); setError(null); }}
              className="px-4 py-2 border border-slate-300 rounded-2xl bg-white hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
          {error && (
            <p className="mt-4 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm">
              {error}
            </p>
          )}
        </div>

        <div className="flex-1">
          <div className="aspect-video w-full rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
            ) : (
              <p className="text-slate-500 text-sm">Generated image appears here</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
