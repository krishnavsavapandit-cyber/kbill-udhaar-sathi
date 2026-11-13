import { PrismaClient } from "@prisma/client";
import { seedDemoData } from "./seed";

const prisma = new PrismaClient();

async function checkAndSeed() {
  try {
    const customerCount = await prisma.customer.count();
    if (customerCount === 0) {
      console.log("ℹ️ No customer records found. Automatically initializing demo data...");
      await seedDemoData();
    } else {
      console.log(`ℹ️ Database already has ${customerCount} customers. Preserving existing data.`);
    }
  } catch (error) {
    console.warn("⚠️ Warning during auto-seed check:", error);
  }
}

checkAndSeed()
  .catch((e) => {
    console.error("Auto-seed runner error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
