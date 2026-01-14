"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  User,
  X,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SubmissionStatusBadge } from "./SubmissionStatusBadge";
import { SubmissionImageGallery } from "./SubmissionImageGallery";
import {
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
} from "@/app/admin/submissions/actions";
import { PRODUTO_CATEGORIAS, LOJAS } from "@/lib/validations";
import type {
  SetupSubmission,
  SetupSubmissionImage,
  SetupSubmissionProduct,
  Categoria,
} from "@/types";
import type { ReviewProductData } from "@/lib/validations/submission";

interface SubmissionWithRelations extends SetupSubmission {
  images: SetupSubmissionImage[];
  products: SetupSubmissionProduct[];
}

interface SubmissionReviewFormProps {
  submission: SubmissionWithRelations;
  categorias: (Categoria & { _count?: { setups: number } })[];
}

interface ProductWithId extends ReviewProductData {
  _id: string;
}

// Sortable Product Item
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
  const [expanded, setExpanded] = useState(true);
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

  const updateField = <K extends keyof ReviewProductData>(
    field: K,
    value: ReviewProductData[K]
  ) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--background-secondary)]">
        <div
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--background)] px-2 py-0.5 rounded">
            #{index + 1}
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {product.nome || "Novo Produto"}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[var(--text-secondary)] ml-auto flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] ml-auto flex-shrink-0" />
          )}
        </button>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Fields */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Nome *
              </label>
              <input
                type="text"
                value={product.nome}
                onChange={(e) => updateField("nome", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Categoria *
              </label>
              <select
                value={product.categoria}
                onChange={(e) => updateField("categoria", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)]"
              >
                <option value="">Selecione...</option>
                {PRODUTO_CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preço e Loja */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Preço (R$)
              </label>
              <input
                type="number"
                value={product.preco || ""}
                onChange={(e) =>
                  updateField(
                    "preco",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Loja
              </label>
              <select
                value={product.loja || ""}
                onChange={(e) => updateField("loja", e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)]"
              >
                <option value="">Selecione...</option>
                {LOJAS.map((loja) => (
                  <option key={loja} value={loja}>
                    {loja}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Link de Compra
            </label>
            <input
              type="url"
              value={product.linkCompra || ""}
              onChange={(e) => updateField("linkCompra", e.target.value || null)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)]"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Descrição
            </label>
            <textarea
              value={product.descricao || ""}
              onChange={(e) => updateField("descricao", e.target.value || null)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)] resize-none"
            />
          </div>

          {/* Destaque */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.destaque}
              onChange={(e) => updateField("destaque", e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3]"
            />
            <span className="text-sm text-[var(--text-primary)]">
              Produto em destaque
            </span>
          </label>
        </div>
      )}
    </div>
  );
}

export function SubmissionReviewForm({
  submission,
  categorias,
}: SubmissionReviewFormProps) {
  const router = useRouter();
  const isProcessed = submission.status !== "pending";

  // Form state
  const [title, setTitle] = useState(submission.title || "");
  const [description, setDescription] = useState(submission.description || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState(submission.images);

  // Convert submission products to review format
  const [products, setProducts] = useState<ProductWithId[]>(() =>
    submission.products.map((p) => ({
      _id: p.id,
      nome: p.productName,
      categoria: p.productCategory || "",
      descricao: null,
      preco: p.productPrice,
      moeda: "BRL",
      linkCompra: p.productUrl,
      loja: null,
      destaque: false,
    }))
  );

  // UI state
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Product handlers
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = products.findIndex((p) => p._id === active.id);
        const newIndex = products.findIndex((p) => p._id === over.id);
        setProducts(arrayMove(products, oldIndex, newIndex));
      }
    },
    [products]
  );

  const handleAddProduct = useCallback(() => {
    setProducts([
      ...products,
      {
        _id: crypto.randomUUID(),
        nome: "",
        categoria: "",
        descricao: null,
        preco: null,
        moeda: "BRL",
        linkCompra: null,
        loja: null,
        destaque: false,
      },
    ]);
  }, [products]);

  const handleUpdateProduct = useCallback(
    (index: number, updated: ProductWithId) => {
      const newProducts = [...products];
      newProducts[index] = updated;
      setProducts(newProducts);
    },
    [products]
  );

  const handleRemoveProduct = useCallback(
    (index: number) => {
      setProducts(products.filter((_, i) => i !== index));
    },
    [products]
  );

  // Actions
  const handleApprove = async () => {
    // Validate
    if (!title.trim()) {
      toast.error("Título é obrigatório para aprovar");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("Selecione pelo menos uma categoria");
      return;
    }
    const validProducts = products.filter(
      (p) => p.nome.trim() && p.categoria
    );
    if (validProducts.length === 0) {
      toast.error("Adicione pelo menos um produto com nome e categoria");
      return;
    }
    if (images.length === 0) {
      toast.error("A submissão precisa ter pelo menos uma imagem");
      return;
    }

    setIsApproving(true);

    const result = await approveSubmission(submission.id, {
      title: title.trim(),
      description: description.trim() || null,
      categoriaIds: selectedCategories,
      products: validProducts.map((p) => ({
        nome: p.nome,
        categoria: p.categoria,
        descricao: p.descricao,
        preco: p.preco,
        moeda: p.moeda,
        linkCompra: p.linkCompra,
        loja: p.loja,
        destaque: p.destaque,
      })),
    });

    if (result.success) {
      toast.success("Submissão aprovada! Setup publicado.");
      router.push("/admin/submissions");
    } else {
      toast.error(result.error || "Erro ao aprovar submissão");
    }

    setIsApproving(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      toast.error("Informe o motivo da rejeição (mínimo 5 caracteres)");
      return;
    }

    setIsRejecting(true);

    const result = await rejectSubmission(submission.id, rejectReason.trim());

    if (result.success) {
      toast.success("Submissão rejeitada");
      setShowRejectModal(false);
      router.push("/admin/submissions");
    } else {
      toast.error(result.error || "Erro ao rejeitar submissão");
    }

    setIsRejecting(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteSubmission(submission.id);

    if (result.success) {
      toast.success("Submissão excluída");
      router.push("/admin/submissions");
    } else {
      toast.error(result.error || "Erro ao excluir submissão");
    }

    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/submissions"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Revisar Submissão
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Enviada em{" "}
              {new Date(submission.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <SubmissionStatusBadge status={submission.status} />
      </div>

      {/* Rejected/Approved Info */}
      {submission.status === "rejected" && submission.rejectionReason && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm font-medium text-red-500 mb-1">
            Motivo da rejeição:
          </p>
          <p className="text-sm text-red-400">{submission.rejectionReason}</p>
        </div>
      )}

      {submission.status === "approved" && submission.publishedSetupId && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-500">
            Esta submissão foi aprovada e publicada.{" "}
            <Link
              href={`/setup/${submission.publishedSetupId}`}
              className="font-medium underline hover:no-underline"
              target="_blank"
            >
              Ver setup publicado
              <ExternalLink className="inline h-3 w-3 ml-1" />
            </Link>
          </p>
        </div>
      )}

      {/* User Info */}
      <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Informações do Usuário
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--background)]">
              <User className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Nome</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {submission.userName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--background)]">
              <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Email</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {submission.userEmail}
              </p>
            </div>
          </div>

          {submission.userWhatsapp && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--background)]">
                <Phone className="h-4 w-4 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">WhatsApp</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {submission.userWhatsapp}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--background)]">
              <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Data de Envio
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {new Date(submission.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Imagens ({images.length})
        </h2>

        <SubmissionImageGallery
          images={images}
          submissionId={submission.id}
          onImagesChange={setImages}
          readOnly={isProcessed}
        />
      </section>

      {/* Setup Info */}
      <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Informações do Setup
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do setup"
              disabled={isProcessed}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do setup"
              rows={3}
              disabled={isProcessed}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)] resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Categorias *
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (isProcessed) return;
                    setSelectedCategories((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id]
                    );
                  }}
                  disabled={isProcessed}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-50 ${
                    selectedCategories.includes(cat.id)
                      ? "bg-[#0071e3] text-white border-[#0071e3]"
                      : "bg-[var(--background)] text-[var(--text-primary)] border-[var(--border)] hover:border-[#0071e3]"
                  }`}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Produtos ({products.length})
          </h2>
          {!isProcessed && (
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          )}
        </div>

        {/* Original Products Info */}
        {submission.products.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
              Produtos informados pelo usuário:
            </p>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1">
              {submission.products.map((p, i) => (
                <li key={i}>
                  • {p.productName}
                  {p.productBrand && ` (${p.productBrand})`}
                  {p.productPrice && ` - R$ ${p.productPrice.toFixed(2)}`}
                  {p.notes && ` - "${p.notes}"`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editable Products */}
        {isProcessed ? (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]"
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {product.nome}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {product.categoria}
                  {product.preco && ` • R$ ${product.preco.toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </section>

      {/* Actions */}
      {!isProcessed && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isApproving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isApproving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            Aprovar e Publicar
          </button>

          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
          >
            <XCircle className="h-5 w-5" />
            Rejeitar
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 font-medium transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            Excluir
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative bg-[var(--background-secondary)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Rejeitar Submissão
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Motivo da rejeição *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explique o motivo da rejeição..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-[var(--text-primary)] resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rejeitando...
                  </>
                ) : (
                  "Confirmar Rejeição"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-[var(--background-secondary)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Excluir Submissão
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-6">
              Tem certeza que deseja excluir esta submissão? Esta ação não pode
              ser desfeita.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
