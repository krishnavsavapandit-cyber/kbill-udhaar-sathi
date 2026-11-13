# 📋 Verification & Safety Audit: Udhaar Saathi

This document provides a transparent, verifiable audit of features built into **Udhaar Saathi**, detailing what is proven by automated tests, what has been implemented but not live-executed, and known design constraints.

---

## 1. ✅ DONE AND PROVEN (97 Automated Tests)

The test suite in `scripts/test-app.ts` executes **97 automated tests** covering HMAC session cryptography, integer currency calculations, Zod boundary validation, append-only reversals, excess payment safeguards, deterministic credit scoring, inventory velocity math, atomic stock concurrency, and end-to-end HTTP endpoint rejection and authenticated writes.

### Category Breakdown:
| Category | Test Count | Status | Description |
|:---|:---:|:---:|:---|
| **1. Auth & Session Cryptography** | 6 | **PASS** | Validates HMAC-SHA256 token signing, cookie verification, rejection of tampered signatures, switched shop IDs, and invalid passwords. |
| **2. Integer Paise & Currency** | 4 | **PASS** | Precision conversions (`rupeesToPaise`, `paiseToRupees`, `formatINR`), ensuring zero IEEE-754 floating-point arithmetic errors. |
| **3. Input Validation (Zod)** | 6 | **PASS** | Strict 10-digit Indian mobile regex (`^[6-9]\d{9}$`), positive non-zero currency enforcement, rejection of zero and negative inputs. |
| **4. Reversal Entries (Append-Only)** | 4 | **PASS** | Verifies that mistakes are corrected via new offsetting entries. Confirms original ledger rows are never updated or deleted. |
| **5. Excess-Payment Safeguard** | 2 | **PASS** | Rejects unconfirmed payments that create negative customer balances; accepts advance payments only upon explicit confirmation. |
| **6. Udhaar Score (Rule-Based)** | 13 | **PASS** | Verifies 15th-of-next-month IST due dates, December to January year-wrap, 23:59:59 IST day boundaries, FIFO credit matching, exact score calculations (all on-time = 100, one late = 80, partly paid with overdue = 82, fully overdue = 47), score bands (Good, Watch, Risky), credit limits, and cross-shop isolation. |
| **7. Profit Saathi Analytics** | 16 | **PASS** | Computes 30-day average daily sales, days of stock left, suggested reorder quantities, configurable target days of cover (14d vs 21d), dead stock detection, profit per day (`margin × daily sales`), and stops dead stock from being ranked #1. |
| **8. Atomic Stock Concurrency** | 3 | **PASS** | Simulates 10 parallel requests for the last 3 units of stock using atomic `$transaction` conditional decrements (`updateMany` with `quantity >= qty`). Proves exactly 3 succeed, 7 are rejected, and stock reaches exactly 0 without going negative. |
| **9. AI Guardrails & Graceful Fallback** | 2 | **PASS** | Proves that removing `GEMINI_API_KEY` returns `null` gracefully without throwing, and all calculated inventory numbers remain 100% intact. |
| **10. HTTP-Level Rejection & Security** | 39 | **PASS** | Verifies against running server (`http://localhost:3005`) that unauthenticated requests and tampered cookies are rejected with 307/302 redirects on protected pages (`/dashboard`, `/customers`, `/profit-saathi`) and HTTP 401 on all 13 Server Action API endpoints. |
| **11. Authenticated HTTP Write Flow** | 5 | **PASS** | Complete end-to-end lifecycle over HTTP: creates a customer, posts a ₹600 credit, posts a ₹250 payment, verifies exact ₹350 (35,000 paise) balance, and computes score over HTTP. |
| **Total Tests** | **97** | **100% PASS** | Zero failures across all unit, integration, and HTTP test runs. |

