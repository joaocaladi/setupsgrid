export interface LinkCheckResult {
  status: "active" | "broken";
  httpStatus: number | null;
  responseMs: number;
  errorType: string | null;
}

export interface LinkCheckOptions {
  timeout?: number;
  userAgent?: string;
}

export interface ProductWithLink {
  id: string;
  linkCompra: string;
}

export interface BatchCheckResult {
  productId: string;
  result: LinkCheckResult;
}
