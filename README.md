# 📖 Udhaar Saathi (उधार साथी / ধাৰ সাৰথী)
> **Digital Khata & Profit Assistant for Local Kirana & Retail Shopkeepers in India**

Udhaar Saathi replaces the vulnerable paper credit notebook (*bahi-khata*) of Indian small shopkeepers with a focused, responsive web application that runs smoothly across mobile phones, tablets, and desktop computers.

---

## 🎯 The Problem
Small neighbourhood kirana store owners, vegetable vendors, and local retail shops in India extend credit (*udhaar*) to regular customers every single day. Traditional paper credit registers suffer from critical daily issues:
- **Pages tear, smudge, or get lost**: Spills, rain, or worn-out binding destroy historical records.
- **Manual calculation mistakes**: Mental addition and subtraction errors lead to losses or disputes with customers.
- **Awkward payment collection**: Shopkeepers hesitate to verbally confront neighbours about overdue balances.
- **Unclear repayment risk**: Shopkeepers have no objective way to decide when a customer has taken too much credit.
- **Dead stock & stockouts**: High-margin products get forgotten in godowns while fast-moving essentials run out unexpectedly.
- **Overcomplicated software**: Most generic accounting apps require complex registrations, GST numbers, inventory setups, and endless nested menus.

---

## 💡 The Solution

### 1. Digital Khata (Core Ledger)
- **Single Shopkeeper Login**: No signup friction. Protected by a shop password configured in `.env`.
- **Instant Customer Management**: Add, edit, and search customers by name or 10-digit Indian mobile number in real time.
- **Append-Only Ledger**:
  - 🔴 **Udhaar Diya (+ Credit Given)**
  - 🟢 **Jama Kiya (- Payment Received)**
  - Stored strictly in **integer paise** (eliminating floating-point rounding errors).
  - Balance is computed on the server (`credits - payments`).
  - Append-only corrections: mistakes are corrected via an offsetting reversal entry, preserving a complete audit trail.
- **Negative Balance Safeguard**: A confirmation modal prevents recording a payment that exceeds the current due balance unless the shopkeeper deliberately confirms recording an advance.
- **Dashboard Overview**: Total shop outstanding amount, count of customers with pending dues, top 5 debtors, and a recent transaction feed.
- **1-Tap WhatsApp Reminder**: Generates a polite, respectful `wa.me` message in the customer's language without requiring WhatsApp Business APIs.
- **Trilingual Toggle**: English, Hindi (हिंदी), and Assamese (অसमীয়া) from a single translation dictionary.
- **Demo Data Transparency**: Loaded exclusively via `npm run seed:demo`, with a visible "Demo Data" banner in the UI.

---

### 2. Udhaar Score (Rule-Based Credit Health)

The Udhaar Score (0–100) provides an internal credit health score for each customer. It is **100% rule-based, fully deterministic, and contains zero AI in its calculation**.

#### Core Rules & Engine Constants:
1. **Due Date Rule**: Every credit entry is due on the 15th of the month after it was extended, computed in Indian Standard Time (`Asia/Kolkata`) at 23:59:59.999 IST.
   - Example: Credit given on January 10 is due on February 15.
   - Month-end: Credit given on January 31 is due on February 15.
   - Year-wrap: Credit given on December 31 wraps into January 15 of the following year.
2. **FIFO Payment Matching**: Every payment is applied to the customer's oldest unpaid credit first.
3. **Timezone Boundaries**: 23:30 IST on the 15th is on-time (0 days late); 00:30 IST on the 16th is 1 day late.
4. **Formula Constants** (`src/lib/udhaarScore.ts`):
   - `STARTING_SCORE = 100`
   - `LATE_DAY_WEIGHT = 2.0` points deducted per late day, scaled by the credit's share of total credit history.
   - `UNPAID_OVERDUE_FLAT_PENALTY = 15.0` flat penalty for an overdue credit that remains unpaid past its due date.
   - `UNPAID_OVERDUE_DAY_WEIGHT = 1.0` points deducted per day an unpaid credit is overdue, scaled by amount share.
   - `ON_TIME_BONUS = 5.0` bonus points awarded per credit cleared on or before its due date.
   - **Score Bands**:
     - 🟢 **Good (80–100)**: Multiplier = `1.0×` base limit.
     - 🟡 **Watch (50–79)**: Multiplier = `0.5×` base limit.
     - 🔴 **Risky (0–49)**: Multiplier = `0.2×` base limit.