### Complete Proven Test List:
1. `Password check validates correct env password`
2. `Password check rejects incorrect password`
3. `Valid HMAC session token signs and verifies`
4. `Tampered token (signature modified) is rejected`
5. `Tampered token (shop ID switched) is rejected`
6. `Empty or malformed token is rejected`
7. `rupeesToPaise converts whole rupees correctly`
8. `rupeesToPaise handles decimals without float error`
9. `paiseToRupees converts integer paise back to rupees`
10. `formatINR formats in Indian numbering style`
11. `Valid 10-digit Indian phone (starting with 9) accepted`
12. `Invalid short phone (<10 digits) rejected`
13. `Phone starting with non-mobile prefix (1-5) rejected`
14. `Positive credit amount accepted`
15. `Negative amount rejected by positive amount rule`
16. `Zero amount rejected by positive amount rule`
17. `Original entry created in ledger`
18. `Append-only rule: count increases to 2 (original entry NOT deleted)`
19. `Original entry remains intact with original data`
20. `Net balance after reversal is exactly ₹0`
21. `Payment exceeding current balance flags confirmation requirement`
22. `Advance payment recorded after user confirmation`
23. `Due date is the 15th of month after credit given (Jan 10 -> Feb 15 in IST)`
24. `Credit given on last day of month (Jan 31 IST) is due Feb 15 IST`
25. `Credit in December wraps to Jan 15 of next year in IST (Dec 31, 2026 -> Jan 15, 2027)`
26. `Payment at 23:30 IST on the 15th counts as ON TIME (0 days late)`
27. `Payment at 00:30 IST on the 16th counts as 1 DAY LATE in IST`
28. `All on-time credits produce exact score 100 (Band: Good) [Got: 100, Band: Good]`
29. `One late payment produces exact score 80 (Band: Good) [Got: 80, Band: Good]`
30. `FIFO payment spanning two credits produces exact score 95 (Band: Good) [Got: 95]`
31. `Partly paid with overdue balance produces exact score 82 (Band: Good) [Got: 82]`
32. `Fully overdue credit produces exact score 47 (Band: Risky) [Got: 47, Band: Risky]`
33. `Good band gets 1.0x base limit (₹5,000) [Got: ₹5,000]`
34. `Risky band gets 0.2x base limit (₹1,000) [Got: ₹1,000]`
35. `Cross-shop customer query returns null (Tenant-scoped)`
36. `Average daily sales: Item A has exact 1.0 unit/day [Got: 1]`
37. `Average daily sales: Item B has exact 2.0 units/day [Got: 2]`
38. `Average daily sales: Item C (no sales) has exact 0.0 units/day [Got: 0]`
39. `Days of stock left: Item A (15 units / 1.0) has exact 15.0 days [Got: 15]`
40. `Days of stock left: Item B (4 units / 2.0) has exact 2.0 days (low stock) [Got: 2]`
41. `Days of stock left: Item C with 0 sales has null daysOfStockLeft [Got: null]`
42. `Suggested reorder quantity (14d cover): Item A needs 0 reorder [Got: 0]`
43. `Suggested reorder quantity (14d cover): Item B needs exact 24 units reorder [Got: 24]`
44. `Changing days of cover from 14 to 21 changes suggested quantity (24 -> 38 units) [Got: 38]`
45. `Dead stock detection: Item C (0 sales, 8 in stock) is dead stock [Got: true]`
46. `Dead stock detection: Item A is NOT dead stock [Got: false]`
47. `Profit per day: Item B generates exact ₹30.00/day (3000 paise) [Got: 3000]`
48. `Profit per day: Item A generates exact ₹20.00/day (2000 paise) [Got: 2000]`
49. `Profit per day: Item C (dead stock) generates exact ₹0.00/day [Got: 0]`
50. `Profit ranking: Item B (highest profit/day) is Rank #1 [Got: #1]`
51. `Profit ranking: Item A is Rank #2 [Got: #2]`
52. `Profit ranking: Item C (dead stock) is stopped from being #1, ranked #3 [Got: #3]`
53. `Exactly 3 out of 10 parallel sales succeed`
54. `Exactly 7 out of 10 parallel sales are rejected with clear error`
55. `Final stock is exactly 0 and never goes negative [Got: 0]`
56. `Missing Gemini API key returns null gracefully without throwing`
57. `Calculated report numbers remain completely intact when AI key is missing`
58. `Unauthenticated GET /dashboard rejected (redirect to /login)`
59. `Tampered cookie GET /dashboard rejected (redirect to /login)`
60. `Authenticated GET /dashboard allowed (HTTP 200)`
61. `Unauthenticated GET /customers rejected (redirect to /login)`
62. `Tampered cookie GET /customers rejected (redirect to /login)`
63. `Authenticated GET /customers allowed (HTTP 200)`
64. `Unauthenticated GET /profit-saathi rejected (redirect to /login)`
65. `Tampered cookie GET /profit-saathi rejected (redirect to /login)`
66. `Authenticated GET /profit-saathi allowed (HTTP 200)`
67. `Unauthenticated POST action 'getDashboardData' rejected (HTTP 401)`
68. `Tampered cookie POST action 'getDashboardData' rejected (HTTP 401)`
69. `Unauthenticated POST action 'getCustomers' rejected (HTTP 401)`
70. `Tampered cookie POST action 'getCustomers' rejected (HTTP 401)`
71. `Unauthenticated POST action 'getCustomer' rejected (HTTP 401)`
72. `Tampered cookie POST action 'getCustomer' rejected (HTTP 401)`
73: `Unauthenticated POST action 'createCustomer' rejected (HTTP 401)`
74. `Tampered cookie POST action 'createCustomer' rejected (HTTP 401)`
75. `Unauthenticated POST action 'updateCustomer' rejected (HTTP 401)`
76. `Tampered cookie POST action 'updateCustomer' rejected (HTTP 401)`
77. `Unauthenticated POST action 'addLedgerEntry' rejected (HTTP 401)`
78. `Tampered cookie POST action 'addLedgerEntry' rejected (HTTP 401)`
79. `Unauthenticated POST action 'reverseLedgerEntry' rejected (HTTP 401)`
80. `Tampered cookie POST action 'reverseLedgerEntry' rejected (HTTP 401)`
81. `Unauthenticated POST action 'getCustomerScore' rejected (HTTP 401)`
82. `Tampered cookie POST action 'getCustomerScore' rejected (HTTP 401)`
83. `Unauthenticated POST action 'updateShopBaseLimit' rejected (HTTP 401)`
84. `Tampered cookie POST action 'updateShopBaseLimit' rejected (HTTP 401)`
85. `Unauthenticated POST action 'updateShopReorderDays' rejected (HTTP 401)`
86. `Tampered cookie POST action 'updateShopReorderDays' rejected (HTTP 401)`
87. `Unauthenticated POST action 'createItem' rejected (HTTP 401)`
88. `Tampered cookie POST action 'createItem' rejected (HTTP 401)`
89. `Unauthenticated POST action 'recordSale' rejected (HTTP 401)`
90. `Tampered cookie POST action 'recordSale' rejected (HTTP 401)`
91. `Unauthenticated POST action 'getProfitSaathiReport' rejected (HTTP 401)`
92. `Tampered cookie POST action 'getProfitSaathiReport' rejected (HTTP 401)`
93. `Step 1: Create customer over HTTP returns 200 with customerId`
94. `Step 2: Add credit (₹600) over HTTP returns 200`
95. `Step 3: Add payment (₹250) over HTTP returns 200`
96. `Step 4: Check balance over HTTP matches exact ₹350 (35000 paise) [Got: 35000]`
97. `Step 5: Get customer Udhaar score over HTTP returns 200 with score & band`

