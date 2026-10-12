# PropManage 🏢

> **Enterprise Property Management & Automated Digital Rent Collection Platform**  
> Designed for modern landlords, real estate agencies, and property managers in the Horn of Africa and emerging markets.

[![Live Demo](https://img.shields.io/badge/Live_Demo-digital--rental--collection.vercel.app-0066cc?style=for-the-badge&logo=vercel&logoColor=white)](https://digital-rental-collection.vercel.app/)

🔗 **Live Deployment:** [https://digital-rental-collection.vercel.app/](https://digital-rental-collection.vercel.app/)

---

## 🌟 Overview

**PropManage** is a modern, high-performance web platform built with **Next.js 16 (App Router)**, **Turbopack**, and **Supabase (PostgreSQL)**. It streamlines multi-tenant property management, lease agreements, tenant onboarding, automated recurring billing, operating expense tracking, and instant mobile-money reconciliation (**Telesom ZAAD & Somtel eDahab**).

### ✨ Key Features

- 🏢 **Multi-Tenant Property Management:** Manage unlimited properties, buildings, complexes, and rental units with dynamic occupancy tracking (`VACANT` vs `OCCUPIED`).
- 🔒 **Atomic Concurrency Protection:** Built-in SQL status locking prevents double-booking race conditions when multiple leasing agents submit simultaneous contracts.
- 📱 **Mobile Money Automation (ZAAD & eDahab):** Automated webhook listeners ingest mobile money payments, verify telecom cryptographic signatures, match tenant phone numbers, and reconcile invoices in real time.
- 💵 **Partial & Cash Payment Tracking:** Support for manual cash collections, bank transfers, and partial invoice settlements with live audit trails.
- 🧾 **Digital Tenant Portal & Receipts:** Shareable magic-link tenant portal (`/portal/[tenantId]`) allowing tenants to view balances, past invoices, and print receipts (`/receipt/[invoiceId]`).
- 🤖 **Automated Cron Invoicing:** Automated background triggers generate monthly billing across active leases and flag past-due invoices as overdue.
- 🌐 **Bilingual Interface:** Seamless runtime toggle between **Somali (`so`)** and **English (`en`)**.
- 💡 **Integrated AI Assistant:** In-app walkthrough guide to assist managers in operating all platform workflows.
- 📲 **Progressive Web App (PWA):** Installable on Android and iOS devices with offline caching and service worker support.

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js 16 (App Router)               │
│               Turbopack • React 19 • Tailwind CSS v4        │
├──────────────────────────────┬──────────────────────────────┤
│        Frontend Views        │        Backend & APIs        │
│ • /login (Auth & Onboard)    │ • src/proxy.ts (Proxy)       │
│ • /dashboard (8 Tab Modules) │ • /api/webhooks/payments     │
│ • /portal/[tenantId]         │ • /api/cron                  │
│ • /portal/.../receipt/...    │ • /api/ping (Keep-alive)     │
│ • PWA (Service Worker)       │ • Server Actions             │
├──────────────────────────────┴──────────────────────────────┤
│                      Service Domain Layer                   │
│   LeaseService • PaymentService • InvoiceService • Property │
├─────────────────────────────────────────────────────────────┤
│                    Supabase PostgreSQL                      │
│   Multi-tenant RLS • RPC Stored Procedures • Audit Triggers │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend Framework:** Next.js `16.2.6` (App Router) with React `19.2.4`
- **Request Proxy:** `src/proxy.ts` (Next.js 16 request pipeline convention)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons:** Lucide React
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Testing:** Playwright E2E Test Suite (`@playwright/test`)

---

## 🗄️ Database Architecture (`schema.sql`)

PropManage employs an organization-based multi-tenant database design:

| Table | Purpose | Security & Constraints |
| :--- | :--- | :--- |
| `organizations` | Top-level business entity accounts | Tenant root with currency definitions |
| `landlords` | Manager profiles linked to Supabase Auth | Scoped to `auth.uid()` |
| `properties` | Real estate buildings and complexes | RLS scoped via `organization_id` |
| `units` | Rental rooms and apartments | Status constraint (`VACANT`, `OCCUPIED`) |
| `tenants` | Customer registry and emergency contacts | Unique per organization, normalized phone |
| `leases` | Active and terminated tenancy agreements | Unit status binding with atomic concurrency lock |
| `invoices` | Monthly rent billing snapshots | States (`PENDING`, `PAID`, `OVERDUE`) |
| `payments` | Revenue transactions and telecom receipts | Idempotent provider transaction key |
| `expenses` | Operational expenses and property upkeep | Categorized ledger with net profit deduction |
| `audit_logs` | Regulatory SaaS audit log | Database trigger tracking `old_values` & `new_values` |

### Database Procedures (RPCs)
- **`process_payment`:** Atomically creates a payment record and updates the corresponding invoice status to `PAID`.
- **`generate_all_monthly_invoices`:** Iterates through all active leases on the 1st of each month to generate billing snapshots.
- **`generate_monthly_invoices(p_org_id)`:** On-demand invoice generator for a specific organization.
- **`update_overdue_invoices`:** Daily sweep that marks pending invoices past their due date as `OVERDUE`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/usaamakhadar/digital-rental-collection.git
cd digital-rental-collection
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Copy the entire contents of [`schema.sql`](./schema.sql) and execute the query.
3. This creates all tables, indexes, triggers, stored procedures, and RLS policies.

### 4. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Fill in your project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
TELECOM_WEBHOOK_SECRET=your-telecom-webhook-secret-key
CRON_SECRET=your-cron-secret-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

> 🚀 **Live Demo:** You can explore the live deployed platform at [https://digital-rental-collection.vercel.app/](https://digital-rental-collection.vercel.app/).

---

## 🧪 Testing & Validation

The project includes an end-to-end test suite using Playwright covering authentication, property CRUD, atomic double-booking prevention, manual payment settlement, offline resilience, and tenant lifecycle.

```bash
# Run all E2E tests
npm test

# Run tests with interactive UI
npm run test:ui

# Run TypeScript typecheck
npm run typecheck

# Run production build
npm run build
```

---

## 🔒 Security & Privacy

- **Row Level Security (RLS):** Every query is filtered by the user's organization. Landlords can never access another organization's properties, tenants, or revenue data.
- **No Client Secrets:** `SUPABASE_SERVICE_ROLE_KEY` is strictly used in Server Actions, route handlers, and proxy endpoints. It is never bundled into client-side code.
- **Idempotency Protection:** Payment webhooks verify unique `provider_transaction_id` entries to guarantee zero duplicate payment charges.

---

## 👨‍💻 Author

**Usama Khadar Hersi**  
- GitHub: [@usaamakhadar](https://github.com/usaamakhadar)  
- Email: usamakhadarhersi@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
