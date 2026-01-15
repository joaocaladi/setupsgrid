import type { AffiliateType } from "@prisma/client";

export interface AffiliateSeedConfig {
  storeKey: string;
  storeName: string;
  domains: string[];
  affiliateType: AffiliateType;
  affiliateParam?: string;
  redirectTemplate?: string;
  programName?: string;
  programUrl?: string;
  commissionInfo?: string;
}

export const AFFILIATE_SEED_DATA: AffiliateSeedConfig[] = [
  // Amazon Brasil
  {
    storeKey: "amazon_br",
    storeName: "Amazon Brasil",
    domains: ["amazon.com.br", "www.amazon.com.br", "amzn.to"],
    affiliateType: "parameter",
    affiliateParam: "tag",
    programName: "Amazon Associates",
    programUrl: "https://associados.amazon.com.br/",
    commissionInfo: "1-15% dependendo da categoria",
  },

  // Amazon US
  {
    storeKey: "amazon_us",
    storeName: "Amazon US",
    domains: ["amazon.com", "www.amazon.com", "amzn.com"],
    affiliateType: "parameter",
    affiliateParam: "tag",
    programName: "Amazon Associates",
    programUrl: "https://affiliate-program.amazon.com/",
    commissionInfo: "1-10% dependendo da categoria",
  },

  // Mercado Livre
  {
    storeKey: "mercadolivre",
    storeName: "Mercado Livre",
    domains: [
      "mercadolivre.com.br",
      "www.mercadolivre.com.br",
      "produto.mercadolivre.com.br",
    ],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.mercadolivre.com.br/jm/search?redirect=item&item_id={{URL}}&partner={{CODE}}",
    programName: "Mercado Livre Afiliados",
    programUrl: "https://www.mercadolivre.com.br/afiliados",
    commissionInfo: "Varia por categoria, até 16%",
  },

  // Magazine Luiza
  {
    storeKey: "magalu",
    storeName: "Magazine Luiza",
    domains: ["magazineluiza.com.br", "www.magazineluiza.com.br", "magalu.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "Magalu Parceiros (via Lomadee)",
    programUrl: "https://www.lomadee.com/",
    commissionInfo: "Variável por categoria",
  },

  // Americanas
  {
    storeKey: "americanas",
    storeName: "Americanas",
    domains: ["americanas.com.br", "www.americanas.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Awin / Lomadee",
    programUrl: "https://www.awin.com/",
    commissionInfo: "Variável",
  },

  // Submarino
  {
    storeKey: "submarino",
    storeName: "Submarino",
    domains: ["submarino.com.br", "www.submarino.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Awin / Lomadee",
    programUrl: "https://www.awin.com/",
    commissionInfo: "Variável",
  },

  // Casas Bahia
  {
    storeKey: "casasbahia",
    storeName: "Casas Bahia",
    domains: ["casasbahia.com.br", "www.casasbahia.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Awin / Lomadee",
    programUrl: "https://www.awin.com/",
    commissionInfo: "Variável",
  },

  // Kabum
  {
    storeKey: "kabum",
    storeName: "Kabum",
    domains: ["kabum.com.br", "www.kabum.com.br"],
    affiliateType: "parameter",
    affiliateParam: "parceiro",
    programName: "Kabum Afiliados",
    programUrl: "https://www.kabum.com.br/afiliados",
    commissionInfo: "2-5%",
  },

  // Pichau
  {
    storeKey: "pichau",
    storeName: "Pichau",
    domains: ["pichau.com.br", "www.pichau.com.br"],
    affiliateType: "parameter",
    affiliateParam: "aff",
    programName: "Pichau Afiliados",
    programUrl: "https://www.pichau.com.br/",
    commissionInfo: "Variável",
  },

  // Terabyte
  {
    storeKey: "terabyte",
    storeName: "Terabyte",
    domains: ["terabyteshop.com.br", "www.terabyteshop.com.br"],
    affiliateType: "parameter",
    affiliateParam: "aff",
    programName: "Terabyte Afiliados",
    programUrl: "https://www.terabyteshop.com.br/",
    commissionInfo: "Variável",
  },

  // Shopee
  {
    storeKey: "shopee",
    storeName: "Shopee",
    domains: ["shopee.com.br", "www.shopee.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://shope.ee/redirect?url={{URL}}&affiliate_id={{CODE}}",
    programName: "Shopee Afiliados",
    programUrl: "https://affiliate.shopee.com.br/",
    commissionInfo: "5-10%",
  },

  // AliExpress
  {
    storeKey: "aliexpress",
    storeName: "AliExpress",
    domains: ["aliexpress.com", "www.aliexpress.com", "pt.aliexpress.com"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://s.click.aliexpress.com/deep_link.htm?aff_short_key={{CODE}}&dl_target_url={{URL}}",
    programName: "AliExpress Portals",
    programUrl: "https://portals.aliexpress.com/",
    commissionInfo: "3-9%",
  },

  // Fast Shop
  {
    storeKey: "fastshop",
    storeName: "Fast Shop",
    domains: ["fastshop.com.br", "www.fastshop.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "Lomadee",
    programUrl: "https://www.lomadee.com/",
    commissionInfo: "Variável",
  },

  // Tok&Stok
  {
    storeKey: "tokstok",
    storeName: "Tok&Stok",
    domains: ["tokstok.com.br", "www.tokstok.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "Lomadee / Awin",
    programUrl: "https://www.lomadee.com/",
    commissionInfo: "Variável",
  },

  // MadeiraMadeira
  {
    storeKey: "madeiramadeira",
    storeName: "MadeiraMadeira",
    domains: ["madeiramadeira.com.br", "www.madeiramadeira.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "MadeiraMadeira Afiliados",
    programUrl: "https://www.madeiramadeira.com.br/",
    commissionInfo: "Até 8%",
  },

  // Mobly
  {
    storeKey: "mobly",
    storeName: "Mobly",
    domains: ["mobly.com.br", "www.mobly.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "Lomadee",
    programUrl: "https://www.lomadee.com/",
    commissionInfo: "Variável",
  },

  // Leroy Merlin
  {
    storeKey: "leroymerlin",
    storeName: "Leroy Merlin",
    domains: ["leroymerlin.com.br", "www.leroymerlin.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Awin",
    programUrl: "https://www.awin.com/",
    commissionInfo: "Variável",
  },

  // Logitech
  {
    storeKey: "logitech",
    storeName: "Logitech",
    domains: ["logitech.com", "www.logitech.com", "logitech.com/pt-br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Logitech Affiliate",
    programUrl: "https://www.logitech.com/",
    commissionInfo: "Variável",
  },

  // Apple
  {
    storeKey: "apple",
    storeName: "Apple",
    domains: ["apple.com", "www.apple.com", "apple.com/br", "store.apple.com"],
    affiliateType: "parameter",
    affiliateParam: "at",
    programName: "Apple Affiliate Program",
    programUrl: "https://www.apple.com/br/shop/browse/affiliate_program",
    commissionInfo: "2.5-7%",
  },

  // eBay
  {
    storeKey: "ebay",
    storeName: "eBay",
    domains: ["ebay.com", "www.ebay.com"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://ebay.us/{{CODE}}?mkcid=1&mkrid=711-53200-19255-0&toolid=10001&customid=&mkevt=1&ul_noapp=true&item={{URL}}",
    programName: "eBay Partner Network",
    programUrl: "https://partnernetwork.ebay.com/",
    commissionInfo: "1-4%",
  },

  // Banggood
  {
    storeKey: "banggood",
    storeName: "Banggood",
    domains: ["banggood.com", "www.banggood.com", "br.banggood.com"],
    affiliateType: "parameter",
    affiliateParam: "aff",
    programName: "Banggood Affiliate",
    programUrl: "https://www.banggood.com/affiliate.html",
    commissionInfo: "5-12%",
  },

  // Extra
  {
    storeKey: "extra",
    storeName: "Extra",
    domains: ["extra.com.br", "www.extra.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://www.awin1.com/cread.php?awinmid={{CODE}}&awinaffid=XXXXX&ued={{URL}}",
    programName: "Awin",
    programUrl: "https://www.awin.com/",
    commissionInfo: "Variável",
  },

  // Carrefour
  {
    storeKey: "carrefour",
    storeName: "Carrefour",
    domains: ["carrefour.com.br", "www.carrefour.com.br"],
    affiliateType: "redirect",
    redirectTemplate:
      "https://redir.lomadee.com/v2/deeplink?sourceId={{CODE}}&url={{URL}}",
    programName: "Lomadee",
    programUrl: "https://www.lomadee.com/",
    commissionInfo: "Variável",
  },
];