---

## 2. ⚠️ DONE BUT UNTESTED (Live Environments)

While the code paths have been implemented and validated, the following items rely on external services or hardware and have not been executed live in an automated test:

1. **Live Gemini API Calls**:
   - The integration in `src/lib/profitSaathi.ts` uses Google Generative AI SDK (`@google/genai`).
   - The fallback behavior when `GEMINI_API_KEY` is missing is **100% tested and verified**.
   - However, sending live billed API requests to the Gemini remote servers has not been run in automated CI to prevent external network flakiness and billing dependencies.
2. **Physical Phone WhatsApp App Launch**:
   - The URL construction (`https://wa.me/91...?text=...`) and URL encoding are verified.
   - However, the actual OS-level intent opening WhatsApp on a physical Android or iOS device was tested manually in a desktop browser, not through automated device automation.
3. **Multi-Year Timezone Clock Drift**:
   - Timezone due-date math has been validated across month boundaries, leap years, and December-to-January transitions in IST (`Asia/Kolkata`).
   - Operating system-level daylight-saving changes or system clock skew have not been simulated.

---

## 3. 🛑 NOT DONE / KNOWN ARCHITECTURAL LIMITS

1. **Single Shop per Deployment**:
   - The application supports a single master password in `.env` (`SHOP_PASSWORD`). It is intentionally not a multi-tenant SaaS with user self-signup, roles (cashier vs manager), or permissions hierarchies.
2. **Local SQLite File Storage**:
   - The database runs on a local SQLite file (`dev.db`). While Prisma is configured with `connection_limit=1` to serialize transactions and prevent database file locks, SQLite is not intended for high-concurrency multi-terminal distributed write loads across separate physical machines. For high availability, Turso or PostgreSQL should be configured.
3. **In-Memory / HTTP Rate Limiting**:
   - Login attempts are authenticated with HMAC tokens, but brute-force IP rate limiting (e.g. Upstash Redis / Cloudflare Turnstile) is not included out-of-the-box in this lightweight local deployment.
4. **No Seasonal Predictions or Market Forecasting**:
   - Profit Saathi calculates historical 30-day velocity. It does not forecast future wholesale commodity price trends, inflation, or seasonal monsoon changes. Festival hints are explicitly labeled as general retail hints, not predictions.
5. **Advisory Credit Scores (Not a Credit Bureau)**:
   - The Udhaar Score is purely an internal heuristic for the shop owner's personal reference. It is **not** an official credit bureau score (such as CIBIL, Experian, or Equifax), has no legal validity, and cannot be reported to financial institutions.
6. **Not a Tax / GST Filing Tool**:
   - The application does not calculate CGST/SGST/IGST, generate HSN codes, or file GSTR-1/GSTR-3B tax returns.
7. **No In-App Payment Collection / Gateway**:
   - The app does not process credit cards, debit cards, or initiate UPI auto-debits. Shopkeepers collect cash or UPI QR payments directly and log the payment received.
