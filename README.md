# 📖 Udhaar Saathi (उधार साथी / ধাৰ সাৰথী)
> **Mobile-First Digital Khata & Profit Assistant for Local Kirana & Retail Shopkeepers in India**

Udhaar Saathi replaces the vulnerable paper credit notebook (*bahi-khata*) of Indian small shopkeepers with a focused, mobile-first web app that can be operated quickly with one thumb.

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
  - Stored in **integer paise** (eliminating floating-point errors).
  - Balance is computed on the server (`credits - payments`).
  - Append-only corrections: mistakes are corrected via an offsetting reversal entry, preserving an audit trail.
- **Negative Balance Safeguard**: A confirmation modal prevents recording a payment that exceeds the current due balance unless the shopkeeper deliberately confirms recording an advance.
- **Dashboard Overview**: Total shop outstanding amount, count of customers with pending dues, top 5 debtors, and a recent transaction feed.
- **1-Tap WhatsApp Reminder**: Generates a polite, respectful `wa.me` message in the customer's language without requiring WhatsApp Business APIs.
- **Trilingual Toggle**: English, Hindi (हिंदी), and Assamese (অসমীয়া) from a single translation dictionary.
- **Demo Data Transparency**: Loaded exclusively via `npm run seed:demo`, with a visible "Demo Data" banner in the UI.

### 2. Udhaar Score (Rule-Based Credit Health)
- **Deterministic 0–100 Score**: Computed dynamically on the server from raw ledger entries.
- **FIFO Payment Matching**: Payments are applied to the oldest unpaid credit first.
- **Due Date Rule**: Every credit is due on the 15th of the month following the credit date.
- **Score Bands**:
  - 🟢 **Good (80–100)**: Clean repayment track record.
  - 🟡 **Watch (50–79)**: Minor delays or pending dues.
  - 🔴 **Risky (0–49)**: Significantly overdue credits.
- **Transparent Reasons**: Displays itemized reasons (e.g. *"₹800 from March, 9 days overdue; 2 late payments"*).
- **Suggested Credit Limit**: Calculated as `Shop Base Limit × Band Multiplier` (Good: 1.5×, Watch: 1.0×, Risky: 0.5×).
- **Non-Blocking Advisory**: When a new credit exceeds the suggested limit, a warning modal asks for confirmation; the owner can always override and nothing is blocked.
- **Shop Privacy**: Scores are completely private to the shop and never pooled or shared.

### 3. Profit Saathi (Stock & Sales Calculations)
- **Minimum Inventory**: Items (name, cost, selling price, stock quantity) and Sales recording.
- **Stock Non-Negative Safeguard**: Sales atomically decrement inventory quantity in a database transaction and fail if quantity is insufficient, preventing negative stock.
- **Deterministic 30-Day Calculations**:
  - **Average Daily Sales**: Total units sold in last 30 days ÷ 30.
  - **Days of Stock Left**: Current stock ÷ Average daily sales.
  - **Suggested Reorder Quantity**: `max(0, ceil(Average daily sales × 14) - Current stock)` (14-day stock buffer).
  - **Dead Stock**: Products with 0 sales in the last 30 days while stock remains > 0.
  - **Margin Ranking**: Ranked by profit margin percentage `((price - cost) / price) × 100`.
- **Static Festival Hints**: Cultural demand patterns labeled *"general hint, not a prediction"*.
- **Optional Gemini Plain-Language Summary**: Translates computed metrics into a simple 2–3 sentence briefing in English or Hindi. If `GEMINI_API_KEY` is absent, numbers display cleanly without AI.

---

## ⚖️ Rule-Based vs AI Breakdown

| Component | Nature | Method / Guarantee |
|:---|:---|:---|
| **Ledger Balance** | **100% Rule-Based** | Server-side arithmetic in integer paise (`credits - payments`). Zero AI. |
| **Udhaar Score (0–100)** | **100% Rule-Based** | Pure mathematical formula using FIFO credit-matching and late-day penalties in `src/lib/udhaarScore.ts`. Zero AI. |
| **Suggested Credit Limit** | **100% Rule-Based** | Shop base limit scaled by score band multipliers. Purely advisory. Zero AI. |
| **Inventory Metrics** | **100% Rule-Based** | Exact formulaic calculations (daily averages, days of stock, reorders, dead stock, margins) in `src/lib/profitSaathi.ts`. Zero AI. |
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

