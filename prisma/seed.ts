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
  await prisma.sale.deleteMany({ where: { shopId: shop.id } });
  await prisma.item.deleteMany({ where: { shopId: shop.id } });
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

  // 3. Demo Inventory Items & Sales History (Part 3: Profit Saathi)
  console.log("📦 Seeding inventory items and 30-day sales history...");

  const demoItems = [
    {
      name: "Fortune Sunlite Sunflower Oil 1L",
      costPaise: 11500, // ₹115
      pricePaise: 14000, // ₹140 (17.9% margin)
      quantity: 18,
      category: "Cooking Oils",
      salesCount: 15, // 15 units sold over last 30 days (0.5 units/day, 36 days stock)
    },
    {
      name: "Aashirvaad Superior MP Atta 10kg",
      costPaise: 38000, // ₹380
      pricePaise: 44000, // ₹440 (13.6% margin)
      quantity: 6,
      category: "Flours & Grains",
      salesCount: 18, // 18 units sold (0.6 units/day, 10 days stock left - Low Stock)
    },
    {
      name: "Tata Tea Gold 500g",
      costPaise: 26000, // ₹260
      pricePaise: 32000, // ₹320 (18.8% margin)
      quantity: 14,
      category: "Beverages",
      salesCount: 9, // 9 units sold (0.3 units/day, 46.7 days stock)
    },
    {
      name: "Cadbury Celebrations Gift Box",
      costPaise: 22000, // ₹220
      pricePaise: 28000, // ₹280 (21.4% margin - Top Margin)
      quantity: 12,
      category: "Confectionery",
      salesCount: 0, // 0 units sold in 30 days -> Dead Stock!
    },
    {
      name: "Colgate Strong Teeth 200g",
      costPaise: 9000, // ₹90
      pricePaise: 12000, // ₹120 (25.0% margin)
      quantity: 25,
      category: "Personal Care",
      salesCount: 20, // 20 units sold (0.67 units/day)
    },
  ];

  for (const it of demoItems) {
    const item = await prisma.item.create({
      data: {
        shopId: shop.id,
        name: it.name,
        costPaise: it.costPaise,
        pricePaise: it.pricePaise,
        quantity: it.quantity,
        category: it.category,
      },
    });

    // Create distributed sales over the last 30 days
    if (it.salesCount > 0) {
      for (let s = 1; s <= it.salesCount; s++) {
        const daysAgo = Math.floor((s * 28) / it.salesCount);
        const saleDate = new Date();
        saleDate.setDate(saleDate.getDate() - daysAgo);

        await prisma.sale.create({
          data: {
            shopId: shop.id,
            itemId: item.id,
            quantity: 1,
            unitPricePaise: it.pricePaise,
            totalPaise: it.pricePaise,
            createdAt: saleDate,
          },
        });
      }
    }
  }

  console.log("✅ Demo seed completed successfully!");
  console.log(`Created 6 customers and 5 inventory products with sales history.`);
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
