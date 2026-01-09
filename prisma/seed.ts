import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Criar categorias se não existirem
  const categoriasData = [
    {
      nome: "Minimalista",
      slug: "minimalista",
      descricao: "Setups limpos e organizados com o essencial",
      cor: "#10b981",
      icone: "Sparkles",
      ordem: 1,
    },
    {
      nome: "Moderno",
      slug: "moderno",
      descricao: "Designs contemporâneos com tecnologia de ponta",
      cor: "#3b82f6",
      icone: "Monitor",
      ordem: 2,
    },
    {
      nome: "Gamer",
      slug: "gamer",
      descricao: "Setups otimizados para gaming com RGB e performance",
      cor: "#ef4444",
      icone: "Gamepad2",
      ordem: 3,
    },
    {
      nome: "Trabalho",
      slug: "trabalho",
      descricao: "Workspaces produtivos para home office",
      cor: "#f59e0b",
      icone: "Briefcase",
      ordem: 4,
    },
    {
      nome: "Estiloso",
      slug: "estiloso",
      descricao: "Setups com design único e personalidade",
      cor: "#ec4899",
      icone: "Palette",
      ordem: 5,
    },
    {
      nome: "Escuro",
      slug: "escuro",
      descricao: "Ambientes dark com iluminação ambiente",
      cor: "#6366f1",
      icone: "Moon",
      ordem: 6,
    },
    {
      nome: "Claro",
      slug: "claro",
      descricao: "Espaços luminosos e clean",
      cor: "#fbbf24",
      icone: "Sun",
      ordem: 7,
    },
    {
      nome: "Amadeirado",
      slug: "amadeirado",
      descricao: "Setups com elementos de madeira natural",
      cor: "#a16207",
      icone: "TreePine",
      ordem: 8,
    },
  ];

  for (const categoria of categoriasData) {
    await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: categoria,
      create: categoria,
    });
  }

  console.log(`Created/updated ${categoriasData.length} categories`);
  console.log("Seeding completed! Setups should be added via admin panel.");
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
