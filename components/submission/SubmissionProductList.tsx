"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Plus } from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SubmissionProductForm } from "./SubmissionProductForm";
import type { SubmissionProductData } from "@/lib/validations/submission";

export interface SubmissionProductWithId extends SubmissionProductData {
  _id: string;
}

type ProductWithId = SubmissionProductWithId;

interface SubmissionProductListProps {
  products: SubmissionProductWithId[];
  onChange: (products: SubmissionProductWithId[]) => void;
}

function SortableProductItem({
  product,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  product: ProductWithId;
  index: number;
  onChange: (product: ProductWithId) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SubmissionProductForm
        product={product}
        index={index}
        onChange={(updated) => onChange({ ...updated, _id: product._id })}
        onRemove={onRemove}
        canRemove={canRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function SubmissionProductList({
  products,
  onChange,
}: SubmissionProductListProps) {
  // useSyncExternalStore para SSR-safe mounted check
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = products.findIndex((p) => p._id === active.id);
        const newIndex = products.findIndex((p) => p._id === over.id);
        onChange(arrayMove(products, oldIndex, newIndex));
      }
    },
    [products, onChange]
  );

  const handleAddProduct = useCallback(() => {
    const newProduct: ProductWithId = {
      _id: crypto.randomUUID(),
      productName: "",
      productBrand: null,
      productCategory: null,
      productUrl: null,
      productPrice: null,
      notes: null,
    };
    onChange([...products, newProduct]);
  }, [products, onChange]);

  const handleUpdateProduct = useCallback(
    (index: number, updated: ProductWithId) => {
      const newProducts = [...products];
      newProducts[index] = updated;
      onChange(newProducts);
    },
    [products, onChange]
  );

  const handleRemoveProduct = useCallback(
    (index: number) => {
      onChange(products.filter((_, i) => i !== index));
    },
    [products, onChange]
  );

  return (
    <div className="space-y-4">
      {mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {products.map((product, index) => (
                <SortableProductItem
                  key={product._id}
                  product={product}
                  index={index}
                  onChange={(updated) => handleUpdateProduct(index, updated)}
                  onRemove={() => handleRemoveProduct(index)}
                  canRemove={products.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => (
            <SubmissionProductForm
              key={product._id}
              product={product}
              index={index}
              onChange={(updated) => handleUpdateProduct(index, { ...updated, _id: product._id })}
              onRemove={() => handleRemoveProduct(index)}
              canRemove={products.length > 1}
            />
          ))}
        </div>
      )}

      {/* Botão adicionar */}
      <button
        type="button"
        onClick={handleAddProduct}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[#0071e3] text-[var(--text-secondary)] hover:text-[#0071e3] transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Adicionar Produto</span>
      </button>

      {/* Info */}
      <p className="text-xs text-[var(--text-secondary)]">
        {products.length} produto{products.length !== 1 ? "s" : ""} adicionado
        {products.length !== 1 ? "s" : ""}. Arraste para reordenar.
      </p>
    </div>
  );
}
