export interface StoreConfig {
  name: string;
  domains: string[];
  country: "BR" | "US" | "INTL";
  category: string;
  reliability: "high" | "medium" | "low";
  imageHostnames?: string[]; // Hostnames de imagens para next.config.ts
}

export const SUPPORTED_STORES: StoreConfig[] = [
  // ============================================
  // MARKETPLACES BRASIL
  // ============================================
  {
    name: "Amazon Brasil",
    domains: ["amazon.com.br", "www.amazon.com.br", "amzn.to"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com", "m.media-amazon.com"],
  },
  {
    name: "Mercado Livre",
    domains: [
      "mercadolivre.com.br",
      "www.mercadolivre.com.br",
      "produto.mercadolivre.com.br",
      "lista.mercadolivre.com.br",
      "mercadolibre.com.br",
      "www.mercadolibre.com.br",
    ],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.mlstatic.com"],
  },
  {
    name: "Magazine Luiza",
    domains: [
      "magazineluiza.com.br",
      "www.magazineluiza.com.br",
      "sacola.magazineluiza.com.br",
      "magalu.com.br",
      "www.magalu.com.br",
    ],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.magazineluiza.com.br"],
  },
  {
    name: "Americanas",
    domains: ["americanas.com.br", "www.americanas.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["images-americanas.b2w.io"],
  },
  {
    name: "Casas Bahia",
    domains: ["casasbahia.com.br", "www.casasbahia.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.casasbahia.com.br"],
  },
  {
    name: "Shoptime",
    domains: ["shoptime.com.br", "www.shoptime.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.shoptime.com.br"],
  },
  {
    name: "Submarino",
    domains: ["submarino.com.br", "www.submarino.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.submarino.com.br"],
  },
  {
    name: "Extra",
    domains: ["extra.com.br", "www.extra.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.extra.com.br"],
  },
  {
    name: "Ponto",
    domains: [
      "pontofrio.com.br",
      "www.pontofrio.com.br",
      "ponto.com.br",
      "www.ponto.com.br",
    ],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.pontofrio.com.br", "*.ponto.com.br"],
  },
  {
    name: "Via Varejo",
    domains: ["viavarejo.com.br", "www.viavarejo.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.viavarejo.com.br"],
  },

  // ============================================
  // ELETRÔNICOS / TECH BRASIL
  // ============================================
  {
    name: "Kabum",
    domains: ["kabum.com.br", "www.kabum.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["images.kabum.com.br"],
  },
  {
    name: "Pichau",
    domains: ["pichau.com.br", "www.pichau.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["media.pichau.com.br"],
  },
  {
    name: "Terabyte",
    domains: ["terabyteshop.com.br", "www.terabyteshop.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["img.terabyteshop.com.br"],
  },
  {
    name: "Chipart",
    domains: ["chipart.com.br", "www.chipart.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.chipart.com.br"],
  },
  {
    name: "Patoloco",
    domains: ["patoloco.com.br", "www.patoloco.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.patoloco.com.br"],
  },
  {
    name: "Infoshop",
    domains: ["infoshop.com.br", "www.infoshop.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.infoshop.com.br"],
  },
  {
    name: "Girkan Store",
    domains: ["girkan.com.br", "www.girkan.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.girkan.com.br"],
  },
  {
    name: "ELG Shop",
    domains: ["elgshop.com.br", "www.elgshop.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.elgshop.com.br"],
  },
  {
    name: "Fast Shop",
    domains: ["fastshop.com.br", "www.fastshop.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.fastshop.com.br"],
  },
  {
    name: "Girafa",
    domains: ["girafa.com.br", "www.girafa.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.girafa.com.br"],
  },
  {
    name: "Colombo",
    domains: ["colombo.com.br", "www.colombo.com.br", "lojas.colombo.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.colombo.com.br"],
  },
  {
    name: "Cissa Magazine",
    domains: ["cissamagazine.com.br", "www.cissamagazine.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.cissamagazine.com.br"],
  },
  {
    name: "Mega Mamute",
    domains: ["megamamute.com.br", "www.megamamute.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.megamamute.com.br"],
  },

  // ============================================
  // MÓVEIS / HOME OFFICE BRASIL
  // ============================================
  {
    name: "Tok&Stok",
    domains: ["tokstok.com.br", "www.tokstok.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.tokstok.com.br"],
  },
  {
    name: "MadeiraMadeira",
    domains: ["madeiramadeira.com.br", "www.madeiramadeira.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.madeiramadeira.com.br"],
  },
  {
    name: "Mobly",
    domains: ["mobly.com.br", "www.mobly.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.mobly.com.br"],
  },
  {
    name: "Etna",
    domains: ["etna.com.br", "www.etna.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.etna.com.br"],
  },
  {
    name: "Leroy Merlin",
    domains: ["leroymerlin.com.br", "www.leroymerlin.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.leroymerlin.com.br"],
  },
  {
    name: "Camicado",
    domains: ["camicado.com.br", "www.camicado.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.camicado.com.br"],
  },
  {
    name: "Flexform",
    domains: ["flexform.com.br", "www.flexform.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "medium",
    imageHostnames: ["*.flexform.com.br"],
  },
  {
    name: "Elements",
    domains: ["elements.com.br", "www.elements.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "medium",
    imageHostnames: ["*.elements.com.br"],
  },
  {
    name: "Meu Móvel de Madeira",
    domains: ["meumoveldemadeira.com.br", "www.meumoveldemadeira.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.meumoveldemadeira.com.br"],
  },
  {
    name: "Oppa",
    domains: ["oppa.com.br", "www.oppa.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.oppa.com.br"],
  },
  {
    name: "LojasKD",
    domains: ["lojaskd.com.br", "www.lojaskd.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.lojaskd.com.br"],
  },
  {
    name: "Westwing",
    domains: ["westwing.com.br", "www.westwing.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.westwing.com.br"],
  },
  {
    name: "Casa Mineira",
    domains: ["casamineira.com.br", "www.casamineira.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "medium",
    imageHostnames: ["*.casamineira.com.br"],
  },
  {
    name: "Shopfácil",
    domains: ["shopfacil.com.br", "www.shopfacil.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.shopfacil.com.br"],
  },
  {
    name: "Havan",
    domains: ["havan.com.br", "www.havan.com.br"],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.havan.com.br"],
  },

  // ============================================
  // PERIFÉRICOS / GAMER
  // ============================================
  {
    name: "Logitech Brasil",
    domains: [
      "logitech.com/pt-br",
      "www.logitech.com/pt-br",
      "logitech.com",
      "www.logitech.com",
    ],
    country: "BR",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.logitech.com", "resource.logitech.com"],
  },
  {
    name: "Razer",
    domains: [
      "razer.com/br-pt",
      "www.razer.com/br-pt",
      "razer.com",
      "www.razer.com",
    ],
    country: "BR",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.razer.com", "assets.razerzone.com"],
  },
  {
    name: "HyperX",
    domains: [
      "hyperx.com/pt-br",
      "www.hyperx.com/pt-br",
      "hyperx.com",
      "www.hyperx.com",
    ],
    country: "BR",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.hyperx.com"],
  },
  {
    name: "Redragon Brasil",
    domains: ["redragon.com.br", "www.redragon.com.br"],
    country: "BR",
    category: "peripherals",
    reliability: "medium",
    imageHostnames: ["*.redragon.com.br"],
  },
  {
    name: "Rise Mode",
    domains: ["risemode.com.br", "www.risemode.com.br"],
    country: "BR",
    category: "peripherals",
    reliability: "medium",
    imageHostnames: ["*.risemode.com.br"],
  },
  {
    name: "WASD",
    domains: ["wasd.com.br", "www.wasd.com.br"],
    country: "BR",
    category: "peripherals",
    reliability: "medium",
    imageHostnames: ["*.wasd.com.br"],
  },
  {
    name: "Corsair",
    domains: ["corsair.com", "www.corsair.com", "corsair.com/br", "www.corsair.com/br"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.corsair.com", "cwsmgmt.corsair.com"],
  },
  {
    name: "SteelSeries",
    domains: ["steelseries.com", "www.steelseries.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.steelseries.com", "media.steelseries.com"],
  },
  {
    name: "NZXT",
    domains: ["nzxt.com", "www.nzxt.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.nzxt.com"],
  },
  {
    name: "Keychron",
    domains: ["keychron.com", "www.keychron.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.keychron.com"],
  },
  {
    name: "Glorious",
    domains: ["gloriousgaming.com", "www.gloriousgaming.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.gloriousgaming.com"],
  },
  {
    name: "Elgato",
    domains: ["elgato.com", "www.elgato.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.elgato.com"],
  },
  {
    name: "Secretlab",
    domains: [
      "secretlab.co",
      "www.secretlab.co",
      "secretlab.com.br",
      "www.secretlab.com.br",
    ],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.secretlab.co"],
  },
  {
    name: "Herman Miller",
    domains: ["hermanmiller.com", "www.hermanmiller.com", "store.hermanmiller.com"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.hermanmiller.com"],
  },
  {
    name: "Autonomous",
    domains: ["autonomous.ai", "www.autonomous.ai"],
    country: "INTL",
    category: "peripherals",
    reliability: "high",
    imageHostnames: ["*.autonomous.ai"],
  },

  // ============================================
  // APPLE / TECH PREMIUM
  // ============================================
  {
    name: "Apple Brasil",
    domains: [
      "apple.com/br",
      "www.apple.com/br",
      "apple.com.br",
      "store.apple.com/br",
    ],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.apple.com", "store.storeimages.cdn-apple.com"],
  },
  {
    name: "iPlace",
    domains: ["iplace.com.br", "www.iplace.com.br"],
    country: "BR",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.iplace.com.br"],
  },
  {
    name: "iStore",
    domains: ["istore.com.br", "www.istore.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.istore.com.br"],
  },
  {
    name: "Think",
    domains: ["think.com.br", "www.think.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.think.com.br"],
  },
  {
    name: "Switch",
    domains: ["switch.com.br", "www.switch.com.br"],
    country: "BR",
    category: "tech",
    reliability: "medium",
    imageHostnames: ["*.switch.com.br"],
  },

  // ============================================
  // ILUMINAÇÃO / DECORAÇÃO
  // ============================================
  {
    name: "IKEA",
    domains: ["ikea.com", "www.ikea.com", "ikea.com.br", "www.ikea.com.br"],
    country: "INTL",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.ikea.com", "*.ikea.net"],
  },
  {
    name: "Philips Hue",
    domains: [
      "philips-hue.com",
      "www.philips-hue.com",
      "philips-hue.com/pt-br",
      "www.philips-hue.com/pt-br",
    ],
    country: "INTL",
    category: "lighting",
    reliability: "high",
    imageHostnames: ["*.philips-hue.com", "*.philips.com"],
  },
  {
    name: "Yeelight",
    domains: ["yeelight.com", "www.yeelight.com"],
    country: "INTL",
    category: "lighting",
    reliability: "medium",
    imageHostnames: ["*.yeelight.com"],
  },
  {
    name: "Nanoleaf",
    domains: ["nanoleaf.me", "www.nanoleaf.me"],
    country: "INTL",
    category: "lighting",
    reliability: "high",
    imageHostnames: ["*.nanoleaf.me"],
  },
  {
    name: "Govee",
    domains: ["govee.com", "www.govee.com"],
    country: "INTL",
    category: "lighting",
    reliability: "high",
    imageHostnames: ["*.govee.com"],
  },
  {
    name: "LED Planet",
    domains: ["ledplanet.com.br", "www.ledplanet.com.br"],
    country: "BR",
    category: "lighting",
    reliability: "medium",
    imageHostnames: ["*.ledplanet.com.br"],
  },

  // ============================================
  // INTERNACIONAIS
  // ============================================
  {
    name: "Amazon US",
    domains: ["amazon.com", "www.amazon.com", "amzn.com"],
    country: "US",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon UK",
    domains: ["amazon.co.uk", "www.amazon.co.uk"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon Espanha",
    domains: ["amazon.es", "www.amazon.es"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon Alemanha",
    domains: ["amazon.de", "www.amazon.de"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon Itália",
    domains: ["amazon.it", "www.amazon.it"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon França",
    domains: ["amazon.fr", "www.amazon.fr"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon Japão",
    domains: ["amazon.co.jp", "www.amazon.co.jp"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon México",
    domains: ["amazon.com.mx", "www.amazon.com.mx"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "Amazon Canadá",
    domains: ["amazon.ca", "www.amazon.ca"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.media-amazon.com"],
  },
  {
    name: "eBay",
    domains: ["ebay.com", "www.ebay.com", "ebay.co.uk", "www.ebay.co.uk"],
    country: "INTL",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.ebayimg.com", "i.ebayimg.com"],
  },
  {
    name: "AliExpress",
    domains: [
      "aliexpress.com",
      "www.aliexpress.com",
      "pt.aliexpress.com",
      "aliexpress.com.br",
      "www.aliexpress.com.br",
    ],
    country: "INTL",
    category: "marketplace",
    reliability: "medium",
    imageHostnames: ["*.alicdn.com", "ae01.alicdn.com"],
  },
  {
    name: "Banggood",
    domains: ["banggood.com", "www.banggood.com", "br.banggood.com"],
    country: "INTL",
    category: "marketplace",
    reliability: "medium",
    imageHostnames: ["*.banggood.com", "imgaz.staticbg.com"],
  },
  {
    name: "Gearbest",
    domains: ["gearbest.com", "www.gearbest.com", "br.gearbest.com"],
    country: "INTL",
    category: "marketplace",
    reliability: "medium",
    imageHostnames: ["*.gearbest.com"],
  },
  {
    name: "Newegg",
    domains: ["newegg.com", "www.newegg.com"],
    country: "US",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.newegg.com", "c1.neweggimages.com"],
  },
  {
    name: "B&H Photo",
    domains: ["bhphotovideo.com", "www.bhphotovideo.com"],
    country: "US",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.bhphotovideo.com", "static.bhphoto.com"],
  },
  {
    name: "Best Buy",
    domains: ["bestbuy.com", "www.bestbuy.com"],
    country: "US",
    category: "tech",
    reliability: "high",
    imageHostnames: ["*.bestbuy.com", "pisces.bbystatic.com"],
  },
  {
    name: "Walmart US",
    domains: ["walmart.com", "www.walmart.com"],
    country: "US",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.walmart.com", "i5.walmartimages.com"],
  },
  {
    name: "Target",
    domains: ["target.com", "www.target.com"],
    country: "US",
    category: "marketplace",
    reliability: "high",
    imageHostnames: ["*.target.com", "target.scene7.com"],
  },

  // ============================================
  // SITES PROBLEMÁTICOS (baixa confiabilidade)
  // ============================================
  {
    name: "Shopee",
    domains: ["shopee.com.br", "www.shopee.com.br"],
    country: "BR",
    category: "marketplace",
    reliability: "low",
    imageHostnames: ["*.shopee.com.br", "down-br.img.susercontent.com"],
  },
  {
    name: "Shein",
    domains: ["shein.com", "www.shein.com", "shein.com.br", "br.shein.com"],
    country: "INTL",
    category: "marketplace",
    reliability: "low",
    imageHostnames: ["*.shein.com", "*.ltwebstatic.com"],
  },
  {
    name: "Temu",
    domains: ["temu.com", "www.temu.com"],
    country: "INTL",
    category: "marketplace",
    reliability: "low",
    imageHostnames: ["*.temu.com"],
  },
  {
    name: "Wish",
    domains: ["wish.com", "www.wish.com"],
    country: "INTL",
    category: "marketplace",
    reliability: "low",
    imageHostnames: ["*.wish.com", "*.contestimg.wish.com"],
  },

  // ============================================
  // ANMA SETUPS (próprio)
  // ============================================
  {
    name: "ANMA Setups",
    domains: [
      "anmasetups.com.br",
      "www.anmasetups.com.br",
      "anmasetups.com",
      "www.anmasetups.com",
    ],
    country: "BR",
    category: "furniture",
    reliability: "high",
    imageHostnames: ["*.anmasetups.com.br", "*.anmasetups.com"],
  },
];

/**
 * Extrai o hostname de uma URL
 */
function extractHostname(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    // Se não for uma URL válida, tenta extrair o hostname manualmente
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1].replace(/^www\./, "") : url;
  }
}

/**
 * Verifica se um hostname corresponde a um padrão de domínio
 * Suporta wildcards simples como *.example.com
 */
function matchesDomain(hostname: string, pattern: string): boolean {
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, "");
  const normalizedPattern = pattern.toLowerCase().replace(/^www\./, "");

  // Verifica match exato
  if (normalizedHostname === normalizedPattern) {
    return true;
  }

  // Verifica se o hostname termina com o padrão (para subdomínios)
  if (normalizedHostname.endsWith(`.${normalizedPattern}`)) {
    return true;
  }

  // Verifica padrões com path (ex: logitech.com/pt-br)
  if (normalizedPattern.includes("/")) {
    const patternBase = normalizedPattern.split("/")[0];
    if (normalizedHostname === patternBase || normalizedHostname.endsWith(`.${patternBase}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Encontra a configuração de uma loja pelo domínio da URL
 */
export function findStoreByDomain(url: string): StoreConfig | null {
  const hostname = extractHostname(url);

  for (const store of SUPPORTED_STORES) {
    for (const domain of store.domains) {
      if (matchesDomain(hostname, domain)) {
        return store;
      }
    }
  }

  return null;
}

/**
 * Verifica se um domínio é suportado
 */
export function isSupportedDomain(url: string): boolean {
  return findStoreByDomain(url) !== null;
}

/**
 * Retorna o nome amigável da loja ou extrai do domínio se não encontrar
 */
export function getStoreName(url: string): string {
  const store = findStoreByDomain(url);
  if (store) {
    return store.name;
  }

  // Fallback: extrai do domínio
  const hostname = extractHostname(url);
  // Remove TLD comum e capitaliza
  const name = hostname.split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Retorna todos os hostnames de imagens únicos para configuração do Next.js
 */
export function getAllImageHostnames(): string[] {
  const hostnames = new Set<string>();

  for (const store of SUPPORTED_STORES) {
    if (store.imageHostnames) {
      for (const hostname of store.imageHostnames) {
        hostnames.add(hostname);
      }
    }
  }

  return Array.from(hostnames);
}

/**
 * Retorna lojas por categoria
 */
export function getStoresByCategory(category: string): StoreConfig[] {
  return SUPPORTED_STORES.filter((store) => store.category === category);
}

/**
 * Retorna lojas por país
 */
export function getStoresByCountry(country: "BR" | "US" | "INTL"): StoreConfig[] {
  return SUPPORTED_STORES.filter((store) => store.country === country);
}

/**
 * Retorna lojas com alta confiabilidade
 */
export function getReliableStores(): StoreConfig[] {
  return SUPPORTED_STORES.filter((store) => store.reliability === "high");
}
