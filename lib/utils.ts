import { clsx, type ClassValue } from "clsx";

// Combina classes com clsx
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Formata preço em BRL
export function formatPrice(price: number | null | undefined, currency = "BRL"): string {
  if (price === null || price === undefined) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// Calcula valor total dos produtos de um setup
export function calculateTotalPrice(products: { preco: number | null }[]): number {
  return products.reduce((total, product) => {
    return total + (product.preco || 0);
  }, 0);
}

// Gera slug a partir de string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Formata preço com data de captura
export function formatPriceWithDate(
  price: number | null | undefined,
  capturedAt: Date | string | null | undefined,
  currency = "BRL"
): string {
  if (price === null || price === undefined) return "";

  const priceStr = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(price);

  if (!capturedAt) return priceStr;

  const date = new Date(capturedAt);
  const month = date
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  const year = date.getFullYear();

  return `${priceStr} (em ${month}/${year})`;
}
