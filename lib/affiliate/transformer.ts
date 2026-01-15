import { prisma } from "@/lib/prisma";
import { cleanUrl } from "@/lib/scraper/utils";
import type { AffiliateConfig, TransformResult } from "./types";

// Cache para configs de afiliados (refresh a cada 5 minutos)
let configCache: AffiliateConfig[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Busca configs ativos com cache
 */
async function getActiveConfigs(): Promise<AffiliateConfig[]> {
  const now = Date.now();
  if (configCache && now - cacheTimestamp < CACHE_TTL) {
    return configCache;
  }

  configCache = await prisma.affiliateConfig.findMany({
    where: { isActive: true },
  });
  cacheTimestamp = now;
  return configCache;
}

/**
 * Invalida o cache de configs (chamar após atualização)
 */
export function invalidateConfigCache(): void {
  configCache = null;
}

/**
 * Valida se é uma URL válida (http/https)
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Extrai o domínio base de uma URL (sem www)
 */
function extractDomainFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Encontra a config de afiliado pelo domínio da URL
 */
function findConfigByDomain(
  domain: string,
  configs: AffiliateConfig[]
): AffiliateConfig | null {
  for (const config of configs) {
    for (const configDomain of config.domains) {
      const normalizedConfigDomain = configDomain
        .toLowerCase()
        .replace(/^www\./, "");
      if (
        domain === normalizedConfigDomain ||
        domain.endsWith(`.${normalizedConfigDomain}`)
      ) {
        return config;
      }
    }
  }
  return null;
}

/**
 * Aplica parâmetro de afiliado na URL
 */
function applyParameterTransform(
  url: string,
  config: AffiliateConfig
): string {
  if (!config.affiliateParam || !config.affiliateCode) return url;

  const parsed = new URL(url);
  // Remove parâmetro existente se houver (evita duplicar)
  parsed.searchParams.delete(config.affiliateParam);
  // Adiciona o parâmetro de afiliado
  parsed.searchParams.set(config.affiliateParam, config.affiliateCode);

  return parsed.toString();
}

/**
 * Aplica redirect de afiliado
 * Template usa {{URL}} para a URL original e {{CODE}} para o código
 */
function applyRedirectTransform(
  url: string,
  config: AffiliateConfig
): string {
  if (!config.redirectTemplate || !config.affiliateCode) return url;

  const encodedUrl = encodeURIComponent(url);
  return config.redirectTemplate
    .replace(/\{\{URL\}\}/g, encodedUrl)
    .replace(/\{\{CODE\}\}/g, config.affiliateCode);
}

/**
 * Função principal: transforma URL para incluir afiliado
 */
export async function transformToAffiliateUrl(
  url: string
): Promise<TransformResult> {
  // Resultado padrão
  const result: TransformResult = {
    originalUrl: url,
    transformedUrl: url,
    wasTransformed: false,
    storeKey: null,
    storeName: null,
  };

  // Valida URL
  if (!url || !isValidUrl(url)) {
    return {
      ...result,
      error: "URL inválida",
    };
  }

  // Limpa a URL primeiro (remove parâmetros de tracking)
  const cleanedUrl = cleanUrl(url);

  // Extrai domínio
  const domain = extractDomainFromUrl(cleanedUrl);
  if (!domain) {
    return {
      ...result,
      transformedUrl: cleanedUrl,
    };
  }

  // Busca config correspondente
  const configs = await getActiveConfigs();
  const config = findConfigByDomain(domain, configs);

  if (!config) {
    return {
      ...result,
      transformedUrl: cleanedUrl,
    };
  }

  // Verifica se o config está completo
  if (!config.affiliateCode) {
    return {
      ...result,
      transformedUrl: cleanedUrl,
      storeKey: config.storeKey,
      storeName: config.storeName,
    };
  }

  result.storeKey = config.storeKey;
  result.storeName = config.storeName;

  // Aplica transformação baseada no tipo
  try {
    let transformedUrl: string;

    switch (config.affiliateType) {
      case "parameter":
        transformedUrl = applyParameterTransform(cleanedUrl, config);
        break;
      case "redirect":
        transformedUrl = applyRedirectTransform(cleanedUrl, config);
        break;
      case "replace":
        // Para tipo replace, poderia usar regex - por ora retorna URL limpa
        transformedUrl = cleanedUrl;
        break;
      default:
        transformedUrl = cleanedUrl;
    }

    result.transformedUrl = transformedUrl;
    result.wasTransformed = transformedUrl !== cleanedUrl;
  } catch (error) {
    console.error("Erro ao transformar URL de afiliado:", error);
    result.transformedUrl = cleanedUrl;
  }

  return result;
}

/**
 * Versão síncrona para testes (requer configs passados como parâmetro)
 */
export function transformUrlSync(
  url: string,
  configs: AffiliateConfig[]
): TransformResult {
  const result: TransformResult = {
    originalUrl: url,
    transformedUrl: url,
    wasTransformed: false,
    storeKey: null,
    storeName: null,
  };

  if (!url || !isValidUrl(url)) {
    return {
      ...result,
      error: "URL inválida",
    };
  }

  const cleanedUrl = cleanUrl(url);
  const domain = extractDomainFromUrl(cleanedUrl);

  if (!domain) {
    return {
      ...result,
      transformedUrl: cleanedUrl,
    };
  }

  const config = findConfigByDomain(domain, configs);

  if (!config || !config.affiliateCode) {
    return {
      ...result,
      transformedUrl: cleanedUrl,
      storeKey: config?.storeKey ?? null,
      storeName: config?.storeName ?? null,
    };
  }

  result.storeKey = config.storeKey;
  result.storeName = config.storeName;

  try {
    let transformedUrl: string;

    switch (config.affiliateType) {
      case "parameter":
        transformedUrl = applyParameterTransform(cleanedUrl, config);
        break;
      case "redirect":
        transformedUrl = applyRedirectTransform(cleanedUrl, config);
        break;
      case "replace":
        transformedUrl = cleanedUrl;
        break;
      default:
        transformedUrl = cleanedUrl;
    }

    result.transformedUrl = transformedUrl;
    result.wasTransformed = transformedUrl !== cleanedUrl;
  } catch {
    result.transformedUrl = cleanedUrl;
  }

  return result;
}

/**
 * Transforma múltiplas URLs (batch)
 */
export async function transformMultipleUrls(
  urls: string[]
): Promise<TransformResult[]> {
  return Promise.all(urls.map((url) => transformToAffiliateUrl(url)));
}
