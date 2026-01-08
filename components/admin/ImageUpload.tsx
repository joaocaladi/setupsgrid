"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket: "setups" | "produtos";
  className?: string;
  compact?: boolean;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  className = "",
  compact = false,
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
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

  // Modo compacto (80x80px)
  if (compact) {
    if (value) {
      return (
        <div className={`relative ${className}`}>
          <div className="relative w-20 h-20 rounded-xl overflow-hidden group">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="80px"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3 text-white" />
            </button>
            {label && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                {label}
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
          className={`w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-colors ${
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
            <>
              <Upload className="h-5 w-5 text-[var(--text-secondary)]" />
              {label && (
                <span className="text-[9px] text-[var(--text-secondary)] mt-1 text-center px-1">
                  {label}
                </span>
              )}
            </>
          )}
        </label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // Modo normal (aspect-video)
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
