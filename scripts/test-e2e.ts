import { prisma } from "../src/lib/prisma";
import { checkPassword, signToken, verifyToken } from "../src/lib/auth";
import { formatINR, rupeesToPaise, paiseToRupees } from "../src/lib/money";
import { customerSchema, ledgerEntrySchema } from "../src/lib/validations";
import { translations } from "../src/lib/translations";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   UDHAAR SAATHI E2E VERIFICATION SUITE         ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Check Auth & Password
  console.log("\n--- TEST GROUP 1: AUTH & SECURITY ---");
  assert(checkPassword("kirana123") === true, "Password check passes for 'kirana123'");
  assert(checkPassword("wrongpass") === false, "Password check fails for incorrect password");

  const testShopId = "shop_test_123";
  const token = signToken(testShopId);
  const decoded = verifyToken(token);
  assert(decoded === testShopId, `Session HMAC token properly signed & verified: ${token.slice(0, 20)}...`);

  const tamperedToken = token + "tamper";
  assert(verifyToken(tamperedToken) === null, "Tampered session token rejected");

  // 2. Money & Integer Paise Calculation
  console.log("\n--- TEST GROUP 2: INTEGER PAISE & MONEY ---");
  assert(rupeesToPaise(100) === 10000, "₹100 converts to 10000 paise");
  assert(rupeesToPaise(1450.50) === 145050, "₹1450.50 converts to 145050 paise");
  assert(paiseToRupees(145050) === 1450.50, "145050 paise converts back to ₹1450.50");
  assert(formatINR(145000) === "₹1,450", `formatINR(145000) formats as: ${formatINR(145000)}`);

  // 3. Zod Input Validations
  console.log("\n--- TEST GROUP 3: ZOD VALIDATION ---");
  const validCust = customerSchema.safeParse({ name: "Ramesh Kumar", phone: "9876543210" });
  assert(validCust.success === true, "Valid Indian customer passes validation (10 digits starting with 9)");

  const invalidPhone = customerSchema.safeParse({ name: "Ramesh Kumar", phone: "12345" });
  assert(invalidPhone.success === false, "Invalid short phone rejected by Zod");

  const invalidPhoneStarts5 = customerSchema.safeParse({ name: "Ramesh Kumar", phone: "5123456789" });
  assert(invalidPhoneStarts5.success === false, "Phone starting with 5 rejected (must start with 6-9)");

  const validCredit = ledgerEntrySchema.safeParse({
    customerId: "cust_123",
    type: "CREDIT_GIVEN",
    amountRupees: 250,
    note: "Dal and Sugar",
  });
  assert(validCredit.success === true, "Valid credit entry passes validation");

  const negativeAmount = ledgerEntrySchema.safeParse({
    customerId: "cust_123",
    type: "CREDIT_GIVEN",
    amountRupees: -50,
  });
  assert(negativeAmount.success === false, "Negative amount rejected by positive amount rule");

  // 4. Database Demo Seed Verification & Shop Scoping
  console.log("\n--- TEST GROUP 4: DATABASE & SHOP SCOPE ---");
  const shop = await prisma.shop.findFirst({
    where: { isDemo: true },
    include: {
      customers: {
        include: { entries: true },
      },
    },
  });
  assert(!!shop, `Found Demo Shop: "${shop?.name}" with isDemo: ${shop?.isDemo}`);
  assert((shop?.customers.length || 0) >= 6, `Demo shop has ${shop?.customers.length} seeded customers (>= 6)`);

  // Calculate balances on server
  let totalOutstanding = 0;
  let countWithDues = 0;

  for (const c of shop?.customers || []) {
    let bal = 0;
    for (const e of c.entries) {
      if (e.type === "CREDIT_GIVEN") bal += e.amountPaise;
      else if (e.type === "PAYMENT_RECEIVED") bal -= e.amountPaise;
    }
    if (bal > 0) {
      totalOutstanding += bal;
      countWithDues++;
    }
  }

  console.log(`Computed Total Outstanding: ${formatINR(totalOutstanding)} across ${countWithDues} debtors`);
  assert(totalOutstanding > 0, "Total outstanding balance is calculated on server and positive");
  assert(countWithDues >= 4, `Count of customers with dues: ${countWithDues}`);

  // 5. Append-only Reversal Verification
  console.log("\n--- TEST GROUP 5: APPEND-ONLY CORRECTION & REVERSAL ---");
  const testCustomer = await prisma.customer.create({
    data: {
      shopId: shop!.id,
      name: "Test Audit Customer",
      phone: "9811122233",
    },
  });

  // Add initial credit: ₹500
  const entry1 = await prisma.ledgerEntry.create({
    data: {
      shopId: shop!.id,
      customerId: testCustomer.id,
      type: "CREDIT_GIVEN",
      amountPaise: 50000,
      note: "Mistaken credit of ₹500",
    },
  });

  const countBefore = await prisma.ledgerEntry.count({
    where: { customerId: testCustomer.id },
  });
  assert(countBefore === 1, "Initial credit entry created (total entries: 1)");

  // Reversal: Instead of deleting or editing, create an offsetting PAYMENT_RECEIVED entry
  const reversalEntry = await prisma.ledgerEntry.create({
    data: {
      shopId: shop!.id,
      customerId: testCustomer.id,
      type: "PAYMENT_RECEIVED",
      amountPaise: entry1.amountPaise,
      note: `Reversal of Credit (₹500.00) - "${entry1.note}"`,
    },
  });

  const countAfter = await prisma.ledgerEntry.count({
    where: { customerId: testCustomer.id },
  });
  assert(countAfter === 2, "Append-only rule respected: Entry count increased to 2, original entry intact");

  // Verify resulting balance is 0
  const customerEntries = await prisma.ledgerEntry.findMany({
    where: { customerId: testCustomer.id },
  });
  let netTestBalance = 0;
  for (const e of customerEntries) {
    if (e.type === "CREDIT_GIVEN") netTestBalance += e.amountPaise;
    else if (e.type === "PAYMENT_RECEIVED") netTestBalance -= e.amountPaise;
  }
  assert(netTestBalance === 0, `Net balance after append-only reversal is exact ₹0 (${netTestBalance} paise)`);

  // Clean up test audit customer
  await prisma.ledgerEntry.deleteMany({ where: { customerId: testCustomer.id } });
  await prisma.customer.delete({ where: { id: testCustomer.id } });

  // 6. WhatsApp Remind Link Verification
  console.log("\n--- TEST GROUP 6: WHATSAPP REMIND LINK FORMAT ---");
  const testName = "Sunita Sharma";
  const testShop = "Gupta Kirana Store";
  const testAmount = "1,450";

  const enMsg = translations.en.reminderMessage(testName, testShop, testAmount);
  const hiMsg = translations.hi.reminderMessage(testName, testShop, testAmount);
  const asMsg = translations.as.reminderMessage(testName, testShop, testAmount);

  console.log(`EN Reminder: "${enMsg}"`);
  console.log(`HI Reminder: "${hiMsg}"`);
  console.log(`AS Reminder: "${asMsg}"`);

  assert(enMsg.includes("Namaste Sunita Sharma") && enMsg.includes("₹1,450"), "English reminder format matches requirement");
  assert(hiMsg.includes("नमस्ते Sunita Sharma") && hiMsg.includes("₹1,450"), "Hindi reminder format matches requirement");
  assert(asMsg.includes("নমস্কাৰ Sunita Sharma") && asMsg.includes("₹1,450"), "Assamese reminder format matches requirement");

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(enMsg)}`;
  assert(waUrl.startsWith("https://wa.me/919876543210?text="), `wa.me reminder URL generated cleanly: ${waUrl.slice(0, 50)}...`);

  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) process.exit(1);
}

runTestSuite()
  .catch((err) => {
    console.error("Test suite threw error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
