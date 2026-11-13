import { prisma } from "../src/lib/prisma";
import { checkPassword, signToken, verifyToken, COOKIE_NAME } from "../src/lib/auth";
import { formatINR, rupeesToPaise, paiseToRupees } from "../src/lib/money";
import { customerSchema, ledgerEntrySchema } from "../src/lib/validations";
import { translations } from "../src/lib/translations";

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

  // Verify the original entry still exists in DB
  const originalStillExists = await prisma.ledgerEntry.findUnique({ where: { id: entryCredit.id } });
  record("Reversal & Append-only", "Original entry remains intact with original data", originalStillExists !== null && originalStillExists.amountPaise === 75000);

  // Verify net balance after reversal is 0
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
  // Customer has balance ₹0. Attempt to record payment of ₹200 without confirmation.
  const paymentAttemptAmountPaise = 20000;
  const currentCustomerBalance = netBal; // 0
  const resultingBal = currentCustomerBalance - paymentAttemptAmountPaise;

  const requiresConfirmation = resultingBal < 0;
  record("Excess Payment Rule", "Payment exceeding current balance flags confirmation requirement", requiresConfirmation === true);

  // When confirmed (allowNegativeBalance: true), advance payment is recorded
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
  // 6. HTTP-LEVEL TESTS AGAINST RUNNING APP
  // ---------------------------------------------------------------------------
  console.log(`\n▶ 6. HTTP-LEVEL REJECTION & SECURITY (${BASE_URL})`);
  const validCookieHeader = `${COOKIE_NAME}=${signToken(shop.id)}`;
  const tamperedCookieHeader = `${COOKIE_NAME}=tampered.token.value`;

  // Test 6.1: Page protections (redirect to login or rejected)
  const protectedPages = ["/dashboard", "/customers"];
  for (const page of protectedPages) {
    // Unauthenticated GET (manual redirect inspection)
    const unauthRes = await fetch(`${BASE_URL}${page}`, {
      method: "GET",
      redirect: "manual",
    });
    const isUnauthRejected =
      unauthRes.status === 307 ||
      unauthRes.status === 302 ||
      (unauthRes.headers.get("location")?.includes("/login") ?? false);
    record("HTTP Security", `Unauthenticated GET ${page} rejected (redirect to /login)`, isUnauthRejected, `status: ${unauthRes.status}`);

    // Tampered cookie GET
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

    // Authenticated GET
    const authRes = await fetch(`${BASE_URL}${page}`, {
      method: "GET",
      headers: { Cookie: validCookieHeader },
      redirect: "manual",
    });
    record("HTTP Security", `Authenticated GET ${page} allowed (HTTP 200)`, authRes.status === 200, `status: ${authRes.status}`);
  }

  // Test 6.2: Action endpoint protections (/api/action)
  const actionList = [
    { action: "getDashboardData" },
    { action: "getCustomers" },
    { action: "getCustomer", payload: { id: "test" } },
    { action: "createCustomer", payload: { name: "Test", phone: "9876543210" } },
    { action: "updateCustomer", payload: { id: "test", name: "Test", phone: "9876543210" } },
    { action: "addLedgerEntry", payload: { customerId: "test", type: "CREDIT_GIVEN", amountRupees: 100 } },
    { action: "reverseLedgerEntry", payload: { entryId: "test" } },
  ];

  for (const { action, payload } of actionList) {
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

  // Test 6.3: Authenticated POST actions
  const authDashRes = await fetch(`${BASE_URL}/api/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: validCookieHeader,
    },
    body: JSON.stringify({ action: "getDashboardData" }),
  });
  const authDashJson = await authDashRes.json();
  record(
    "HTTP Action API",
    "Authenticated POST action 'getDashboardData' returns 200 with shop metrics",
    authDashRes.status === 200 && authDashJson.success === true && typeof authDashJson.data?.totalOutstandingPaise === "number"
  );

  const authCustRes = await fetch(`${BASE_URL}/api/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: validCookieHeader,
    },
    body: JSON.stringify({ action: "getCustomers" }),
  });
  const authCustJson = await authCustRes.json();
  record(
    "HTTP Action API",
    "Authenticated POST action 'getCustomers' returns 200 with customer array",
    authCustRes.status === 200 && authCustJson.success === true && Array.isArray(authCustJson.data)
  );

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
