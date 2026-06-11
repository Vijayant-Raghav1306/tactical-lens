"use client";

interface Props {
  analysis: string | null;
  loading: boolean;
}

const sections = [
  { key: "Formation", icon: "🔷" },
  { key: "Tactical Shape", icon: "🧱" },
  { key: "Pressing", icon: "⚡" },
  { key: "Space & Positioning", icon: "📐" },
  { key: "Key Insight", icon: "💡" },
];

export default function AnalysisResult({ analysis, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-white/10 rounded animate-pulse" style={{ width: `${70 + i * 8}%` }} />
        ))}
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <span className="text-green-400 text-lg">✦</span>
        <h3 className="font-semibold text-white">Tactical Breakdown</h3>
      </div>

      <div className="text-white/80 text-sm leading-7 whitespace-pre-wrap">
        {analysis}
      </div>

      <p className="text-white/20 text-xs pt-2 border-t border-white/10">
        Powered by GPT-4o Mini · Tactical Lens
      </p>
    </div>
  );
}
