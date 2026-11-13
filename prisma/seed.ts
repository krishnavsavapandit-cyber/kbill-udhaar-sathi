import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding realistic demo data for Udhaar Saathi...");

  // 1. Find or create the primary demo shop
  let shop = await prisma.shop.findFirst();

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        name: "Gupta Kirana & General Store",
        ownerName: "Ramesh Gupta",
        phone: "9876543210",
        isDemo: true,
      },
    });
  } else {
    shop = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        isDemo: true, // Marked as Demo Data for UI banner
        name: "Gupta Kirana & General Store",
        ownerName: "Ramesh Gupta",
      },
    });
  }

  // Clear existing records for this shop to maintain clean idempotent seed
  await prisma.ledgerEntry.deleteMany({
    where: { shopId: shop.id },
  });
  await prisma.customer.deleteMany({
    where: { shopId: shop.id },
  });

  console.log(`Using Shop: ${shop.name} (ID: ${shop.id})`);

  // 2. Demo Customers with realistic Indian Kirana accounts
  const demoCustomers = [
    {
      name: "Sunita Sharma",
      phone: "9876543210",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 95000, // ₹950
          note: "Aashirvaad Atta 10kg + Fortune Oil 1L",
          daysAgo: 5,
        },
        {
          type: "CREDIT_GIVEN",
          amountPaise: 50000, // ₹500
          note: "Tata Tea Gold + Sugar 5kg",
          daysAgo: 3,
        },
      ],
    },
    {
      name: "Rajesh Patel",
      phone: "9812345678",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 120000, // ₹1,200
          note: "Basmati Rice 5kg + Toor Dal 2kg",
          daysAgo: 7,
        },
        {
          type: "PAYMENT_RECEIVED",
          amountPaise: 38000, // ₹380
          note: "Cash received",
          daysAgo: 2,
        },
      ],
    },
    {
      name: "Amit Verma",
      phone: "9898989898",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 250000, // ₹2,500
          note: "Monthly provision box + Cleaning supplies",
          daysAgo: 10,
        },
        {
          type: "CREDIT_GIVEN",
          amountPaise: 70000, // ₹700
          note: "Dry Fruits & Ghee",
          daysAgo: 4,
        },
      ],
    },
    {
      name: "Priya Singh",
      phone: "9765432109",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 150000, // ₹1,500
          note: "Spices & Grocery items",
          daysAgo: 8,
        },
        {
          type: "PAYMENT_RECEIVED",
          amountPaise: 150000, // ₹1,500 (Settled)
          note: "Paid in full via GPay UPI",
          daysAgo: 1,
        },
      ],
    },
    {
      name: "Vikram Joshi",
      phone: "9988776655",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 65000, // ₹650
          note: "Milk coupon & Bread daily supplies",
          daysAgo: 2,
        },
      ],
    },
    {
      name: "Neha Gupta",
      phone: "9823456789",
      entries: [
        {
          type: "CREDIT_GIVEN",
          amountPaise: 80000, // ₹800
          note: "Stationery & Snacks",
          daysAgo: 4,
        },
        {
          type: "PAYMENT_RECEIVED",
          amountPaise: 100000, // ₹1,000 (Resulting in ₹200 advance)
          note: "Advance payment round off",
          daysAgo: 1,
        },
      ],
    },
  ];

  for (const c of demoCustomers) {
    const customer = await prisma.customer.create({
      data: {
        shopId: shop.id,
        name: c.name,
        phone: c.phone,
      },
    });

    for (const e of c.entries) {
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - e.daysAgo);

      await prisma.ledgerEntry.create({
        data: {
          shopId: shop.id,
          customerId: customer.id,
          type: e.type,
          amountPaise: e.amountPaise,
          note: e.note,
          createdAt: entryDate,
        },
      });
    }
  }

  console.log("✅ Demo seed completed successfully!");
  console.log(`Created 6 customers with realistic khata transactions.`);
  console.log(`UI labeled as: 'Demo data' on Shop: ${shop.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