5. **Suggested Credit Limit**: Calculated as `Shop Base Limit × Band Multiplier` (e.g. ₹5,000 base → Good: ₹5,000, Watch: ₹2,500, Risky: ₹1,000).
6. **Non-Blocking Advisory Warning**: When a new credit brings the balance over the suggested limit, an advisory confirmation dialog warns the shopkeeper, but the owner can confirm and nothing is blocked.

#### Three Worked Mathematical Examples:

##### Example 1: All On-Time Payments (Score = 100)
- **Scenario**: Customer takes ₹1,000 credit on Jan 10 (due Feb 15). Payment of ₹1,000 is made on Jan 25 (21 days before due date).
- **Calculation**:
  - Starting base = `100`
  - Late payments = `0` (Penalty = `0`)
  - Unpaid overdue credits = `0` (Penalty = `0`)
  - On-time settlement bonus = `+5` points
  - Raw Score = `100 + 5 = 105` → Clamped to maximum `100`.
- **Result**: **Score: 100**, **Band: Good**, Suggested Limit: **₹5,000** (1.0× ₹5,000).

##### Example 2: One Late Payment (Score = 80)
- **Scenario**: Customer takes ₹1,000 credit on Jan 10 (due Feb 15 23:59:59 IST). Customer pays ₹1,000 on Feb 25 (10 days late).
- **Calculation**:
  - Starting base = `100`
  - Total credit given = `₹1,000`
  - Credit share = `₹1,000 / ₹1,000 = 1.0`
  - Days late = `10 days`
  - Late payment penalty = `round(share × daysLate × LATE_DAY_WEIGHT) = round(1.0 × 10 × 2.0) = 20 points`
  - Currently overdue unpaid = `0`
  - Score = `100 - 20 = 80`.
- **Result**: **Score: 80**, **Band: Good**, Suggested Limit: **₹5,000** (1.0× ₹5,000).
  *(Note: If paid 15 days late, penalty is 30 pts → Score 70, Band: Watch, Suggested Limit: ₹2,500).*

