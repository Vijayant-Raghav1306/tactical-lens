"use client";

import { useRef, useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  loading: boolean;
  hasFile: boolean;
}

export default function UploadBox({ onFileSelect, loading, hasFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    onFileSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-10
        flex flex-col items-center justify-center gap-3
        cursor-pointer transition-all duration-200
        ${dragging ? "border-green-400 bg-green-400/5" : "border-white/20 hover:border-white/40 bg-white/5"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="text-4xl">{hasFile ? "✅" : "📸"}</div>
      <p className="text-white font-medium">
        {hasFile ? "Image ready — add a question below or hit Analyse" : "Drop your screenshot here"}
      </p>
      <p className="text-white/40 text-sm">
        {hasFile ? "Click to swap image" : "or click to browse — JPG, PNG supported"}
      </p>
    </div>
  );
}
