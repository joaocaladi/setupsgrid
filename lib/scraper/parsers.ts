import { parsePrice, makeAbsoluteUrl } from "./utils";
import type { ExtractedProduct } from "./types";

interface PartialProductData {
  name?: string;
  price?: string | number;
  image?: string;
}

/**
 * Extrai dados de produto de JSON-LD (Schema.org)
 * Mais confiável quando disponível
 */
export function extractJsonLd(html: string, baseUrl: string): PartialProductData | null {
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);

      // Pode ser array ou objeto único
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        const product = findProductInJsonLd(item);
        if (product) {
          return normalizeJsonLdProduct(product, baseUrl);
        }
      }
    } catch {
      // JSON inválido, continuar procurando
      continue;
    }
  }

  return null;
}

/**
 * Busca recursivamente por @type: "Product" no JSON-LD
 */
function findProductInJsonLd(item: Record<string, unknown>): Record<string, unknown> | null {
  if (!item || typeof item !== "object") return null;

  // Verifica se é um produto
  const type = item["@type"];
  if (type === "Product" || (Array.isArray(type) && type.includes("Product"))) {
    return item;
  }

  // Verifica @graph (comum em Schema.org)
  if (Array.isArray(item["@graph"])) {
    for (const graphItem of item["@graph"]) {
      const product = findProductInJsonLd(graphItem as Record<string, unknown>);
      if (product) return product;
    }
  }

  return null;
}

/**
 * Normaliza dados de produto do JSON-LD
 */
function normalizeJsonLdProduct(product: Record<string, unknown>, baseUrl: string): PartialProductData {
  const result: PartialProductData = {};

  // Nome
  if (typeof product.name === "string") {
    result.name = product.name.trim();
  }

  // Preço (pode estar em offers)
  const offers = product.offers as Record<string, unknown> | Record<string, unknown>[] | undefined;
  if (offers) {
    const offer = Array.isArray(offers) ? offers[0] : offers;
    if (offer) {
      const price = offer.price ?? offer.lowPrice ?? offer.highPrice;
      if (price !== undefined) {
        result.price = String(price);
      }
    }
  }

  // Imagem (pode ser string ou array)
  const image = product.image;
  if (image) {
    let imageUrl: string | null = null;

    if (typeof image === "string") {
      imageUrl = image;
    } else if (Array.isArray(image) && image.length > 0) {
      // Pode ser array de strings ou objetos com @url
      const firstImage = image[0];
      if (typeof firstImage === "string") {
        imageUrl = firstImage;
      } else if (typeof firstImage === "object" && firstImage !== null) {
        const imgObj = firstImage as Record<string, unknown>;
        imageUrl = (imgObj.url ?? imgObj["@url"] ?? imgObj.contentUrl) as string | null;
      }
    } else if (typeof image === "object" && image !== null) {
      const imgObj = image as Record<string, unknown>;
      imageUrl = (imgObj.url ?? imgObj["@url"] ?? imgObj.contentUrl) as string | null;
    }

    if (imageUrl) {
      result.image = makeAbsoluteUrl(imageUrl, baseUrl) ?? undefined;
    }
  }

  return result;
}

/**
 * Extrai valor de uma meta tag pelo property ou name
 */
