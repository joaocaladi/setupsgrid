export interface ExtractedProduct {
  name: string;
  price: string | null;
  priceValue: number | null;
  image: string | null;
  store: string;
  storeName: string;
  storeReliability: "high" | "medium" | "low" | "unknown";
  originalUrl: string;
  priceCapturedAt: string | null;
}

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedProduct;
  error?: string;
  partialData?: Partial<ExtractedProduct>;
}

export interface ParsedPrice {
  formatted: string;
  value: number;
}
