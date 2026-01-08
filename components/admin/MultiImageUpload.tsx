"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Plus } from "lucide-react";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket: "setups" | "produtos";
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  bucket,
  maxImages = 10,
  className = "",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = value.length < maxImages;

  const handleUpload = useCallback(
    async (file: File) => {
      if (!canAddMore) {
        setError(`Máximo de ${maxImages} imagens permitidas.`);
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Formato inválido. Use JPG, PNG ou WebP.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Imagem muito grande. Máximo 5MB.");
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erro ao fazer upload");
        }

        const data = await response.json();
        onChange([...value, data.url]);
      } catch (err) {
        console.error("Erro no upload:", err);
        setError("Erro ao fazer upload. Tente novamente.");
      } finally {
        setUploading(false);
      }
    },
    [bucket, onChange, value, canAddMore, maxImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      e.target.value = "";
    },
    [handleUpload]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    },
    [value, onChange]
  );

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
        {/* Imagens existentes */}
        {value.map((url, index) => (
          <div
            key={url}
            className="relative w-20 h-20 rounded-xl overflow-hidden group"
          >
            <Image
              src={url}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}

        {/* Botão de adicionar */}
        {canAddMore && (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center transition-colors ${
              dragOver
                ? "border-[#0071e3] bg-[#0071e3]/10"
                : "border-[var(--border)] hover:border-[var(--text-secondary)] bg-[var(--background)]"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <Loader2 className="h-5 w-5 text-[#0071e3] animate-spin" />
            ) : (
              <Plus className="h-5 w-5 text-[var(--text-secondary)]" />
            )}
          </label>
        )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
