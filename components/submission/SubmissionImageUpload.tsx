"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { X, Loader2, Plus, ImageIcon, GripVertical } from "lucide-react";
import imageCompression from "browser-image-compression";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageItem {
  id: string;
  url: string;
}

interface SubmissionImageUploadProps {
  value: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  submissionId: string;
  maxImages?: number;
}

function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: ImageItem;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-video rounded-xl overflow-hidden group bg-[var(--background-secondary)] border border-[var(--border)] ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <Image
        src={image.url}
        alt={`Imagem ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 200px"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
      >
        <X className="h-4 w-4 text-white" />
      </button>

      {/* Index badge */}
      {index === 0 && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#0071e3] text-white text-xs font-medium rounded-md">
          Principal
        </div>
      )}
    </div>
  );
}

export function SubmissionImageUpload({
  value = [],
  onChange,
  submissionId,
  maxImages = 10,
}: SubmissionImageUploadProps) {
  // useSyncExternalStore para SSR-safe mounted check
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const canAddMore = value.length < maxImages;
  const remainingSlots = maxImages - value.length;

  const compressImage = useCallback(async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch {
      return file;
    }
  }, []);

  const uploadSingleFile = useCallback(
    async (file: File): Promise<ImageItem | null> => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        return null;
      }

      try {
        // Comprimir imagem antes do upload
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("submissionId", submissionId);

        const response = await fetch("/api/submissions/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erro no upload");
        }

        const data = await response.json();
        return {
          id: crypto.randomUUID(),
          url: data.url,
        };
      } catch (err) {
        console.error("Erro no upload:", err);
        return null;
      }
    },
    [submissionId, compressImage]
  );

  const handleMultipleUploads = useCallback(
    async (files: File[]) => {
      if (!canAddMore) {
        setError(`Máximo de ${maxImages} imagens permitidas.`);
        return;
      }

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      const validFiles = files.filter((file) => validTypes.includes(file.type));

      if (validFiles.length === 0) {
        setError("Nenhum arquivo válido. Use JPG, PNG ou WebP.");
        return;
      }

      const filesToUpload = validFiles.slice(0, remainingSlots);

      if (validFiles.length > remainingSlots) {
        setError(`Apenas ${remainingSlots} imagem(ns) podem ser adicionadas.`);
      } else {
        setError(null);
      }

      setUploading(true);
      const totalFiles = filesToUpload.length;
      const uploadedImages: ImageItem[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        setUploadProgress(`Enviando ${i + 1}/${totalFiles}...`);
        const result = await uploadSingleFile(filesToUpload[i]);
        if (result) {
          uploadedImages.push(result);
        }
      }

      if (uploadedImages.length > 0) {
        onChange([...value, ...uploadedImages]);
      }

      setUploading(false);
      setUploadProgress("");

      if (uploadedImages.length < filesToUpload.length) {
        setError(
          `${uploadedImages.length} de ${filesToUpload.length} imagens enviadas.`
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
    (id: string) => {
      onChange(value.filter((img) => img.id !== id));
    },
    [value, onChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = value.findIndex((img) => img.id === active.id);
        const newIndex = value.findIndex((img) => img.id === over.id);
        onChange(arrayMove(value, oldIndex, newIndex));
      }
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Grid de imagens */}
      {value.length > 0 && mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {value.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={() => handleRemove(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : value.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-video rounded-xl overflow-hidden group bg-[var(--background-secondary)] border border-[var(--border)]"
            >
              <Image
                src={image.url}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#0071e3] text-white text-xs font-medium rounded-md">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* Área de upload */}
      {canAddMore && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? "border-[#0071e3] bg-[#0071e3]/10"
              : "border-[var(--border)] hover:border-[var(--text-secondary)] bg-[var(--background-secondary)]"
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
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-[#0071e3] animate-spin" />
              <span className="text-sm text-[#0071e3]">{uploadProgress}</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-[var(--background)]">
                {value.length === 0 ? (
                  <ImageIcon className="h-6 w-6 text-[var(--text-secondary)]" />
                ) : (
                  <Plus className="h-6 w-6 text-[var(--text-secondary)]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {value.length === 0
                    ? "Arraste imagens ou clique para selecionar"
                    : "Adicionar mais imagens"}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  JPG, PNG ou WebP (até {remainingSlots} imagens)
                </p>
              </div>
            </>
          )}
        </label>
      )}

      {/* Mensagem de erro */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Info sobre ordenação */}
      {value.length > 1 && (
        <p className="text-xs text-[var(--text-secondary)]">
          Arraste para reordenar. A primeira imagem será a principal do setup.
        </p>
      )}
    </div>
  );
}
