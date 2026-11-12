-- =========================================================
-- PromptFund AI: Supabase Micro-Ledger & Clearinghouse Schema
-- =========================================================

-- 1. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    ad_headline TEXT NOT NULL,
    ad_body TEXT NOT NULL,
    cta_url TEXT NOT NULL,
    badge_label TEXT DEFAULT 'Sponsored Compute',
    micro_offer_enabled BOOLEAN DEFAULT TRUE,
    micro_offer_title TEXT DEFAULT '1-Click Developer Pro Pass',
    micro_offer_desc TEXT DEFAULT 'Get instant access to managed clusters & $50 compute credits for just $1.00',
    micro_offer_price_usd NUMERIC(10, 2) DEFAULT 1.00,
    target_intent TEXT NOT NULL,
    escrow_balance_usd NUMERIC(12, 6) NOT NULL DEFAULT 50.000000,
    total_deposited_usd NUMERIC(12, 2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GPU Nodes Table
CREATE TABLE IF NOT EXISTS gpu_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_name TEXT NOT NULL,
    node_type TEXT NOT NULL, -- 'cloud_alpha' or 'community_beta'
    endpoint_url TEXT,
    model_id TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
    operator_paypal_email TEXT NOT NULL,
    pending_payout_usd NUMERIC(12, 6) NOT NULL DEFAULT 9.450000,
    total_paid_out_usd NUMERIC(12, 2) NOT NULL DEFAULT 120.00,
    payout_threshold_usd NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    status TEXT DEFAULT 'online',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inference Ledger (High-frequency accounting & cryptographic proof)
CREATE TABLE IF NOT EXISTS inference_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID REFERENCES sponsors(id),
    gpu_node_id UUID REFERENCES gpu_nodes(id),
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    compute_cost_usd NUMERIC(12, 6) NOT NULL,
    sponsor_debited_usd NUMERIC(12, 6) NOT NULL,
    node_credited_usd NUMERIC(12, 6) NOT NULL,
    protocol_fee_usd NUMERIC(12, 6) NOT NULL,
    proof_of_inference_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PayPal Transactions Audit Log
CREATE TABLE IF NOT EXISTS paypal_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type TEXT NOT NULL, -- 'SPONSOR_DEPOSIT' | 'NODE_PAYOUT' | 'AGENTIC_BUY'
    paypal_reference_id TEXT NOT NULL, -- Order ID or Payout Batch ID
    amount_usd NUMERIC(10, 2) NOT NULL,
    recipient_email TEXT,
    status TEXT NOT NULL,
    proof_hash TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Demo Data
INSERT INTO sponsors (company_name, ad_headline, ad_body, cta_url, badge_label, micro_offer_enabled, micro_offer_title, micro_offer_desc, target_intent, escrow_balance_usd, total_deposited_usd)
VALUES 
(
    'Neon Postgres',
    'Serverless Postgres Built for High-Load AI Applications',
    'Branch your database like code with sub-second scale to zero and connection pooling built in.',
    'https://neon.tech',
    'Featured Infrastructure Partner',
    TRUE,
    'Spin up dedicated Postgres + $50 Credits for $1.00',
    'One-click sandbox deployment with zero connection limits.',
    'database, sql, postgres, backend, scaling, prisma, query, indexing, storage',
    48.250000,
    50.00
),
(
    'Vercel Fluid Compute',
    'Deploy Next.js & Serverless AI Agents with Instant Concurrency',
    'Zero-configuration global edge networks with streaming AI SDK native integration.',
    'https://vercel.com',
    'Compute Infrastructure Partner',
    TRUE,
    'Vercel Pro Developer Sandbox Pass for $1.00',
    'Deploy unlimited edge functions and unlock enhanced streaming limits.',
    'deploy, nextjs, vercel, frontend, serverless, web, react, hosting, docker, k8s, kubernetes',
    34.800000,
    35.00
);

INSERT INTO gpu_nodes (node_name, node_type, endpoint_url, model_id, operator_paypal_email, pending_payout_usd, total_paid_out_usd, payout_threshold_usd, status)
VALUES
(
    'Cluster Alpha (High-Throughput Cloud)',
    'cloud_alpha',
    'https://api.groq.com/openai/v1',
    'llama-3.3-70b-versatile',
    'cloud-operator@sandbox.paypal.com',
    9.852000,
    240.00,
    10.00,
    'online'
),
(
    'Cluster Beta (Community Local Node)',
    'community_beta',
    'http://localhost:11434/v1',
    'llama3:8b',
    'community-node-miner@sandbox.paypal.com',
    6.120000,
    45.00,
    10.00,
    'online'
);
