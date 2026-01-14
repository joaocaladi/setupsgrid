import type { ExtractionResult, ExtractedProduct } from "./types";
import { cleanUrl, extractDomain, isValidUrl } from "./utils";
import {
  extractJsonLd,
  extractOpenGraph,
  extractMetaTags,
  extractPriceFromHtml,
  mergeExtractedData,
} from "./parsers";
import { findStoreByDomain, getStoreName } from "./stores";

const FETCH_TIMEOUT = 10000; // 10 segundos

// Lista de indicadores de página bloqueada (CAPTCHA, anti-bot, etc)
const BLOCK_INDICATORS = [
  "robot check",
  "enter the characters",
  "captcha",
  "api-services-support@amazon",
  "challenge.mercadolibre",
  "access denied",
  "please verify you are a human",
  "unusual traffic",
  "automated access",
  "bot detection",
];

// Nomes de lojas que não devem ser aceitos como nome de produto
const INVALID_PRODUCT_NAMES = [
  "amazon",
  "amazon.com.br",
  "amazon brasil",
  "mercado livre",
  "mercadolivre",
  "kabum",
  "kabum!",
  "pichau",
  "magazine luiza",
  "magalu",
  "shopee",
  "terabyte",
  "aliexpress",
];

/**
 * Verifica se a página retornada é uma página de bloqueio (CAPTCHA, etc)
 */
function isBlockedPage(html: string): boolean {
  const lowerHtml = html.toLowerCase();
  return BLOCK_INDICATORS.some((indicator) => lowerHtml.includes(indicator));
}

/**
 * Valida se o nome extraído é um nome de produto real
 * (e não apenas o nome da loja)
 */
function isValidProductName(name: string | undefined): boolean {
  if (!name) return false;
  const nameLower = name.toLowerCase().trim();
  if (nameLower.length < 5) return false;
  return !INVALID_PRODUCT_NAMES.some(
    (invalid) => nameLower === invalid || nameLower.startsWith(invalid + " -")
  );
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

/**
 * Extrai dados de produto a partir de uma URL de e-commerce
 */
export async function extractProductData(url: string): Promise<ExtractionResult> {
  // Validar URL
  if (!isValidUrl(url)) {
    return {
      success: false,
      error: "URL inválida. Verifique o endereço.",
    };
  }

  const cleanedUrl = cleanUrl(url);
  const store = extractDomain(cleanedUrl);

  // Buscar configuração da loja
  const storeConfig = findStoreByDomain(cleanedUrl);
  const storeName = storeConfig?.name || getStoreName(cleanedUrl);
  const storeReliability = storeConfig?.reliability || "unknown";

  try {
    // Fetch com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(cleanedUrl, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Não foi possível acessar o site (${response.status}). Preencha manualmente.`,
        partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
      };
    }

    const html = await response.text();

    // Verificar se recebeu HTML válido
    if (!html || html.length < 100 || !html.includes("<")) {
      return {
        success: false,
        error: "Resposta inválida do site. Preencha manualmente.",
        partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
      };
    }

    // Verificar se página foi bloqueada (CAPTCHA, anti-bot, etc)
    if (isBlockedPage(html)) {
      return {
        success: false,
        error: "Este site bloqueou a extração automática. Preencha os dados manualmente.",
        partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
      };
    }

    // Extrair dados usando diferentes métodos
    const jsonLdData = extractJsonLd(html, cleanedUrl);
    const openGraphData = extractOpenGraph(html, cleanedUrl);
    const metaTagsData = extractMetaTags(html, cleanedUrl);
    const htmlPrice = extractPriceFromHtml(html);

    // Combinar resultados
    const mergedData = mergeExtractedData(jsonLdData, openGraphData, metaTagsData, htmlPrice);

    // Verificar se conseguimos extrair pelo menos o nome
    if (!mergedData.name) {
      return {
        success: false,
        error: "Não foi possível extrair informações do produto. Preencha manualmente.",
        partialData: {
          store,
          storeName,
          storeReliability,
          originalUrl: cleanedUrl,
          ...mergedData,
        },
      };
    }

    // Validar que extraímos um nome real de produto (não só nome da loja)
    if (!isValidProductName(mergedData.name)) {
      return {
        success: false,
        error: "Não foi possível identificar o produto. Preencha os dados manualmente.",
        partialData: {
          store,
          storeName,
          storeReliability,
          originalUrl: cleanedUrl,
          ...mergedData,
        },
      };
    }

    // Montar resultado final
    const result: ExtractedProduct = {
      name: mergedData.name,
      price: mergedData.price ?? null,
      priceValue: mergedData.priceValue ?? null,
      image: mergedData.image ?? null,
      store,
      storeName,
      storeReliability,
      originalUrl: cleanedUrl,
      priceCapturedAt: mergedData.priceValue ? new Date().toISOString() : null,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // Tratar erros específicos
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Tempo esgotado. Tente novamente ou preencha manualmente.",
          partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
        };
      }

      // Erro de rede ou CORS
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return {
          success: false,
          error: "Não foi possível acessar o site. Preencha manualmente.",
          partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
        };
      }
    }

    return {
      success: false,
      error: "Erro ao extrair dados. Preencha manualmente.",
      partialData: { store, storeName, storeReliability, originalUrl: cleanedUrl },
    };
  }
}
