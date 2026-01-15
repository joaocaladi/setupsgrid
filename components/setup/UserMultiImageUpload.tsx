"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Loader2, Plus } from "lucide-react";

interface UserMultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket: "setups" | "produtos";
  maxImages?: number;
  className?: string;
}

export function UserMultiImageUpload({
  value = [],
  onChange,
  bucket,
  maxImages = 10,
  className = "",
}: UserMultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = value.length < maxImages;
  const remainingSlots = maxImages - value.length;

  const uploadSingleFile = useCallback(
    async (file: File): Promise<string | null> => {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        return null;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        // Use user upload endpoint
        const response = await fetch("/api/user/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.url;
      } catch {
        return null;
      }
    },
    [bucket]
  );

  const handleMultipleUploads = useCallback(
    async (files: File[]) => {
      if (!canAddMore) {
        setError(`Máximo de ${maxImages} imagens permitidas.`);
        return;
      }

      // Filter valid files
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const validFiles = files.filter(
        (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
      );

      if (validFiles.length === 0) {
        setError("Nenhum arquivo válido. Use JPG, PNG ou WebP até 5MB.");
        return;
      }

      // Limit to available slots
      const filesToUpload = validFiles.slice(0, remainingSlots);

      if (validFiles.length > remainingSlots) {
        setError(`Apenas ${remainingSlots} imagem(ns) podem ser adicionadas.`);
      } else {
        setError(null);
      }

      setUploading(true);
      const totalFiles = filesToUpload.length;
      const uploadedUrls: string[] = [];

      // Upload with progress
      for (let i = 0; i < filesToUpload.length; i++) {
        setUploadProgress(`${i + 1}/${totalFiles}`);
        const url = await uploadSingleFile(filesToUpload[i]);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
      }

      setUploading(false);
      setUploadProgress("");

      if (uploadedUrls.length < filesToUpload.length) {
        setError(
          `${uploadedUrls.length} de ${filesToUpload.length} imagens enviadas.`
        );
      }
    },
    [canAddMore, maxImages, remainingSlots, uploadSingleFile, onChange, value]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleMultipleUploads(files);
      }
    },
    [handleMultipleUploads]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await handleMultipleUploads(files);
      }
      e.target.value = "";
    },
    [handleMultipleUploads]
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
      {/* Existing images */}
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

      {/* Add button */}
      {canAddMore && (
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
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-5 w-5 text-[#0071e3] animate-spin" />
              {uploadProgress && (
                <span className="text-[9px] text-[#0071e3] mt-1">
                  {uploadProgress}
                </span>
              )}
            </div>
          ) : (
            <Plus className="h-5 w-5 text-[var(--text-secondary)]" />
          )}
        </label>
      )}

      {error && <p className="w-full mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
