"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket: "setups" | "produtos";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      // Validar tipo
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Formato inválido. Use JPG, PNG ou WebP.");
        return;
      }

      // Validar tamanho (5MB)
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
        onChange(data.url);
      } catch (err) {
        console.error("Erro no upload:", err);
        setError("Erro ao fazer upload. Tente novamente.");
      } finally {
        setUploading(false);
      }
    },
    [bucket, onChange]
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
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
  }, [onChange]);

  if (value) {
    return (
      <div className={`relative rounded-xl overflow-hidden ${className}`}>
        <div className="relative aspect-video">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-2 bg-[var(--background-secondary)]/90 hover:bg-[var(--background-secondary)] rounded-full shadow-sm transition-colors"
        >
          <X className="h-4 w-4 text-[var(--text-primary)]" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
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
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-[#0071e3] animate-spin" />
            <span className="text-sm text-[var(--text-secondary)]">Enviando...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6">
            <Upload className="h-8 w-8 text-[var(--text-secondary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Arraste uma imagem ou clique para selecionar
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              JPG, PNG ou WebP até 5MB
            </span>
          </div>
        )}
      </label>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
