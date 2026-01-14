import type {
  LinkCheckResult,
  LinkCheckOptions,
  ProductWithLink,
  BatchCheckResult,
} from "./types";

const DEFAULT_TIMEOUT = 10000; // 10 segundos
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; GridizBot/1.0; +https://gridiz.com)";

/**
 * Verifica se uma URL está acessível
 */
export async function checkLink(
  url: string,
  options: LinkCheckOptions = {}
): Promise<LinkCheckResult> {
  const { timeout = DEFAULT_TIMEOUT, userAgent = DEFAULT_USER_AGENT } = options;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Tentar HEAD primeiro (mais rápido)
    let response: Response;
    try {
      response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": userAgent,
        },
        redirect: "follow",
      });
    } catch {
      // Se HEAD falhar, tentar GET
      response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": userAgent,
        },
        redirect: "follow",
      });
    }

    clearTimeout(timeoutId);
    const responseMs = Date.now() - startTime;

    // HTTP 200-399 = ativo, 400+ = quebrado
    const isAvailable = response.status >= 200 && response.status < 400;

    return {
      status: isAvailable ? "active" : "broken",
      httpStatus: response.status,
      responseMs,
      errorType: isAvailable ? null : "http_error",
    };
  } catch (error) {
    const responseMs = Date.now() - startTime;

    // Determinar tipo de erro
    let errorType = "unknown";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorType = "timeout";
      } else if (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("ECONNREFUSED")
      ) {
        errorType = "network";
      } else if (error.message.includes("certificate")) {
        errorType = "ssl";
      }
    }

    return {
      status: "broken",
      httpStatus: null,
      responseMs,
      errorType,
    };
  }
}

/**
 * Verifica múltiplos links em lotes com delay entre cada um
 */
export async function checkLinksInBatch(
  products: ProductWithLink[],
  batchSize = 10,
  delayMs = 500
): Promise<Map<string, LinkCheckResult>> {
  const results = new Map<string, LinkCheckResult>();

  // Processar em lotes
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    // Processar lote em paralelo
    const batchResults = await Promise.all(
      batch.map(async (product): Promise<BatchCheckResult> => {
        const result = await checkLink(product.linkCompra);
        return { productId: product.id, result };
      })
    );

    // Adicionar resultados ao mapa
    for (const { productId, result } of batchResults) {
      results.set(productId, result);
    }

    // Delay entre lotes (exceto no último)
    if (i + batchSize < products.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

export type { LinkCheckResult, LinkCheckOptions, ProductWithLink };
