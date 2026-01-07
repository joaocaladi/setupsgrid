import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Limpar dados existentes
  await prisma.produto.deleteMany();
  await prisma.setup.deleteMany();
  await prisma.categoria.deleteMany();

  // Criar categorias
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nome: "Minimalista",
        slug: "minimalista",
        descricao: "Setups limpos e organizados com o essencial",
        cor: "#10b981",
        icone: "Sparkles",
        ordem: 1,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Moderno",
        slug: "moderno",
        descricao: "Designs contemporâneos com tecnologia de ponta",
        cor: "#3b82f6",
        icone: "Monitor",
        ordem: 2,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Gamer",
        slug: "gamer",
        descricao: "Setups otimizados para gaming com RGB e performance",
        cor: "#ef4444",
        icone: "Gamepad2",
        ordem: 3,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Trabalho",
        slug: "trabalho",
        descricao: "Workspaces produtivos para home office",
        cor: "#f59e0b",
        icone: "Briefcase",
        ordem: 4,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Estiloso",
        slug: "estiloso",
        descricao: "Setups com design único e personalidade",
        cor: "#ec4899",
        icone: "Palette",
        ordem: 5,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Escuro",
        slug: "escuro",
        descricao: "Ambientes dark com iluminação ambiente",
        cor: "#6366f1",
        icone: "Moon",
        ordem: 6,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Claro",
        slug: "claro",
        descricao: "Espaços luminosos e clean",
        cor: "#fbbf24",
        icone: "Sun",
        ordem: 7,
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Amadeirado",
        slug: "amadeirado",
        descricao: "Setups com elementos de madeira natural",
        cor: "#a16207",
        icone: "TreePine",
        ordem: 8,
      },
    }),
  ]);

  console.log(`Created ${categorias.length} categories`);

  // Criar setups com produtos
  const setupsData = [
    {
      titulo: "Setup Minimalista Clean",
      descricao:
        "Um setup extremamente limpo e organizado, perfeito para quem busca foco e produtividade sem distrações visuais.",
      imagemUrl:
        "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80",
      autor: "Lucas Silva",
      fonte: "Instagram",
      fonteUrl: "https://instagram.com",
      destaque: true,
      categorias: ["minimalista", "claro", "trabalho"],
      produtos: [
        {
          nome: 'Apple Studio Display 27"',
          categoria: "Monitor",
          preco: 11999,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
          destaque: true,
        },
        {
          nome: "MacBook Pro M3 14 polegadas",
          categoria: "Notebook",
          preco: 18999,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Magic Keyboard com Touch ID",
          categoria: "Teclado",
          preco: 1599,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Magic Trackpad",
          categoria: "Mouse/Trackpad",
          preco: 1099,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Mesa Sit-Stand FlexDesk",
          categoria: "Mesa",
          preco: 2499,
          loja: "ANMA Setups",
          linkCompra: "https://anmasetups.com.br",
        },
      ],
    },
    {
      titulo: "Gaming Battlestation RGB",
      descricao:
        "Setup gamer completo com iluminação RGB sincronizada, dual monitor e cadeira ergonômica para longas sessões.",
      imagemUrl:
        "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&q=80",
      autor: "Pedro Gamer",
      fonte: "Twitter",
      fonteUrl: "https://twitter.com",
      destaque: true,
      categorias: ["gamer", "escuro", "moderno"],
      produtos: [
        {
          nome: 'LG UltraGear 27" 165Hz',
          categoria: "Monitor",
          preco: 2299,
          loja: "Kabum",
          linkCompra: "https://kabum.com.br",
          destaque: true,
        },
        {
          nome: 'Monitor Secundário 24" 144Hz',
          categoria: "Monitor",
          preco: 1299,
          loja: "Kabum",
          linkCompra: "https://kabum.com.br",
        },
        {
          nome: "Razer BlackWidow V4 Pro",
          categoria: "Teclado",
          preco: 1899,
          loja: "Razer",
          linkCompra: "https://razer.com",
        },
        {
          nome: "Logitech G Pro X Superlight 2",
          categoria: "Mouse",
          preco: 899,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "HyperX QuadCast S",
          categoria: "Microfone",
          preco: 799,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Secretlab Titan Evo 2024",
          categoria: "Cadeira",
          preco: 3499,
          loja: "Secretlab",
          linkCompra: "https://secretlab.co",
        },
      ],
    },
    {
      titulo: "Home Office Produtivo",
      descricao:
        "Workspace profissional para trabalho remoto com dois monitores, iluminação adequada e organização impecável.",
      imagemUrl:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      autor: "Maria Santos",
      fonte: "Pinterest",
      categorias: ["trabalho", "moderno", "claro"],
      produtos: [
        {
          nome: 'Dell UltraSharp U2723QE 27"',
          categoria: "Monitor",
          preco: 4999,
          loja: "Dell",
          linkCompra: "https://dell.com.br",
          destaque: true,
        },
        {
          nome: 'Monitor Vertical 24"',
          categoria: "Monitor",
          preco: 899,
          loja: "Kabum",
          linkCompra: "https://kabum.com.br",
        },
        {
          nome: "Keychron K8 Pro",
          categoria: "Teclado",
          preco: 599,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Logitech MX Master 3S",
          categoria: "Mouse",
          preco: 599,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Webcam Logitech Brio 4K",
          categoria: "Webcam",
          preco: 1199,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Setup Amadeirado Aconchegante",
      descricao:
        "Combinação perfeita de tecnologia com elementos naturais de madeira, criando um ambiente acolhedor.",
      imagemUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      autor: "Ana Carvalho",
      fonte: "Instagram",
      fonteUrl: "https://instagram.com",
      categorias: ["amadeirado", "estiloso", "minimalista"],
      produtos: [
        {
          nome: "Mesa de Madeira Maciça 160cm",
          categoria: "Mesa",
          preco: 1899,
          loja: "ANMA Setups",
          linkCompra: "https://anmasetups.com.br",
          destaque: true,
        },
        {
          nome: 'iMac 24" M3',
          categoria: "Computador",
          preco: 13499,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Luminária de Mesa Articulada",
          categoria: "Iluminação",
          preco: 399,
          loja: "Tok&Stok",
          linkCompra: "https://tokstok.com.br",
        },
        {
          nome: "Organizador de Mesa em Bambu",
          categoria: "Organização",
          preco: 129,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Developer Dark Setup",
      descricao:
        "Setup focado em desenvolvimento de software com tema escuro, múltiplos monitores e teclado mecânico premium.",
      imagemUrl:
        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
      autor: "Rafael Dev",
      fonte: "Twitter",
      destaque: true,
      categorias: ["escuro", "trabalho", "moderno"],
      produtos: [
        {
          nome: 'LG DualUp 28" Ergo',
          categoria: "Monitor",
          preco: 5999,
          loja: "LG",
          linkCompra: "https://lg.com/br",
          destaque: true,
        },
        {
          nome: 'Monitor Ultrawide 34"',
          categoria: "Monitor",
          preco: 3499,
          loja: "Kabum",
          linkCompra: "https://kabum.com.br",
        },
        {
          nome: "ZSA Moonlander Mark I",
          categoria: "Teclado",
          preco: 2499,
          loja: "ZSA",
          linkCompra: "https://zsa.io",
        },
        {
          nome: "Logitech MX Vertical",
          categoria: "Mouse",
          preco: 499,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Sony WH-1000XM5",
          categoria: "Headphone",
          preco: 2299,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Setup Criativo para Design",
      descricao:
        "Workspace perfeito para designers e criativos, com tablet gráfico, monitor calibrado e organização inspiradora.",
      imagemUrl:
        "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80",
      autor: "Julia Design",
      fonte: "Behance",
      categorias: ["estiloso", "claro", "trabalho"],
      produtos: [
        {
          nome: 'ASUS ProArt PA279CV 27"',
          categoria: "Monitor",
          preco: 3299,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
          destaque: true,
        },
        {
          nome: "Wacom Cintiq 16",
          categoria: "Tablet Gráfico",
          preco: 4999,
          loja: "Wacom",
          linkCompra: "https://wacom.com",
        },
        {
          nome: "Logitech Craft",
          categoria: "Teclado",
          preco: 899,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Luminária BenQ ScreenBar",
          categoria: "Iluminação",
          preco: 899,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Streaming Setup Profissional",
      descricao:
        "Setup completo para streaming e criação de conteúdo com iluminação ring light, microfone profissional e câmera 4K.",
      imagemUrl:
        "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
      autor: "Carlos Stream",
      fonte: "Twitch",
      categorias: ["gamer", "escuro", "estiloso"],
      produtos: [
        {
          nome: "Sony A6400 + Lente 16-50mm",
          categoria: "Câmera",
          preco: 7999,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
          destaque: true,
        },
        {
          nome: "Elgato Key Light Air (par)",
          categoria: "Iluminação",
          preco: 1999,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Shure SM7B",
          categoria: "Microfone",
          preco: 3499,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "GoXLR Mini",
          categoria: "Interface de Áudio",
          preco: 1799,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Elgato Stream Deck MK.2",
          categoria: "Controlador",
          preco: 999,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Setup Compacto para Apartamento",
      descricao:
        "Solução inteligente para espaços pequenos, maximizando produtividade em ambientes reduzidos.",
      imagemUrl:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      autor: "Fernanda Lima",
      fonte: "Pinterest",
      categorias: ["minimalista", "moderno", "trabalho"],
      produtos: [
        {
          nome: "Mesa Dobrável de Parede",
          categoria: "Mesa",
          preco: 799,
          loja: "ANMA Setups",
          linkCompra: "https://anmasetups.com.br",
          destaque: true,
        },
        {
          nome: "MacBook Air M3",
          categoria: "Notebook",
          preco: 12999,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Hub USB-C 10 em 1",
          categoria: "Acessório",
          preco: 299,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
        {
          nome: "Suporte para Notebook",
          categoria: "Suporte",
          preco: 199,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Setup Retro Gaming",
      descricao:
        "Homenagem aos clássicos com visual retrô moderno, incluindo consoles vintage e decoração nostálgica.",
      imagemUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      autor: "Thiago Retro",
      fonte: "Reddit",
      categorias: ["gamer", "estiloso"],
      produtos: [
        {
          nome: 'TV CRT Sony 21"',
          categoria: "TV",
          preco: 599,
          loja: "OLX",
          linkCompra: "https://olx.com.br",
          destaque: true,
        },
        {
          nome: "Nintendo 64 Original",
          categoria: "Console",
          preco: 899,
          loja: "Mercado Livre",
          linkCompra: "https://mercadolivre.com.br",
        },
        {
          nome: "Super Nintendo Original",
          categoria: "Console",
          preco: 699,
          loja: "Mercado Livre",
          linkCompra: "https://mercadolivre.com.br",
        },
        {
          nome: "Estante Retrô para Games",
          categoria: "Móvel",
          preco: 499,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
    {
      titulo: "Setup Ultra Clean White",
      descricao:
        "Todo em branco, esse setup é o ápice do minimalismo com cada detalhe pensado para harmonia visual.",
      imagemUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      autor: "Camila White",
      fonte: "Instagram",
      fonteUrl: "https://instagram.com",
      categorias: ["minimalista", "claro", "moderno"],
      produtos: [
        {
          nome: 'Samsung Smart Monitor M8 32"',
          categoria: "Monitor",
          preco: 4499,
          loja: "Samsung",
          linkCompra: "https://samsung.com/br",
          destaque: true,
        },
        {
          nome: "Apple Magic Keyboard (Branco)",
          categoria: "Teclado",
          preco: 1099,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Apple Magic Mouse (Branco)",
          categoria: "Mouse",
          preco: 699,
          loja: "Apple Store",
          linkCompra: "https://apple.com/br",
        },
        {
          nome: "Mesa Branca 140cm",
          categoria: "Mesa",
          preco: 899,
          loja: "IKEA",
          linkCompra: "https://ikea.com/br",
        },
        {
          nome: "Cadeira Eames Branca",
          categoria: "Cadeira",
          preco: 799,
          loja: "Amazon",
          linkCompra: "https://amazon.com.br",
        },
      ],
    },
  ];

  // Criar setups
  for (const setupData of setupsData) {
    const { categorias: catSlugs, produtos, ...setup } = setupData;

    const createdSetup = await prisma.setup.create({
      data: {
        ...setup,
        categorias: {
          connect: catSlugs.map((slug) => ({ slug })),
        },
      },
    });

    // Criar produtos do setup
    for (let i = 0; i < produtos.length; i++) {
      await prisma.produto.create({
        data: {
          ...produtos[i],
          ordem: i,
          setupId: createdSetup.id,
        },
      });
    }

    console.log(`Created setup: ${setup.titulo}`);
  }

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
