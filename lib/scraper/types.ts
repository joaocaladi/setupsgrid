export interface ExtractedProduct {
  name: string;
  price: string | null;
  priceValue: number | null;
  image: string | null;
  store: string;
  originalUrl: string;
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
