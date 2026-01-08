"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { ProductForm } from "./ProductForm";
import type { ProdutoFormData } from "@/lib/validations";

interface ProductListProps {
  produtos: ProdutoFormData[];
  onChange: (produtos: ProdutoFormData[]) => void;
}

interface SortableItemProps {
  id: string;
  produto: ProdutoFormData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (data: ProdutoFormData) => void;
  onRemove: () => void;
}

function SortableItem({
  id,
  produto,
  index,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProductForm
        produto={produto}
        index={index}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onChange={onChange}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function ProductList({ produtos, onChange }: ProductListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    produtos.length > 0 ? 0 : null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = produtos.findIndex((_, i) => `produto-${i}` === active.id);
      const newIndex = produtos.findIndex((_, i) => `produto-${i}` === over.id);
      onChange(arrayMove(produtos, oldIndex, newIndex));
    }
  }

  function handleAdd() {
    const novoProduto: ProdutoFormData = {
      nome: "",
      descricao: null,
      categoria: "",
      preco: null,
      moeda: "BRL",
      imagemUrl: null,
      linkCompra: null,
      loja: null,
      destaque: false,
      ordem: produtos.length,
    };
    onChange([...produtos, novoProduto]);
    setExpandedIndex(produtos.length);
  }

  function handleChange(index: number, data: ProdutoFormData) {
    const updated = [...produtos];
    updated[index] = data;
    onChange(updated);
  }

  function handleRemove(index: number) {
    const updated = produtos.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">Produtos</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar Produto
        </button>
      </div>

      {produtos.length === 0 ? (
        <div className="bg-[#f5f5f7] rounded-xl p-8 text-center">
          <p className="text-[#86868b]">
            Nenhum produto adicionado ainda.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ED] rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar primeiro produto
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={produtos.map((_, i) => `produto-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {produtos.map((produto, index) => (
                <SortableItem
                  key={`produto-${index}`}
                  id={`produto-${index}`}
                  produto={produto}
                  index={index}
                  isExpanded={expandedIndex === index}
                  onToggle={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  onChange={(data) => handleChange(index, data)}
                  onRemove={() => handleRemove(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
