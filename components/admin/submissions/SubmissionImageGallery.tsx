"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, GripVertical, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  updateSubmissionImageOrder,
  removeSubmissionImage,
} from "@/app/admin/submissions/actions";
import type { SetupSubmissionImage } from "@/types";

interface SubmissionImageGalleryProps {
  images: SetupSubmissionImage[];
  submissionId: string;
  onImagesChange: (images: SetupSubmissionImage[]) => void;
  readOnly?: boolean;
}

function SortableImageItem({
  image,
  index,
  onRemove,
  isRemoving,
  readOnly,
}: {
  image: SetupSubmissionImage;
  index: number;
  onRemove: () => void;
  isRemoving: boolean;
  readOnly?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: readOnly });

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
      className={`relative aspect-video rounded-xl overflow-hidden group bg-[var(--background)] border border-[var(--border)] ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <Image
        src={image.storagePath}
        alt={`Imagem ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 300px"
      />

      {!readOnly && (
        <>
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
            disabled={isRemoving}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-white" />
            )}
          </button>
        </>
      )}

      {/* Index badge */}
      {index === 0 && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#0071e3] text-white text-xs font-medium rounded-md">
          Principal
        </div>
      )}
    </div>
  );
}

export function SubmissionImageGallery({
  images: initialImages,
  submissionId,
  onImagesChange,
  readOnly = false,
}: SubmissionImageGalleryProps) {
  const [images, setImages] = useState(initialImages);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);
        const newImages = arrayMove(images, oldIndex, newIndex);

        // Update local state immediately
        setImages(newImages);
        onImagesChange(newImages);

        // Persist to database
        const result = await updateSubmissionImageOrder(
          submissionId,
          newImages.map((img) => img.id)
        );

        if (!result.success) {
          toast.error("Erro ao reordenar imagens");
          // Revert on error
          setImages(images);
          onImagesChange(images);
        }
      }
    },
    [images, submissionId, onImagesChange]
  );

  const handleRemove = useCallback(
    async (imageId: string) => {
      if (images.length <= 1) {
        toast.error("A submissão precisa ter pelo menos 1 imagem");
        return;
      }

      setRemovingId(imageId);

      const result = await removeSubmissionImage(imageId);

      if (result.success) {
        const newImages = images.filter((img) => img.id !== imageId);
        setImages(newImages);
        onImagesChange(newImages);
        toast.success("Imagem removida");
      } else {
        toast.error(result.error || "Erro ao remover imagem");
      }

      setRemovingId(null);
    },
    [images, onImagesChange]
  );

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhuma imagem
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((image, index) => (
              <SortableImageItem
                key={image.id}
                image={image}
                index={index}
                onRemove={() => handleRemove(image.id)}
                isRemoving={removingId === image.id}
                readOnly={readOnly}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!readOnly && images.length > 1 && (
        <p className="text-xs text-[var(--text-secondary)]">
          Arraste para reordenar. A primeira imagem será a principal do setup.
        </p>
      )}
    </div>
  );
}
