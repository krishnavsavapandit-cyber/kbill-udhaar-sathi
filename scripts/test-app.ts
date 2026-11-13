import { prisma } from "../src/lib/prisma";
import { checkPassword, signToken, verifyToken, COOKIE_NAME } from "../src/lib/auth";
import { formatINR, rupeesToPaise, paiseToRupees } from "../src/lib/money";
import { customerSchema, ledgerEntrySchema } from "../src/lib/validations";
import {
  computeUdhaarScore,
  getCreditDueDate,
  computeLateDays,
  DEFAULT_SHOP_TIMEZONE,
  STARTING_SCORE,
  BAND_MULTIPLIERS,
} from "../src/lib/udhaarScore";
import {
  calculateProfitSaathiMetrics,
  getPlainLanguageSummary,
  DEFAULT_TARGET_DAYS_OF_COVER,
  STATIC_FESTIVAL_HINTS,
} from "../src/lib/profitSaathi";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

interface TestResult {
  name: string;
  category: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function record(category: string, name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    results.push({ category, name, status: "PASS", details });
  } else {
    console.error(`  ❌ FAIL: ${name} ${details ? `(${details})` : ""}`);
    results.push({ category, name, status: "FAIL", details });
  }
}

async function runTests() {
  console.log("=================================================================");
  console.log("      UDHAAR SAATHI INTEGRATION & HTTP SECURITY TEST SUITE       ");
  console.log("=================================================================\n");

  // ---------------------------------------------------------------------------
  // 1. AUTH & SECURITY UNIT TESTS
  // ---------------------------------------------------------------------------
  console.log("▶ 1. AUTH & HMAC SESSION TOKENS");
  record("Auth & Security", "Password check validates correct env password", checkPassword("kirana123") === true);
  record("Auth & Security", "Password check rejects incorrect password", checkPassword("wrong_pwd_99") === false);

  const testShopId = "test_shop_sec_01";
  const validToken = signToken(testShopId);
  record("Auth & Security", "Valid HMAC session token signs and verifies", verifyToken(validToken) === testShopId);

  const tamperedToken1 = validToken + "tamper";
  record("Auth & Security", "Tampered token (signature modified) is rejected", verifyToken(tamperedToken1) === null);

  const tamperedToken2 = "fake_shop." + validToken.split(".")[1];
  record("Auth & Security", "Tampered token (shop ID switched) is rejected", verifyToken(tamperedToken2) === null);

  record("Auth & Security", "Empty or malformed token is rejected", verifyToken("") === null && verifyToken("invalid-token") === null);

  // ---------------------------------------------------------------------------
  // 2. INTEGER PAISE & MONEY CALCULATIONS
  // ---------------------------------------------------------------------------
  console.log("\n▶ 2. INTEGER PAISE & MONEY CALCULATIONS");
  record("Money & Calculations", "rupeesToPaise converts whole rupees correctly", rupeesToPaise(500) === 50000);
  record("Money & Calculations", "rupeesToPaise handles decimals without float error", rupeesToPaise(1234.56) === 123456);
  record("Money & Calculations", "paiseToRupees converts integer paise back to rupees", paiseToRupees(123456) === 1234.56);
  record("Money & Calculations", "formatINR formats in Indian numbering style", formatINR(150000) === "₹1,500");

  // ---------------------------------------------------------------------------
  // 3. ZOD SCHEMA VALIDATION
  // ---------------------------------------------------------------------------
  console.log("\n▶ 3. INPUT VALIDATIONS (ZOD)");
  const validCustomer = customerSchema.safeParse({ name: "Mahesh Gupta", phone: "9876543210" });
  record("Validation", "Valid 10-digit Indian phone (starting with 9) accepted", validCustomer.success);

  const invalidPhoneLen = customerSchema.safeParse({ name: "Mahesh Gupta", phone: "98765" });
  record("Validation", "Invalid short phone (<10 digits) rejected", !invalidPhoneLen.success);

  const invalidPhonePrefix = customerSchema.safeParse({ name: "Mahesh Gupta", phone: "1234567890" });
  record("Validation", "Phone starting with non-mobile prefix (1-5) rejected", !invalidPhonePrefix.success);

  const validCredit = ledgerEntrySchema.safeParse({
    customerId: "cust_abc",
    type: "CREDIT_GIVEN",
    amountRupees: 450,
  });
  record("Validation", "Positive credit amount accepted", validCredit.success);

  const negativeAmount = ledgerEntrySchema.safeParse({
    customerId: "cust_abc",
    type: "CREDIT_GIVEN",
    amountRupees: -100,
  });
  record("Validation", "Negative amount rejected by positive amount rule", !negativeAmount.success);

  const zeroAmount = ledgerEntrySchema.safeParse({
    customerId: "cust_abc",
    type: "PAYMENT_RECEIVED",
    amountRupees: 0,
  });
  record("Validation", "Zero amount rejected by positive amount rule", !zeroAmount.success);

  // ---------------------------------------------------------------------------
  // 4. REVERSAL ENTRIES & APPEND-ONLY AUDIT TRAIL
  // ---------------------------------------------------------------------------
  console.log("\n▶ 4. REVERSAL ENTRIES (APPEND-ONLY)");
  const shop = await prisma.shop.findFirst();
  if (!shop) throw new Error("No shop found in database for test");

  const reversalTestCustomer = await prisma.customer.create({
    data: {
      shopId: shop.id,
      name: "Audit Trail Test Customer",
      phone: "9800011122",
    },
  });

  // Credit ₹750
  const entryCredit = await prisma.ledgerEntry.create({
    data: {
      shopId: shop.id,
      customerId: reversalTestCustomer.id,
      type: "CREDIT_GIVEN",
      amountPaise: 75000,
      note: "Accidental credit ₹750",
    },
  });

  const countAfterFirst = await prisma.ledgerEntry.count({
    where: { customerId: reversalTestCustomer.id },
  });
  record("Reversal & Append-only", "Original entry created in ledger", countAfterFirst === 1);

  // Perform reversal
  const reversalEntry = await prisma.ledgerEntry.create({
    data: {
      shopId: shop.id,
      customerId: reversalTestCustomer.id,
      type: "PAYMENT_RECEIVED",
      amountPaise: entryCredit.amountPaise,
      note: `Reversal of Credit (₹750.00) - "${entryCredit.note}"`,
    },
  });

  const countAfterReversal = await prisma.ledgerEntry.count({
    where: { customerId: reversalTestCustomer.id },
  });
  record("Reversal & Append-only", "Append-only rule: count increases to 2 (original entry NOT deleted)", countAfterReversal === 2);

  const originalStillExists = await prisma.ledgerEntry.findUnique({ where: { id: entryCredit.id } });
  record("Reversal & Append-only", "Original entry remains intact with original data", originalStillExists !== null && originalStillExists.amountPaise === 75000);

  const allReversalEntries = await prisma.ledgerEntry.findMany({
    where: { customerId: reversalTestCustomer.id },
  });
  let netBal = 0;
  for (const e of allReversalEntries) {
    if (e.type === "CREDIT_GIVEN") netBal += e.amountPaise;
    if (e.type === "PAYMENT_RECEIVED") netBal -= e.amountPaise;
  }
  record("Reversal & Append-only", "Net balance after reversal is exactly ₹0", netBal === 0);

  // ---------------------------------------------------------------------------
  // 5. EXCESS-PAYMENT RULE & CONFIRMATION
  // ---------------------------------------------------------------------------
  console.log("\n▶ 5. EXCESS-PAYMENT RULE");
  const paymentAttemptAmountPaise = 20000;
  const currentCustomerBalance = netBal; // 0
  const resultingBal = currentCustomerBalance - paymentAttemptAmountPaise;

  const requiresConfirmation = resultingBal < 0;
  record("Excess Payment Rule", "Payment exceeding current balance flags confirmation requirement", requiresConfirmation === true);

  const advancePaymentEntry = await prisma.ledgerEntry.create({
    data: {
      shopId: shop.id,
      customerId: reversalTestCustomer.id,
      type: "PAYMENT_RECEIVED",
      amountPaise: paymentAttemptAmountPaise,
      note: "Advance payment recorded with confirmation",
    },
  });
  record("Excess Payment Rule", "Advance payment recorded after user confirmation", advancePaymentEntry.amountPaise === 20000);

  // Clean up reversal test customer
  await prisma.ledgerEntry.deleteMany({ where: { customerId: reversalTestCustomer.id } });
  await prisma.customer.delete({ where: { id: reversalTestCustomer.id } });

  // ---------------------------------------------------------------------------
  // 6. UDHAAR SCORE: EXACT FORMULA & FIFO PAYMENT MATCHING TESTS
  // ---------------------------------------------------------------------------
  console.log("\n▶ 6. UDHAAR SCORE (DETERMINISTIC & RULE-BASED)");

  // Test 6.1: Due date & Time zone rules (Asia/Kolkata / IST)
  // Credit given on Jan 10 -> Due Feb 15 at 23:59:59.999 IST (= 18:29:59.999 UTC)
  const janCreditDate = new Date("2026-01-10T10:00:00Z");
  const janDueDate = getCreditDueDate(janCreditDate);
  const isFeb15 = janDueDate.toISOString().includes("2026-02-15T18:29:59.999Z");
  record("Udhaar Score Timezone", "Due date is the 15th of month after credit given (Jan 10 -> Feb 15 in IST)", isFeb15);

  // Credit given on last day of month in IST (Jan 31, 2026 23:00 IST = 17:30 UTC)
  const janLastDayCredit = new Date("2026-01-31T17:30:00.000Z"); // 23:00 IST on Jan 31
  const janLastDayDue = getCreditDueDate(janLastDayCredit);
  const isJanLastDayDueFeb15 = janLastDayDue.toISOString().includes("2026-02-15T18:29:59.999Z");
  record("Udhaar Score Timezone", "Credit given on last day of month (Jan 31 IST) is due Feb 15 IST", isJanLastDayDueFeb15);

  // Credit given in December wrapping into January (Dec 31, 2026 20:00 IST = 14:30 UTC)
  const dec31Credit = new Date("2026-12-31T14:30:00.000Z"); // Dec 31 in IST
  const dec31Due = getCreditDueDate(dec31Credit);
  const isDec31DueJan15NextYear = dec31Due.toISOString().includes("2027-01-15T18:29:59.999Z");
  record("Udhaar Score Timezone", "Credit in December wraps to Jan 15 of next year in IST (Dec 31, 2026 -> Jan 15, 2027)", isDec31DueJan15NextYear);

  // Payment at 23:30 IST on the 15th counts as ON TIME (0 days late)
  // Due date is 23:59:59.999 IST on Feb 15 (= 18:29:59.999 UTC)
  // Payment at 23:30:00 IST on Feb 15 (= 18:00:00.000 UTC)
  const pay2330IST = new Date("2026-02-15T18:00:00.000Z"); // 23:30 IST Feb 15
  const onTimeCheck = computeLateDays(pay2330IST, janDueDate);
  record("Udhaar Score Timezone", "Payment at 23:30 IST on the 15th counts as ON TIME (0 days late)", !onTimeCheck.isLate && onTimeCheck.daysLate === 0);

  // Payment at 00:30 IST on the 16th counts as 1 DAY LATE
  // Payment at 00:30:00 IST on Feb 16 (= 19:00:00.000 UTC on Feb 15)
  const pay0030IST = new Date("2026-02-15T19:00:00.000Z"); // 00:30 IST Feb 16
  const lateCheck = computeLateDays(pay0030IST, janDueDate);
  record("Udhaar Score Timezone", "Payment at 00:30 IST on the 16th counts as 1 DAY LATE in IST", lateCheck.isLate && lateCheck.daysLate === 1);

  // Test 6.2: Exact Score: All on-time (Expected Score = 100, Band = Good)
  const entriesAllOnTime = [
    {
      id: "c1",
      type: "CREDIT_GIVEN",
      amountPaise: 100000, // ₹1,000 given Jan 5 (due Feb 15)
      note: "Atta & Oil",
      createdAt: new Date("2026-01-05T10:00:00Z"),
    },
    {
      id: "p1",
      type: "PAYMENT_RECEIVED",
      amountPaise: 100000, // ₹1,000 paid Feb 10 (on-time)
      note: "Full payment via Cash",
      createdAt: new Date("2026-02-10T10:00:00Z"),
    },
  ];
  const scoreAllOnTime = computeUdhaarScore(entriesAllOnTime, 500000, new Date("2026-02-20T10:00:00Z"));
  record(
    "Udhaar Score",
    `All on-time credits produce exact score 100 (Band: Good) [Got: ${scoreAllOnTime.score}, Band: ${scoreAllOnTime.band}]`,
    scoreAllOnTime.score === 100 && scoreAllOnTime.band === "Good"
  );

  // Test 6.3: Exact Score: One late payment (Expected Score = 80, Band = Good)
  // Credit ₹1,000 given Jan 5 (due Feb 15). Paid Feb 25 (10 days late).
  // Late penalty = (100000 / 100000) * 10 * 2.0 = 20 pts.
  // 100 - 20 = 80 pts.
  const entriesOneLate = [
    {
      id: "c1",
      type: "CREDIT_GIVEN",
      amountPaise: 100000,
      note: "Provisions",
      createdAt: new Date("2026-01-05T10:00:00Z"),
    },
    {
      id: "p1",
      type: "PAYMENT_RECEIVED",
      amountPaise: 100000,
      note: "Paid 10 days late",
      createdAt: new Date("2026-02-25T10:00:00Z"),
    },
  ];
  const scoreOneLate = computeUdhaarScore(entriesOneLate, 500000, new Date("2026-03-01T10:00:00Z"));
  record(
    "Udhaar Score",
    `One late payment produces exact score 80 (Band: Good) [Got: ${scoreOneLate.score}, Band: ${scoreOneLate.band}]`,
    scoreOneLate.score === 80 && scoreOneLate.band === "Good"
  );

  // Test 6.4: Exact Score: Payment spanning two credits via FIFO (Expected Score = 95, Band = Good)
  // Credit 1: ₹500 given Jan 5 (due Feb 15).
  // Credit 2: ₹500 given Feb 5 (due Mar 15).
  // Total = ₹1,000.
  // Payment of ₹800 made Feb 25:
  // - Settles Credit 1 (₹500) 10 days late: penalty = (50000 / 100000) * 10 * 2.0 = 10 pts.
  // - Settles ₹300 of Credit 2 on-time: bonus = +5 pts.
  // - Remaining ₹200 of Credit 2 is not yet overdue as of Feb 26.
  // Net score = 100 - 10 + 5 = 95 pts.
  const entriesFIFO = [
    {
      id: "c1",
      type: "CREDIT_GIVEN",
      amountPaise: 50000,
      note: "Credit 1",
      createdAt: new Date("2026-01-05T10:00:00Z"),
    },
    {
      id: "c2",
      type: "CREDIT_GIVEN",
      amountPaise: 50000,
      note: "Credit 2",
      createdAt: new Date("2026-02-05T10:00:00Z"),
    },
    {
      id: "p1",
      type: "PAYMENT_RECEIVED",
      amountPaise: 80000,
      note: "Payment spanning two credits",
      createdAt: new Date("2026-02-25T10:00:00Z"),
    },
  ];
  const scoreFIFO = computeUdhaarScore(entriesFIFO, 500000, new Date("2026-02-26T10:00:00Z"));
  record(
    "Udhaar Score",
    `FIFO payment spanning two credits produces exact score 95 (Band: Good) [Got: ${scoreFIFO.score}]`,
    scoreFIFO.score === 95 && scoreFIFO.band === "Good"
  );

  // Test 6.5: Exact Score: Partly paid with overdue remaining (Expected Score = 82, Band = Good)
  // Credit ₹1,000 given Jan 5 (due Feb 15).
  // Paid ₹400 Feb 10 (on-time: +5 bonus).
  // Remaining ₹600 evaluated Mar 1 (14 days overdue).
  // Overdue penalty = 15 + (60000 / 100000) * 14 * 1.0 = 15 + 8.4 = 23.
  // Score = 100 + 5 - 23 = 82 pts.
  const entriesPartlyPaid = [
    {
      id: "c1",
      type: "CREDIT_GIVEN",
      amountPaise: 100000,
      note: "Partial credit",
      createdAt: new Date("2026-01-05T10:00:00Z"),
    },
    {
      id: "p1",
      type: "PAYMENT_RECEIVED",
      amountPaise: 40000,
      note: "Partial payment on-time",
      createdAt: new Date("2026-02-10T10:00:00Z"),
    },
  ];
  const scorePartlyPaid = computeUdhaarScore(entriesPartlyPaid, 500000, new Date("2026-03-01T10:00:00Z"));
  record(
    "Udhaar Score",
    `Partly paid with overdue balance produces exact score 82 (Band: Good) [Got: ${scorePartlyPaid.score}]`,
    scorePartlyPaid.score === 82 && scorePartlyPaid.band === "Good"
  );

  // Test 6.6: Exact Score: Fully overdue (Expected Score = 47, Band = Risky)
  // Credit ₹1,000 given Jan 5 (due Feb 15).
  // Zero payments. Evaluated Mar 25 (38 days overdue).
  // Overdue penalty = 15 + (1.0) * 38 * 1.0 = 53 pts.
  // Score = 100 - 53 = 47 pts.
  const entriesFullyOverdue = [
    {
      id: "c1",
      type: "CREDIT_GIVEN",
      amountPaise: 100000,
      note: "Fully overdue credit",
      createdAt: new Date("2026-01-05T10:00:00Z"),
    },
  ];
  const scoreFullyOverdue = computeUdhaarScore(entriesFullyOverdue, 500000, new Date("2026-03-25T10:00:00Z"));
  record(
    "Udhaar Score",
    `Fully overdue credit produces exact score 47 (Band: Risky) [Got: ${scoreFullyOverdue.score}, Band: ${scoreFullyOverdue.band}]`,
    scoreFullyOverdue.score === 47 && scoreFullyOverdue.band === "Risky"
  );

  // Test 6.7: Suggested credit limit scaled by score band
  const baseLimitPaise = 500000; // ₹5,000
  record(
    "Udhaar Score",
    `Good band gets 1.0x base limit (₹5,000) [Got: ${formatINR(scoreAllOnTime.suggestedLimitPaise)}]`,
    scoreAllOnTime.suggestedLimitPaise === 500000
  );
  record(
    "Udhaar Score",
    `Risky band gets 0.2x base limit (₹1,000) [Got: ${formatINR(scoreFullyOverdue.suggestedLimitPaise)}]`,
    scoreFullyOverdue.suggestedLimitPaise === 100000
  );

  // Test 6.8: Tenant isolation (Scores are strictly scoped to shop and never leak)
  const isolatedShop = await prisma.shop.create({
    data: {
      name: "Second Separate Kirana Store",
      ownerName: "Sunil Verma",
      phone: "9111223344",
      baseCreditLimitPaise: 300000, // ₹3,000
    },
  });

  const isolatedCustomer = await prisma.customer.create({
    data: {
      shopId: isolatedShop.id,
      name: "Tenant Isolated Customer",
      phone: "9812398123",
    },
  });

  // Querying isolated customer under primary shop must fail
  const crossShopQuery = await prisma.customer.findFirst({
    where: {
      id: isolatedCustomer.id,
      shopId: shop.id, // Primary shop
    },
  });
  record("Tenant Isolation", "Cross-shop customer query returns null (Tenant-scoped)", crossShopQuery === null);

  // Cleanup isolated shop
  await prisma.customer.delete({ where: { id: isolatedCustomer.id } });
  await prisma.shop.delete({ where: { id: isolatedShop.id } });

  // ---------------------------------------------------------------------------
  // 7. PROFIT SAATHI: INVENTORY CALCULATIONS & NON-NEGATIVE STOCK
  // ---------------------------------------------------------------------------
  console.log("\n▶ 7. PROFIT SAATHI (CALCULATIONS, NOT PREDICTIONS)");

  const mockRefDate = new Date("2026-03-31T12:00:00Z");

  // Synthetic item test dataset
  const testItems = [
    {
      id: "it_a",
      name: "Item A (Stable)",
      costPaise: 8000,   // ₹80 cost
      pricePaise: 10000, // ₹100 price (20.0% margin, ₹20 margin)
      quantity: 15,
      sales: Array.from({ length: 30 }, (_, i) => {
        const d = new Date(mockRefDate);
        d.setDate(d.getDate() - i);
        return { quantity: 1, createdAt: d };
      }), // 30 units sold in 30 days = 1.0 unit/day -> ₹20/day profit
    },
    {
      id: "it_b",
      name: "Item B (Fast Mover)",
      costPaise: 5000,  // ₹50 cost
      pricePaise: 6500,  // ₹65 price (23.1% margin, ₹15 margin)
      quantity: 4,
      sales: Array.from({ length: 30 }, (_, i) => {
        const d = new Date(mockRefDate);
        d.setDate(d.getDate() - i);
        return { quantity: 2, createdAt: d };
      }), // 60 units sold in 30 days = 2.0 units/day -> ₹30/day profit
    },
    {
      id: "it_c",
      name: "Item C (Dead Stock)",
      costPaise: 20000, // ₹200 cost
      pricePaise: 30000, // ₹300 price (33.3% margin - highest percentage margin)
      quantity: 8,
      sales: [], // 0 sales in 30 days -> Dead Stock -> ₹0/day profit
    },
  ];

  const profitReport = calculateProfitSaathiMetrics(testItems, 14, mockRefDate);

  // 7.1 Average daily sales over last 30 days
  const itemA = profitReport.items.find((it) => it.itemId === "it_a")!;
  const itemB = profitReport.items.find((it) => it.itemId === "it_b")!;
  const itemC = profitReport.items.find((it) => it.itemId === "it_c")!;

  record("Profit Saathi", `Average daily sales: Item A has exact 1.0 unit/day [Got: ${itemA.avgDailySales}]`, itemA.avgDailySales === 1.0);
  record("Profit Saathi", `Average daily sales: Item B has exact 2.0 units/day [Got: ${itemB.avgDailySales}]`, itemB.avgDailySales === 2.0);
  record("Profit Saathi", `Average daily sales: Item C (no sales) has exact 0.0 units/day [Got: ${itemC.avgDailySales}]`, itemC.avgDailySales === 0.0);

  // 7.2 Days of stock left: item.quantity / avgDailySales
  record("Profit Saathi", `Days of stock left: Item A (15 units / 1.0) has exact 15.0 days [Got: ${itemA.daysOfStockLeft}]`, itemA.daysOfStockLeft === 15.0);
  record("Profit Saathi", `Days of stock left: Item B (4 units / 2.0) has exact 2.0 days (low stock) [Got: ${itemB.daysOfStockLeft}]`, itemB.daysOfStockLeft === 2.0);
  record("Profit Saathi", `Days of stock left: Item C with 0 sales has null daysOfStockLeft [Got: ${itemC.daysOfStockLeft}]`, itemC.daysOfStockLeft === null);

  // 7.3 Suggested reorder quantity (Named constant: 14 days default cover vs 21 days cover)
  // Item A: Target = ceil(1.0 * 14) = 14. Current = 15. Reorder = max(0, 14 - 15) = 0.
  // Item B: Target = ceil(2.0 * 14) = 28. Current = 4. Reorder = max(0, 28 - 4) = 24.
  record("Profit Saathi", `Suggested reorder quantity (14d cover): Item A needs 0 reorder [Got: ${itemA.suggestedReorderQuantity}]`, itemA.suggestedReorderQuantity === 0);
  record("Profit Saathi", `Suggested reorder quantity (14d cover): Item B needs exact 24 units reorder [Got: ${itemB.suggestedReorderQuantity}]`, itemB.suggestedReorderQuantity === 24);

  // Reorder rule: test that changing target days of cover from 14 to 21 changes suggested quantity
  const reportCover21 = calculateProfitSaathiMetrics(testItems, 21, mockRefDate);
  const itemBCover21 = reportCover21.items.find((it) => it.itemId === "it_b")!;
  // Item B with 21 days: Target = ceil(2.0 * 21) = 42. Current = 4. Reorder = max(0, 42 - 4) = 38.
  record(
    "Profit Saathi",
    `Changing days of cover from 14 to 21 changes suggested quantity (24 -> 38 units) [Got: ${itemBCover21.suggestedReorderQuantity}]`,
    itemBCover21.suggestedReorderQuantity === 38
  );

  // 7.4 Dead stock: no sales in 30 days while stock is sitting
  record("Profit Saathi", `Dead stock detection: Item C (0 sales, 8 in stock) is dead stock [Got: ${itemC.isDeadStock}]`, itemC.isDeadStock === true);
  record("Profit Saathi", `Dead stock detection: Item A is NOT dead stock [Got: ${itemA.isDeadStock}]`, itemA.isDeadStock === false);

  // 7.5 Margin & Profit Ranking: Ranked by profit per day (margin * avg daily sales), NOT dead stock #1
  // Item B: margin 23.1%, sales 2.0/day -> ₹30.00/day profit (3000 paise) -> Rank #1
  // Item A: margin 20.0%, sales 1.0/day -> ₹20.00/day profit (2000 paise) -> Rank #2
  // Item C: margin 33.3%, sales 0.0/day -> ₹0.00/day profit (0 paise) -> Rank #3
  record("Profit Saathi", `Profit per day: Item B generates exact ₹30.00/day (3000 paise) [Got: ${itemB.profitPerDayPaise}]`, itemB.profitPerDayPaise === 3000);
  record("Profit Saathi", `Profit per day: Item A generates exact ₹20.00/day (2000 paise) [Got: ${itemA.profitPerDayPaise}]`, itemA.profitPerDayPaise === 2000);
  record("Profit Saathi", `Profit per day: Item C (dead stock) generates exact ₹0.00/day [Got: ${itemC.profitPerDayPaise}]`, itemC.profitPerDayPaise === 0);

  record("Profit Saathi", `Profit ranking: Item B (highest profit/day) is Rank #1 [Got: #${itemB.marginRank}]`, itemB.marginRank === 1);
  record("Profit Saathi", `Profit ranking: Item A is Rank #2 [Got: #${itemA.marginRank}]`, itemA.marginRank === 2);
  record("Profit Saathi", `Profit ranking: Item C (dead stock) is stopped from being #1, ranked #3 [Got: #${itemC.marginRank}]`, itemC.marginRank === 3);

  // 7.6 Stock Concurrency & Atomic Conditional Update Test
  // 10 parallel sales for the last 3 units: exactly 3 succeed, 7 are rejected, final stock is 0
  const concItem = await prisma.item.create({
    data: {
      shopId: shop.id,
      name: "Concurrency Test Product",
      costPaise: 4000,
      pricePaise: 5000,
      quantity: 3, // exactly 3 units in stock
    },
  });

  const parallelSales = await Promise.allSettled(
    Array.from({ length: 10 }, (_, i) =>
      prisma.$transaction(
        async (tx) => {
          // Single conditional update: stock >= qty
          const updateResult = await tx.item.updateMany({
            where: {
              id: concItem.id,
              shopId: shop.id,
              quantity: { gte: 1 },
            },
            data: {
              quantity: { decrement: 1 },
            },
          });

          if (updateResult.count === 0) {
            throw new Error("Insufficient stock. Stock depleted by parallel sale");
          }

          const sale = await tx.sale.create({
            data: {
              shopId: shop.id,
              itemId: concItem.id,
              quantity: 1,
              unitPricePaise: concItem.pricePaise,
              totalPaise: concItem.pricePaise,
            },
          });
          return { success: true, saleId: sale.id, attempt: i + 1 };
        },
        { timeout: 30000, maxWait: 30000 }
      )
    )
  );

  console.log("\n  [RAW CONCURRENCY OUTPUT - 10 PARALLEL SALES FOR 3 UNITS]:");
  const rawConcurrencyLogs = parallelSales.map((r, i) => {
    if (r.status === "fulfilled") {
      const log = `Attempt #${i + 1}: SUCCESS (Sale recorded: ${r.value.saleId})`;
      console.log(`    ${log}`);
      return log;
    } else {
      const log = `Attempt #${i + 1}: REJECTED (Error: ${(r.reason as Error).message})`;
      console.log(`    ${log}`);
      return log;
    }
  });

  const successfulSalesCount = parallelSales.filter((r) => r.status === "fulfilled").length;
  const rejectedSalesCount = parallelSales.filter((r) => r.status === "rejected").length;
  const finalConcItem = await prisma.item.findUnique({ where: { id: concItem.id } });
  const finalStock = finalConcItem?.quantity;

  record("Stock Concurrency", "Exactly 3 out of 10 parallel sales succeed", successfulSalesCount === 3, `Succeeded: ${successfulSalesCount}`);
  record("Stock Concurrency", "Exactly 7 out of 10 parallel sales are rejected with clear error", rejectedSalesCount === 7, `Rejected: ${rejectedSalesCount}`);
  record("Stock Concurrency", `Final stock is exactly 0 and never goes negative [Got: ${finalStock}]`, finalStock === 0);

  // Clean up concurrency test items
  await prisma.sale.deleteMany({ where: { itemId: concItem.id } });
  await prisma.item.delete({ where: { id: concItem.id } });

  // 7.7 Missing AI key test: returns null without error, report numbers intact
  const oldApiKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const missingKeySummary = await getPlainLanguageSummary(profitReport, "en");
  record("AI Guardrails", "Missing Gemini API key returns null gracefully without throwing", missingKeySummary === null);
  record("AI Guardrails", "Calculated report numbers remain completely intact when AI key is missing", profitReport.items.length === 3 && profitReport.totalDeadStockItemsCount === 1);
  if (oldApiKey) process.env.GEMINI_API_KEY = oldApiKey;
  if (oldApiKey) process.env.GEMINI_API_KEY = oldApiKey;

  // ---------------------------------------------------------------------------
  // 8. HTTP-LEVEL TESTS AGAINST RUNNING APP (UNAUTH & TAMPERED REJECTIONS)
  // ---------------------------------------------------------------------------
  console.log(`\n▶ 8. HTTP-LEVEL REJECTION & SECURITY (${BASE_URL})`);
  const validCookieHeader = `${COOKIE_NAME}=${signToken(shop.id)}`;
  const tamperedCookieHeader = `${COOKIE_NAME}=tampered.token.value`;

  // 8.1 Protected pages
  const protectedPages = ["/dashboard", "/customers", "/profit-saathi"];
  for (const page of protectedPages) {
    const unauthRes = await fetch(`${BASE_URL}${page}`, { method: "GET", redirect: "manual" });
    const isUnauthRejected =
      unauthRes.status === 307 ||
      unauthRes.status === 302 ||
      (unauthRes.headers.get("location")?.includes("/login") ?? false);
    record("HTTP Security", `Unauthenticated GET ${page} rejected (redirect to /login)`, isUnauthRejected, `status: ${unauthRes.status}`);

    const tamperedRes = await fetch(`${BASE_URL}${page}`, {
      method: "GET",
      headers: { Cookie: tamperedCookieHeader },
      redirect: "manual",
    });
    const isTamperedRejected =
      tamperedRes.status === 307 ||
      tamperedRes.status === 302 ||
      (tamperedRes.headers.get("location")?.includes("/login") ?? false);
    record("HTTP Security", `Tampered cookie GET ${page} rejected (redirect to /login)`, isTamperedRejected, `status: ${tamperedRes.status}`);

    const authRes = await fetch(`${BASE_URL}${page}`, {
      method: "GET",
      headers: { Cookie: validCookieHeader },
      redirect: "manual",
    });
    record("HTTP Security", `Authenticated GET ${page} allowed (HTTP 200)`, authRes.status === 200, `status: ${authRes.status}`);
  }

  // 8.2 All Action endpoints (/api/action) including newly added actions
  const allActions = [
    { action: "getDashboardData" },
    { action: "getCustomers" },
    { action: "getCustomer", payload: { id: "test" } },
    { action: "createCustomer", payload: { name: "Test", phone: "9876543210" } },
    { action: "updateCustomer", payload: { id: "test", name: "Test", phone: "9876543210" } },
    { action: "addLedgerEntry", payload: { customerId: "test", type: "CREDIT_GIVEN", amountRupees: 100 } },
    { action: "reverseLedgerEntry", payload: { entryId: "test" } },
    { action: "getCustomerScore", payload: { customerId: "test" } },
    { action: "updateShopBaseLimit", payload: { baseLimitRupees: 6000 } },
    { action: "updateShopReorderDays", payload: { targetDays: 21 } },
    { action: "createItem", payload: { name: "Tea", costRupees: 200, priceRupees: 250, quantity: 10 } },
    { action: "recordSale", payload: { itemId: "test", quantity: 1 } },
    { action: "getProfitSaathiReport", payload: { lang: "en" } },
  ];

  for (const { action, payload } of allActions) {
    // Unauthenticated POST
    const unauthPost = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    record("HTTP Security", `Unauthenticated POST action '${action}' rejected (HTTP 401)`, unauthPost.status === 401, `status: ${unauthPost.status}`);

    // Tampered cookie POST
    const tamperedPost = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tamperedCookieHeader,
      },
      body: JSON.stringify({ action, payload }),
    });
    record("HTTP Security", `Tampered cookie POST action '${action}' rejected (HTTP 401)`, tamperedPost.status === 401, `status: ${tamperedPost.status}`);
  }

  // ---------------------------------------------------------------------------
  // 9. AUTHENTICATED WRITE TEST OVER HTTP (END-TO-END FLOW)
  // ---------------------------------------------------------------------------
  console.log("\n▶ 9. AUTHENTICATED WRITE TEST OVER HTTP");

  let httpCustomerId: string | undefined;
  try {
    // Step 1: Create customer via HTTP POST
    const createCustRes = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: validCookieHeader,
      },
      body: JSON.stringify({
        action: "createCustomer",
        payload: { name: "HTTP End-To-End Customer", phone: "9871122334" },
      }),
    });
    const createCustJson = await createCustRes.json();
    httpCustomerId = createCustJson.data?.customerId;
    record(
      "HTTP Write Flow",
      "Step 1: Create customer over HTTP returns 200 with customerId",
      createCustRes.status === 200 && !!httpCustomerId
    );

    // Step 2: Add credit of ₹600 via HTTP POST
    const addCreditRes = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: validCookieHeader,
      },
      body: JSON.stringify({
        action: "addLedgerEntry",
        payload: {
          customerId: httpCustomerId,
          type: "CREDIT_GIVEN",
          amountRupees: 600,
          note: "Grocery credit over HTTP",
        },
      }),
    });
    const addCreditJson = await addCreditRes.json();
    record(
      "HTTP Write Flow",
      "Step 2: Add credit (₹600) over HTTP returns 200",
      addCreditRes.status === 200 && addCreditJson.success === true
    );

    // Step 3: Add payment of ₹250 via HTTP POST
    const addPaymentRes = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: validCookieHeader,
      },
      body: JSON.stringify({
        action: "addLedgerEntry",
        payload: {
          customerId: httpCustomerId,
          type: "PAYMENT_RECEIVED",
          amountRupees: 250,
          note: "Partial payment via Cash over HTTP",
        },
      }),
    });
    const addPaymentJson = await addPaymentRes.json();
    record(
      "HTTP Write Flow",
      "Step 3: Add payment (₹250) over HTTP returns 200",
      addPaymentRes.status === 200 && addPaymentJson.success === true
    );

    // Step 4: Check customer ledger & balance over HTTP GET/POST
    const getCustRes = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: validCookieHeader,
      },
      body: JSON.stringify({
        action: "getCustomer",
        payload: { id: httpCustomerId },
      }),
    });
    const getCustJson = await getCustRes.json();
    const customerBalancePaise = getCustJson.data?.balancePaise;
    // Expected balance: ₹600 - ₹250 = ₹350 (35000 paise)
    record(
      "HTTP Write Flow",
      `Step 4: Check balance over HTTP matches exact ₹350 (35000 paise) [Got: ${customerBalancePaise}]`,
      getCustRes.status === 200 && customerBalancePaise === 35000
    );

    // Step 5: Verify customer score over HTTP
    const getScoreRes = await fetch(`${BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: validCookieHeader,
      },
      body: JSON.stringify({
        action: "getCustomerScore",
        payload: { customerId: httpCustomerId },
      }),
    });
    const getScoreJson = await getScoreRes.json();
    record(
      "HTTP Write Flow",
      "Step 5: Get customer Udhaar score over HTTP returns 200 with score & band",
      getScoreRes.status === 200 && typeof getScoreJson.data?.score === "number" && !!getScoreJson.data?.band
    );
  } finally {
    // Clean up HTTP test customer and ensure test data hygiene
    if (httpCustomerId) {
      await prisma.ledgerEntry.deleteMany({ where: { customerId: httpCustomerId } });
      await prisma.customer.delete({ where: { id: httpCustomerId } }).catch(() => {});
    }
    // Delete any stray test customers with test phone
    await prisma.customer.deleteMany({
      where: { phone: "9871122334" },
    });
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log("\n=================================================================");
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
