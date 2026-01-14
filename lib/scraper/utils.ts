import type { ParsedPrice } from "./types";

/**
 * Extrai valor numérico de string de preço e formata para BRL
 */
export function parsePrice(priceString: string | number | null | undefined): ParsedPrice | null {
  if (priceString === null || priceString === undefined) return null;

  const str = String(priceString);

  // Remove tudo exceto números, vírgula e ponto
  const cleaned = str.replace(/[^\d.,]/g, "");

  if (!cleaned) return null;

  let value: number;

  // Detecta formato brasileiro (1.299,90) vs americano (1,299.90)
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  if (hasComma && hasDot) {
    // Ambos presentes - verificar qual é o separador decimal
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");

    if (lastComma > lastDot) {
      // Formato brasileiro: 1.299,90
      value = parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
    } else {
      // Formato americano: 1,299.90
      value = parseFloat(cleaned.replace(/,/g, ""));
    }
  } else if (hasComma) {
    // Só vírgula - provavelmente formato brasileiro: 299,90 ou 1299,90
    value = parseFloat(cleaned.replace(",", "."));
  } else {
    // Só ponto ou só números
    value = parseFloat(cleaned);
  }

  if (isNaN(value) || value <= 0) return null;

  return {
    formatted: `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    value,
  };
}

/**
 * Remove parâmetros de tracking da URL
 */
export function cleanUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Parâmetros de tracking comuns para remover
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "ref_",
      "fbclid",
      "gclid",
      "msclkid",
      "dclid",
      "zanpid",
      "affiliate",
      "aff_id",
    ];

    trackingParams.forEach((param) => {
      parsed.searchParams.delete(param);
    });

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Extrai nome da loja a partir do domínio
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Mapeamento de domínios para nomes de lojas
    const storeMap: Record<string, string> = {
      "amazon.com.br": "Amazon",
      "amazon.com": "Amazon",
      "mercadolivre.com.br": "Mercado Livre",
      "mercadolibre.com": "Mercado Livre",
      "magazineluiza.com.br": "Magazine Luiza",
      "magalu.com.br": "Magazine Luiza",
      "americanas.com.br": "Americanas",
      "kabum.com.br": "Kabum",
      "pichau.com.br": "Pichau",
      "terabyteshop.com.br": "Terabyte",
      "shopee.com.br": "Shopee",
      "aliexpress.com": "AliExpress",
      "casasbahia.com.br": "Casas Bahia",
      "extra.com.br": "Extra",
      "carrefour.com.br": "Carrefour",
      "fastshop.com.br": "Fast Shop",
      "submarino.com.br": "Submarino",
      "pontofrio.com.br": "Ponto Frio",
    };

    // Procurar correspondência no mapa
    for (const [domain, store] of Object.entries(storeMap)) {
      if (hostname.includes(domain)) {
        return store;
      }
    }

    // Se não encontrar, retorna o domínio limpo
    return hostname.replace("www.", "").split(".")[0];
  } catch {
    return "Loja";
  }
}

/**
 * Valida se é uma URL de imagem válida
 * Aceita URLs de CDNs conhecidos mesmo sem extensão de arquivo
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    // Deve ser http ou https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // CDNs de e-commerce brasileiros (aceitar mesmo sem extensão)
    const imageCdns = [
      // Amazon
      "images-amazon.com",
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      // Mercado Livre
      "http2.mlstatic.com",
      "mlstatic.com",
      // Kabum
      "static-kabum.com.br",
      "kabum.com.br/img",
      // Magazine Luiza
      "imagem.magazineluiza.com.br",
      "a-static.mlcdn.com.br",
      // Pichau
      "images.pichau.com.br",
      "media.pichau.com.br",
      // Terabyte
      "img.terabyteshop.com.br",
      // Shopee
      "cf.shopee.com.br",
      "down-br.img.susercontent.com",
      // AliExpress
      "ae01.alicdn.com",
      "ae04.alicdn.com",
      // Outros CDNs genéricos
      "cloudinary.com",
      "imgix.net",
      "cdn.shopify.com",
      "cloudfront.net",
      "amazonaws.com",
    ];

    // Verificar se é um CDN conhecido
    const isImageCdn = imageCdns.some((cdn) => hostname.includes(cdn) || url.includes(cdn));
    if (isImageCdn) {
      return true;
    }

    // Verificar extensão comum de imagem
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"];
    const hasImageExtension = imageExtensions.some((ext) => pathname.includes(ext));
    if (hasImageExtension) {
      return true;
    }

    // Verificar parâmetros de URL que indicam imagem
    const fullUrl = url.toLowerCase();
    const imageIndicators = ["/img", "/image", "/foto", "/photo", "/picture", "format=", "size=", "width=", "height="];
    const hasImageIndicator = imageIndicators.some((ind) => fullUrl.includes(ind));

    return hasImageIndicator;
  } catch {
    return false;
  }
}

/**
 * Converte URL relativa para absoluta
 */
export function makeAbsoluteUrl(url: string | null | undefined, baseUrl: string): string | null {
  if (!url) return null;

  try {
    // Se já é absoluta, retorna
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Se começa com //, adiciona protocolo
    if (url.startsWith("//")) {
      return `https:${url}`;
    }

    // Senão, combina com base URL
    const base = new URL(baseUrl);
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

/**
 * Valida se é uma URL válida (http/https)
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
