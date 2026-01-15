import type { AffiliateConfig as PrismaAffiliateConfig } from "@prisma/client";

export type { AffiliateType } from "@prisma/client";

export type AffiliateConfig = PrismaAffiliateConfig;

export interface TransformResult {
  originalUrl: string;
  transformedUrl: string;
  wasTransformed: boolean;
  storeKey: string | null;
  storeName: string | null;
  error?: string;
}

export interface AffiliateStats {
  total: number;
  active: number;
  pendingConfig: number;
  inactive: number;
  totalProductsWithAffiliate: number;
}

export type AffiliateFilterTab = "all" | "active" | "pending" | "inactive";