---

## 🔍 Honest Limitations (No Fake Claims)

1. **Requires Sales History**: Velocity metrics (average daily sales, days of stock left) require recorded sales over a 30-day window. For brand-new items with no sales, days of stock cannot be estimated.
2. **Single-Shopkeeper Scope**: Built for an individual shopkeeper with a single master password. It does not provide multi-role permissions (e.g. manager vs cashier) or multi-branch consolidation.
3. **WhatsApp Web Intent**: The "Remind on WhatsApp" button opens native WhatsApp via `wa.me` with a pre-filled message. It does **not** send automated background messages via the WhatsApp Cloud API.
4. **Local SQLite Database**: Runs on a local SQLite file (`dev.db`). For concurrent multi-terminal access across different physical devices, the Prisma schema should be targeted to PostgreSQL or Turso.
5. **No Offline Sync**: While mobile-optimized, it requires active network access to communicate with the Next.js backend server actions.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Language**: TypeScript (Strict mode)
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS (Mobile-first viewport, thumb-accessible layout)
- **Validation**: Zod (Strict 10-digit phone regex, positive non-zero amounts)
- **AI Integration**: Google Generative AI (Gemini Flash) — restricted to plain-language summaries

---

## 🚀 Quickstart & How to Run

### 1. Prerequisites
- Node.js 18+ (tested on Node v24 LTS)
- npm or pnpm

### 2. Setup
```bash
# Clone or navigate to the project directory
cd udhaar-saathi

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Initialize SQLite database
npx prisma db push

# Seed demo data (sets isDemo = true and creates 6 realistic customers + 5 inventory items)
npm run seed:demo
```

### 3. Start the Application
```bash
# Build the application
npm run build

# Start the application on port 3005
npm run start -p 3005
# (or 'npm run dev' for development)
```
Open **`http://localhost:3005`** on your browser or mobile phone view.

### 4. Integration & HTTP Security Test Suite
Run the automated test suite covering security, calculations, validations, reversal audit trails, excess-payment rules, Udhaar score exact math, Profit Saathi calculations, non-negative stock enforcement, and live HTTP endpoint rejections:
```bash
npm test
```

---

## ⏱️ Walkthrough Demo Script

Follow these steps to test the entire flow end-to-end:

1. **Sign In**:
   - Visit `http://localhost:3005`. You are redirected to `/login`.
   - Toggle language to **हिंदी** or **অসমীয়া** at the top right.
   - Enter your shop password and tap **"Open Khata"**.
2. **Dashboard Overview**:
   - Observe the **"Demo Data Loaded"** top banner.
   - Notice the **Total Udhaar (Outstanding)** card (`₹6,120`), **Customers with Dues** (`4`), and **Top Customers by Balance Owed**.
3. **Customer Search & Udhaar Score**:
   - Tap **"Customers"** on the bottom nav.
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
   - Tap **"Profit Saathi"** in the bottom navigation.
   - Observe the **Fast Movers vs Dead Stock** indicators.
   - Check **Turmeric Powder** flagged as **Dead Stock** (0 sales in 30 days).
   - Notice **Tata Tea Gold** showing **2.0 days of stock left** and suggesting **24 units reorder**.
   - Check the **Margin Ranking**: Spices ranked #1 (33.3% margin).
   - Read the **Static Festival Hints** (*"general hint, not a prediction"*).
   - If `GEMINI_API_KEY` is provided in `.env`, review the **AI Morning Briefing** summarizing the numbers in English or Hindi.
7. **Record Sale & Non-Negative Stock**:
   - Tap **"Record Sale"**, pick `Tata Tea Gold (250g)` (Stock: 4).
   - Try to enter quantity `10`. Notice the error: cannot sell more than available stock.
   - Enter quantity `2` and tap **Save Sale**. Stock reduces from 4 to 2 immediately.
