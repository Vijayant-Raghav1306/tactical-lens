"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import AnalysisResult from "@/components/AnalysisResult";

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");

  function handleFileSelect(selectedFile: File) {
    setFile(selectedFile);
    setAnalysis(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  }

  async function handleAnalyse() {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", file);
    if (query.trim()) formData.append("query", query.trim());

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data.analysis ?? data.error);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setAnalysis(`ERROR: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Tactical Lens</h1>
            <p className="text-xs text-white/40">AI-powered football analysis</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Drop any match screenshot</h2>
          <p className="text-white/50 text-sm">
            Upload a screenshot, heatmap or pass map — then ask anything about it
          </p>
        </div>

        {/* Upload */}
        <UploadBox onFileSelect={handleFileSelect} loading={loading} hasFile={!!file} />

        {/* Image preview */}
        {preview && (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img src={preview} alt="Uploaded screenshot" className="w-full object-contain max-h-80" />
          </div>
        )}

        {/* Query input */}
        {file && (
          <div className="flex flex-col gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Optional — add context or ask something specific...\n\nExamples:\n• "This is Bellingham's heatmap, compare his movement to a typical #8"\n• "Focus on the pressing patterns in this screenshot"\n• "This is from the WC final, analyse both team shapes"`}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              onClick={handleAnalyse}
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Analysing..." : "Analyse"}
            </button>
          </div>
        )}

        {/* Result */}
        {(loading || analysis) && (
          <AnalysisResult analysis={analysis} loading={loading} />
        )}
      </div>
    </main>
  );
}