function extractMetaContent(html: string, property: string): string | null {
  // Regex que aceita qualquer ordem de atributos
  const patterns = [
    // property="og:image" content="..."
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    // content="..." property="og:image"
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i"),
    // name="og:image" content="..."
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    // content="..." name="og:image"
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return null;
}

/**
 * Extrai dados de meta tags Open Graph
 */
export function extractOpenGraph(html: string, baseUrl: string): PartialProductData {
  const result: PartialProductData = {};

  // og:title
  const title = extractMetaContent(html, "og:title");
  if (title) {
    result.name = title.trim();
  }

  // og:image - aceitar qualquer URL de imagem de meta tag OG
  const imageContent = extractMetaContent(html, "og:image");
  if (imageContent) {
    const imageUrl = makeAbsoluteUrl(imageContent, baseUrl);
    if (imageUrl) {
      // Aceitar imagem de OG sem validação restritiva (já vem de meta tag confiável)
      result.image = imageUrl;
    }
  }

  // product:price:amount (algumas lojas usam)
  const price = extractMetaContent(html, "product:price:amount");
  if (price) {
    result.price = price;
  }

  return result;
}

/**
 * Extrai dados de meta tags padrão (fallback)
 */
export function extractMetaTags(html: string, baseUrl: string): PartialProductData {
  const result: PartialProductData = {};

  // <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = decodeHtmlEntities(titleMatch[1]).trim();
    // Limpar sufixos comuns de lojas (mais abrangente)
    title = title
      .replace(/\s*[-|–—:]\s*(Amazon|Mercado Livre|Magazine Luiza|Kabum|Pichau|Shopee|Terabyte|AliExpress).*$/i, "")
      .replace(/\s*[-|–—:]\s*Compre\s+.*$/i, "")
      .replace(/\s*[-|–—:]\s*Frete\s+.*$/i, "")
      .replace(/\s*[-|–—:]\s*em\s+até\s+.*$/i, "")
      .replace(/\s*[-|–—:]\s*R\$\s*[\d.,]+.*$/i, "")
      .replace(/^\s*Compre\s+/i, "")
      .replace(/\s*\|\s*$/i, "")
      .trim();
    result.name = title;
  }

  // twitter:image (fallback para imagem)
  if (!result.image) {
    const twitterImage = extractMetaContent(html, "twitter:image");
    if (twitterImage) {
      const imageUrl = makeAbsoluteUrl(twitterImage, baseUrl);
      if (imageUrl) {
        result.image = imageUrl;
      }
    }
  }

  return result;
}

/**
 * Extrai preço de seletores comuns de e-commerce
 * Útil quando JSON-LD não tem preço
 */
export function extractPriceFromHtml(html: string): string | null {
  // Padrões comuns de preço em HTML
  const pricePatterns = [
    // Classe com "price" e valor em R$
    /<[^>]*class=["'][^"']*price[^"']*["'][^>]*>[\s\S]*?R\$\s*([\d.,]+)/i,
    // data-price attribute
    /data-price=["']([\d.,]+)["']/i,
    // Valor monetário brasileiro isolado
    /R\$\s*([\d]{1,3}(?:\.[\d]{3})*(?:,[\d]{2}))/,
    // itemprop="price"
    /itemprop=["']price["'][^>]*content=["']([\d.,]+)["']/i,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const parsed = parsePrice(match[1]);
      if (parsed) {
        return String(parsed.value);
      }
    }
  }

  return null;
}

/**
 * Decodifica entidades HTML
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Decodificar entidades numéricas
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return decoded;
}

/**
 * Combina resultados de múltiplos parsers
 * Prioridade: JSON-LD > Open Graph > Meta Tags
 */
export function mergeExtractedData(
  jsonLd: PartialProductData | null,
  openGraph: PartialProductData,
  metaTags: PartialProductData,
  htmlPrice: string | null
): Partial<ExtractedProduct> {
  const result: Partial<ExtractedProduct> = {};

  // Nome: prioridade JSON-LD > OG > Meta
  result.name = jsonLd?.name || openGraph.name || metaTags.name || undefined;

  // Preço: prioridade JSON-LD > OG > HTML scraping
  const rawPrice = jsonLd?.price || openGraph.price || htmlPrice;
  if (rawPrice) {
    const parsed = parsePrice(rawPrice);
    if (parsed) {
      result.price = parsed.formatted;
      result.priceValue = parsed.value;
    }
  }

  // Imagem: prioridade JSON-LD > OG > Meta
  result.image = jsonLd?.image || openGraph.image || metaTags.image || undefined;

  return result;
}
