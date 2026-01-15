import { PrismaClient } from "@prisma/client";
import { AFFILIATE_SEED_DATA } from "../lib/affiliate/seed-data";

const prisma = new PrismaClient();

async function seedAffiliates() {
  console.log("Seeding affiliate configs...\n");

  let created = 0;
  let updated = 0;

  for (const config of AFFILIATE_SEED_DATA) {
    const existing = await prisma.affiliateConfig.findUnique({
      where: { storeKey: config.storeKey },
    });

    await prisma.affiliateConfig.upsert({
      where: { storeKey: config.storeKey },
      update: {
        storeName: config.storeName,
        domains: config.domains,
        affiliateType: config.affiliateType,
        affiliateParam: config.affiliateParam || null,
        redirectTemplate: config.redirectTemplate || null,
        programName: config.programName || null,
        programUrl: config.programUrl || null,
        commissionInfo: config.commissionInfo || null,
      },
      create: {
        storeKey: config.storeKey,
        storeName: config.storeName,
        domains: config.domains,
        affiliateType: config.affiliateType,
        affiliateParam: config.affiliateParam || null,
        redirectTemplate: config.redirectTemplate || null,
        programName: config.programName || null,
        programUrl: config.programUrl || null,
        commissionInfo: config.commissionInfo || null,
        isActive: false, // Começa inativo até que o código de afiliado seja adicionado
      },
    });

    if (existing) {
      updated++;
      console.log(`  [updated] ${config.storeName}`);
    } else {
      created++;
      console.log(`  [created] ${config.storeName}`);
    }
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}`);
}

seedAffiliates()
  .catch((error) => {
    console.error("Error seeding affiliates:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