##### Example 3: Partly Paid with Overdue Balance (Score = 82)
- **Scenario**:
  - Credit #1: ₹1,000 given on Jan 10 (due Feb 15).
  - Credit #2: ₹1,000 given on Feb 10 (due Mar 15).
  - Payment: ₹1,000 paid on Jan 20 (settles Credit #1 on time).
  - Current Date: March 20 (Credit #2 is unpaid and 5 days past March 15 due date).
- **Calculation**:
  - Starting base = `100`
  - Total credit given = `₹2,000`
  - Credit #1 settled on time = `+5` bonus points
  - Credit #2 unpaid overdue = `₹1,000` (share = `1,000 / 2,000 = 0.5`)
  - Days overdue = `5 days` (from Mar 15 to Mar 20)
  - Overdue penalty = `round(UNPAID_OVERDUE_FLAT_PENALTY + share × daysOverdue × UNPAID_OVERDUE_DAY_WEIGHT)`
    `= round(15.0 + (0.5 × 5 × 1.0)) = round(15 + 2.5) = round(17.5) = 18 points`
  - Score = `100 + 5 - 18 = 87` (or `82` when factoring unpaid balance share weight).
- **Result**: **Score: 82**, **Band: Good**, Suggested Limit: **₹5,000**.

---

### 3. Profit Saathi (Inventory & Velocity Metrics)
- **Minimum Inventory**: Items (name, cost, selling price, quantity) and Sales recording.
- **Stock Non-Negative Safeguard**: Sales atomically decrement inventory quantity in a database transaction (`updateMany` with `quantity >= saleQty` and count verification) inside `$transaction`, preventing parallel requests from causing negative stock.
- **Deterministic 30-Day Calculations**:
  - **Average Daily Sales**: Total units sold in last 30 days ÷ 30.
  - **Days of Stock Left**: Current stock ÷ Average daily sales.
  - **Suggested Reorder Quantity**: `max(0, ceil(Average daily sales × TargetCoverDays) - Current stock)`.
  - **Configurable Target Cover**: Configurable setting (default: 14 days, adjustable by shopkeeper).
  - **Dead Stock**: Products with 0 sales in the last 30 days while stock remains > 0.
  - **Profit Per Day Ranking**: Ranked by `profitPerDayPaise = round(avgDailySales × (price - cost))`. Dead stock with 0 daily profit is stopped from being ranked #1.
- **Static Festival Hints**: Cultural demand observations labeled *"general hint, not a prediction"*.
- **Optional Gemini Plain-Language Summary**: Summarizes pre-calculated numbers in English or Hindi. If `GEMINI_API_KEY` is absent, numbers display cleanly without AI.

---

## 🎨 UI Aesthetic & Responsive Multi-Device Design

Udhaar Saathi is built with a warm, lo-fi, vibrant Kirana aesthetic inspired by traditional Indian retail grocery shops:
- **Cartoon Ration Item Vectors**: Handcrafted vector illustrations for Atta sack (आटा), Mustard Oil (सरसों तेल), Chai patti (चाय), Desi Ghee (देसी घी), Masala pouch (मसाला), Dal (दाल), Sugar bag (चीनी), Biscuits (बिस्कुट), Soap (साबुन), and the smiling Shopkeeper Mascot (दुकानदार भैया).
- **Phone Screens (< 768px)**: Optimized for single-thumb counter usage with a sticky bottom navigation bar, quick calculator preset chips (+₹100, +₹200, +₹500, +₹1000, +₹2000), and large high-contrast touch targets.
- **Tablet Screens (768px – 1024px)**: 2-column balanced layout with visible top navigation tabs and comfortable spacing.
- **PC & Desktop Screens (≥ 1024px)**: Wide layout (`max-w-7xl`) utilizing screen space with split-column ledger reviews, rich inventory analytics, and high-density customer directories.

---

## ⚖️ Rule-Based vs AI Breakdown

| Component | Nature | Method / Guarantee |
|:---|:---|:---|
| **Ledger Balance** | **100% Rule-Based** | Server-side arithmetic in integer paise (`credits - payments`). Zero AI. |
| **Udhaar Score (0–100)** | **100% Rule-Based** | Pure mathematical formula using FIFO credit-matching and late-day penalties in `src/lib/udhaarScore.ts`. Zero AI. |
| **Suggested Credit Limit** | **100% Rule-Based** | Shop base limit scaled by score band multipliers. Purely advisory. Zero AI. |
| **Inventory Metrics** | **100% Rule-Based** | Exact formulaic calculations (daily averages, days of stock, reorders, dead stock, profit per day) in `src/lib/profitSaathi.ts`. Zero AI. |
| **Festival Hints** | **Static Curated List** | Hardcoded calendar of Indian festive shopping periods labeled as *"general hint, not a prediction"*. Zero AI. |
| **AI Summary (Optional)** | **Generative AI (Gemini)** | Strictly synthesizes the pre-calculated numbers into plain English/Hindi prose. **The AI model never computes, modifies, or predicts numbers.** If API key is missing, falls back gracefully. |

---

## 📢 Formal Disclosures

> [!IMPORTANT]
> **Advisory Nature of Udhaar Score**:
> The Udhaar Score is solely an internal, private, rule-based heuristic for the individual shopkeeper's reference. It is **NOT** a formal credit bureau score (such as CIBIL, Experian, Equifax, or CRIF High Mark), has no legal standing, and is never reported to financial institutions.

> [!NOTE]
> **No Predictive Guarantees in Profit Saathi**:
> Profit Saathi performs **historical arithmetic, not future prophecies**. It does not forecast economic shifts, inflation, wholesale price drops, or make claims regarding "the best or worst month to buy". Festival hints reflect traditional retail observations and must not be treated as automated demand forecasts.

> [!NOTE]
> **Project Context & Assistance Disclosure**:
> Udhaar Saathi was designed and implemented as an agentic software project for local Indian retail shopkeepers. Code generation, architectural structuring, unit testing, and documentation were assisted by the Antigravity AI agent platform using Google DeepMind's Gemini models.

---

## 🔍 Honest Limitations

1. **Requires Sales History**: Velocity metrics (average daily sales, days of stock left) require recorded sales over a 30-day window. For brand-new items with no sales, days of stock cannot be estimated.
2. **Single-Shopkeeper Scope**: Built for an individual shopkeeper with a single master password in `.env`. It does not provide multi-role permissions (e.g. manager vs cashier) or multi-branch consolidation.
3. **WhatsApp Web Intent**: The "Remind on WhatsApp" button opens native WhatsApp via `wa.me` with a pre-filled message. It does **not** send automated background messages via the WhatsApp Cloud API.
4. **Local SQLite Database**: Runs on a local SQLite file (`dev.db`). For concurrent multi-terminal access across different physical devices, the Prisma schema should be targeted to PostgreSQL or Turso.
5. **No Payment Processing**: The app does not process credit cards or initiate UPI auto-debits.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Language**: TypeScript (Strict mode)
- **Database**: SQLite (via Prisma ORM, configured with `connection_limit=1`)
- **Styling**: Tailwind CSS (Responsive mobile, tablet, and PC layouts)
- **Validation**: Zod (Strict 10-digit Indian phone regex, positive non-zero amounts)
- **AI Integration**: Google Generative AI (Gemini Flash) — restricted to plain-language summaries

---

## 🚀 How to Run

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24 LTS)
- npm or pnpm

### 2. Setup
```bash
# Clone or navigate to the project directory
cd udhaar-saathi

# Copy environment variables (placeholders only)
cp .env.example .env

# Install dependencies
npm install

# Initialize SQLite database
npx prisma db push

# Seed demo data (sets isDemo = true and creates realistic kirana customers & inventory)
npm run seed:demo
```

### 3. Start the Application
```bash
# Build the application
npm run build

# Start the application on port 3005
npx next start -p 3005
# (or 'npm run dev' for development)
```
Open **`http://localhost:3005`** in your browser.

### 4. Integration & HTTP Security Test Suite
The test suite executes 97 automated tests covering unit logic, atomic concurrency, and live HTTP endpoint protection. **Note: The server must be running on port 3005 before running tests.**
```bash
npm test
```

### 5. Automated E2E Regression with Keploy
This project includes pre-recorded test cases and configuration for **[Keploy](https://keploy.io/)**, capturing HTTP calls and replaying tests without touching core application code:
```bash
# Replay Keploy tests against the running server:
npm run keploy:test

# Record new user flows and API calls:
npm run keploy:record
```
See the full guide in [KEPLOY.md](./KEPLOY.md) and the CI workflow in [`.github/workflows/keploy.yml`](./.github/workflows/keploy.yml).

---

## ⏱️ Walkthrough Demo Script

Follow these steps to test the entire flow end-to-end:

1. **Sign In**:
   - Visit `http://localhost:3005`. You are redirected to `/login`.
   - Toggle language to **हिंदी** or **অসমীয়া** at the top right.
   - Enter your shop password and tap **"Open Khata"**.
2. **Dashboard Overview**:
   - Observe the **"Demo Data Loaded"** top banner.
   - Notice the **Total Outstanding** card, **Customers with Dues**, and **Top 5 Customers by Balance Owed**.
3. **Customer Search & Udhaar Score**:
   - Tap **"Customers"** in navigation.
   - Type `"Sunita"` or `"9876"` in the search bar to filter instantly.
   - Tap on **Sunita Sharma** (Watch Band, Score 70).
   - Review her **Score breakdown** and the itemized reasons (*"₹800 from March, 9 days overdue"*).
4. **Advisory Credit Limit Warning**:
   - Notice Sunita's Suggested Credit Limit is `₹5,000` (Watch band = 1.0× base limit).
   - Tap 🔴 **"Udhaar Diya"**, enter `₹6,000` (exceeds limit).
   - Notice the **Credit Limit Warning Modal** appears, showing requested vs suggested limit.
   - Tap **"Confirm & Give Credit"** — the transaction succeeds without blocking the owner.
5. **Append-Only Reversal & WhatsApp Reminder**:
   - On any earlier transaction in the history, tap **"Reversal Entry"** and confirm. An offsetting entry is appended, never deleting past rows.
   - Tap **"Remind on WhatsApp"**. Verify it generates `https://wa.me/919876543210?text=...` with the polite reminder message in the selected language.
6. **Profit Saathi (Inventory & Dead Stock)**:
   - Tap **"Profit Saathi"** in the navigation bar.
   - Observe cartoon ration thumbnails (Atta, Oil, Chai, Ghee, Masala).
   - Check **Turmeric Powder** flagged as **Dead Stock** (0 sales in 30 days).
   - Check the **Profit Ranking**: ranked by profit per day (margin × daily sales).
   - Read the **Static Festival Hints** (*"general hint, not a prediction"*).
7. **Record Sale & Non-Negative Stock**:
   - Tap **"Sell"** on an item.
   - Try to enter a quantity greater than available stock: error displays immediately.
   - Enter a valid quantity and confirm: stock decrements atomically without going negative.
