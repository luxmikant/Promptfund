# PromptFund AI ⚡

> **Autonomous Ad-Funded Open Compute Clearinghouse Powered by PayPal**  
> *Submitted to the PayPal AI Hackathon: Build What's Next with PayPal and AI*

[![PayPal Developer Platform](https://img.shields.io/badge/PayPal-Sandbox%20Live-005EA6?logo=paypal&logoColor=white)](https://developer.paypal.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?logo=next.js)](https://nextjs.org)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-0D7A5F.svg)](LICENSE)

---

## 💡 The 30-Second Summary

Running 70B+ open models (Llama 3.3 70B, DeepSeek R1) costs a fortune in GPU compute. Developers face \$20/month subscription paywalls, while charging \$0.004 per prompt over credit cards is impossible due to fixed transaction fees (30¢ + 2.9%).

**PromptFund AI** solves this with an **autonomous 3-sided compute clearinghouse**:
1. **Sponsors** fund compute pools via **PayPal Orders v2 API** targeting high-intent developer keywords.
2. **Developers** prompt 70B+ models for free and receive clean, verified **Compute Invoices** covered by sponsors.
3. **GPU Nodes** earn automated hardware disbursements via **PayPal Payouts v1 API** once pending earnings cross threshold.

```
                  ┌───────────────────────────────┐
                  │      INFRASTRUCTURE SPONSOR   │
                  │   (Neon, Vercel, Raygun APM)  │
                  └───────────────┬───────────────┘
                                  │ Funds Compute Pool ($25+)
                                  │ PayPal Orders v2 API
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│              PROMPTFUND COMPUTE CLEARINGHOUSE                    │
│   • Off-Chain Sub-Cent Token Ledger ($0.0008 / 1k tokens)        │
│   • Parallel Zero-Latency Semantic Ad Matcher                    │
└─────────────────┬───────────────────────────────┬────────────────┘
                  │ Contextual Compute            │ Automated Payouts ($10+)
                  │ Invoice ($0.004)              │ PayPal Payouts v1 API
                  ▼                               ▼
   ┌──────────────────────────────┐ ┌──────────────────────────────┐
   │         DEVELOPER            │ │       GPU COMPUTE NODE       │
   │  Free 70B+ Model Inference   │ │  H100 & Decentralized Nodes  │
   └──────────────────────────────┘ └──────────────────────────────┘
```

---

## 🚀 Live Product Overview

* **Product Landing Page:** High-contrast editorial overview of the circular compute economy.
* **Persistent 2-Column Workbench:** Left 60% AI workspace with model switcher; Right 40% real-time financial clearinghouse.
* **Embedded Model Selector:** Instant switching between **Llama 3.3 70B**, **DeepSeek R1**, and **Mixtral 8x7B**.
* **Zero Component Overlap:** 100% responsive layout with dedicated mobile workbench tabs.

---

## 🛠️ PayPal Developer Platform Integration

| PayPal Rail | API Used | Purpose in PromptFund AI |
| :--- | :--- | :--- |
| **Inbound Liquidity** | `POST /v2/checkout/orders` | Sponsors deposit \$25, \$50, or \$100 into the compute pool. |
| **Outbound Settlement** | `POST /v1/payments/payouts` | Disburses accumulated node earnings directly to the GPU operator's PayPal business account with verifiable batch tracking. |
| **Off-Chain Ledger** | Next.js Serverless + Supabase | Handles sub-cent token debits without transaction fee erosion. |

---

## ⚡ Quick Start (Under 1 Minute)

```bash
# 1. Clone the repository
git clone https://github.com/luxmikant/Promptfund.git
cd Promptfund

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📂 Architecture & File Map

```
Promptfund/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts              # Parallel semantic matcher & token stream
│   │   │   ├── payouts/route.ts           # PayPal Payouts v1 batch settlement
│   │   │   ├── sponsor/create-order/      # PayPal Orders v2 order creation
│   │   │   ├── sponsor/capture-order/     # PayPal Orders v2 capture & escrow credit
│   │   │   └── telemetry/route.ts         # Real-time clearinghouse state
│   │   ├── globals.css                    # Swiss Editorial & Fintech Daylight theme
│   │   ├── layout.tsx                     # Root layout with Inter & JetBrains Mono
│   │   └── page.tsx                       # Responsive workbench & landing coordinator
│   ├── components/
│   │   ├── LandingPage.tsx                # Product landing page & architecture diagram
│   │   ├── HeaderBar.tsx                  # 56px minimalist top bar & view switcher
│   │   ├── ChatWorkspace.tsx              # Model selector card & verified invoice receipts
│   │   └── ClearinghouseDashboard.tsx     # Persistent 2-column PayPal ledger dashboard
│   └── lib/
│       ├── ad-matcher.ts                  # Semantic intent matching engine
│       ├── paypal.ts                      # PayPal REST API SDK client
│       ├── store.ts                       # Ledger state with in-memory fallback
│       └── types.ts                       # TypeScript data contracts
├── supabase/
│   └── migrations/001_initial_schema.sql  # Supabase PostgreSQL ledger schema
├── vercel.json                            # Vercel serverless configuration
├── LICENSE                                # MIT Open Source License
└── README.md                              # This specification document
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — built for the PayPal AI Hackathon 2026.
