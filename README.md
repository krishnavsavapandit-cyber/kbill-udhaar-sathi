# 📖 Udhaar Saathi (उधार साथी / ধাৰ সাৰথী)
> **Mobile-First Digital Khata for Local Kirana & Retail Shopkeepers in India**

Udhaar Saathi replaces the vulnerable paper credit notebook (*bahi-khata*) of Indian small shopkeepers with a focused, mobile-first web app that can be operated quickly with one thumb.

---

## 🎯 The Problem
Small neighbourhood kirana store owners, vegetable vendors, and local retail shops in India extend credit (*udhaar*) to regular customers every single day. Traditional paper credit registers suffer from critical daily issues:
- **Pages tear, smudge, or get lost**: Spills, rain, or worn-out binding destroy historical records.
- **Manual calculation mistakes**: Mental addition and subtraction errors lead to losses or disputes with customers.
- **Awkward payment collection**: Shopkeepers hesitate to verbally confront neighbours about overdue balances.
- **Overcomplicated software**: Most generic accounting apps require complex registrations, GST numbers, inventory setups, and endless nested menus.

---

## 💡 The Solution
**Udhaar Saathi** provides a stripped-down, tactile khata designed strictly for speed and simplicity:
1. **Single Shopkeeper Login**: No signup friction. Protected by a shop password configured in `.env`.
2. **Instant Customer Management**: Add, edit, and search customers by name or 10-digit Indian mobile number in real time.
3. **Append-Only Ledger**:
   - 🔴 **Udhaar Diya (+ Credit Given)**
   - 🟢 **Jama Kiya (- Payment Received)**
   - Stored in **integer paise** (eliminating floating-point errors).
   - Balance is computed on the server (`credits - payments`).
   - Append-only corrections: mistakes are corrected via an offsetting reversal entry, preserving an audit trail.
4. **Negative Balance Safeguard**: A confirmation modal prevents recording a payment that exceeds the current due balance unless the shopkeeper deliberately confirms recording an advance.
5. **Dashboard Overview**: Total shop outstanding amount, count of customers with pending dues, top 5 debtors, and a recent transaction feed.
6. **1-Tap WhatsApp Reminder**: Generates a polite, respectful `wa.me` message in the customer's language without requiring WhatsApp Business APIs.
7. **Trilingual Toggle**: English, Hindi (हिंदी), and Assamese (অসমীয়া) from a single translation dictionary.
8. **Demo Data Transparency**: Loaded exclusively via `npm run seed:demo`, with a visible "Demo Data" banner in the UI.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Language**: TypeScript (Strict mode)
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS (Mobile-first viewport, thumb-accessible layout)
- **Validation**: Zod (Strict 10-digit phone regex, positive non-zero amounts)
- **Icons**: Lucide React

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

# Seed demo data (sets isDemo = true and creates 6 realistic customers)
npm run seed:demo
```

### 3. Start the Application
```bash
# Build the application
npm run build

# Start the application
npm run start -p 3005
# (or 'npm run dev' for development)
```
Open **`http://localhost:3005`** (or port `3000` if available) on your browser or mobile phone view.

### 4. Login Credentials
- Password is set in your `.env` file under `SHOP_PASSWORD`.
- In demo/development environments, a pre-fill button is available on the login screen for testing convenience.

### 5. Integration & HTTP Security Test Suite
Run the automated test suite covering security, calculations, validations, reversal audit trails, excess-payment rules, and live HTTP endpoint rejections:
```bash
npm test
```

---

## 🔍 Honest Limitations (No Fake Claims)
- **Single-Shopkeeper Scope**: This app is architected for a single shopkeeper with one master password. It is not a multi-tenant B2B SaaS platform.
- **WhatsApp Web Intent**: The "Remind on WhatsApp" button opens native WhatsApp via `wa.me` with a pre-filled message. It does **not** send automated background messages via the WhatsApp Cloud API.
- **SQLite Local File Storage**: Data is saved to local `dev.db`. For distributed multi-device access across different physical stores, Prisma should be pointed to a cloud database (e.g. Postgres or Turso).
- **Network Dependency**: While mobile-optimized, it is a web application that relies on network access to communicate with the Next.js server actions.

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
3. **Customer Search & Add**:
   - Tap **"Customers"** on the bottom nav.
   - Type `"Sunita"` or `"9876"` in the search bar to filter instantly.
   - Clear search and tap **"+ Add Customer"**. Enter Name: `Manoj Sharma`, Phone: `9822334455`. Tap **Save**.
4. **Record Credit & Payment**:
   - Open `Manoj Sharma`'s profile.
   - Tap 🔴 **"Udhaar Diya"**, enter `₹450`, note: `Mustard Oil & Biscuits`. Tap **Save to Khata**.
   - Notice balance increases to `₹450`.
   - Tap 🟢 **"Jama Kiya"**, enter `₹500` (exceeds balance).
   - Notice the **Excess Payment Warning** confirmation modal appears! Tap **"Yes, Record Advance"**.
   - Balance updates to `-₹50` (Advance).
5. **Append-Only Reversal & WhatsApp Reminder**:
   - On any earlier transaction in the history, tap **"Reversal Entry"** and confirm. An offsetting entry is appended, never deleting past rows.
   - Go to `Sunita Sharma` (balance `₹1,450`), tap **"Remind on WhatsApp"**. Verify it generates `https://wa.me/919876543210?text=...` with the polite reminder message.
