import { createClient } from '@supabase/supabase-js';
import { Sponsor, GpuNode, InferenceLedgerEntry, PayPalSettlement, TelemetryState } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp_neon',
    company_name: 'Neon Postgres',
    ad_headline: 'Serverless Postgres built for high-load AI apps. Branch your DB like code with sub-second scale to zero.',
    cta_url: 'https://neon.tech',
    target_intent: 'database, sql, postgres, backend, scaling, prisma, query, indexing, storage, neon, tables, jsonb',
    escrow_balance_usd: 24.9920,
    total_deposited_usd: 25.00,
  },
  {
    id: 'sp_vercel',
    company_name: 'Vercel Fluid Compute',
    ad_headline: 'Deploy Next.js & Serverless AI Agents with instant global edge concurrency and streaming SDK integration.',
    cta_url: 'https://vercel.com',
    target_intent: 'deploy, nextjs, vercel, frontend, serverless, web, react, hosting, docker, k8s, kubernetes, edge',
    escrow_balance_usd: 25.0000,
    total_deposited_usd: 25.00,
  },
  {
    id: 'sp_raygun',
    company_name: 'Raygun APM',
    ad_headline: 'Real-time crash reporting and token latency observability built for production LLM microservices.',
    cta_url: 'https://raygun.com',
    target_intent: 'monitoring, tracing, logs, apm, telemetry, raygun, latency, errors, profiling, observability',
    escrow_balance_usd: 18.5000,
    total_deposited_usd: 20.00,
  },
];

const INITIAL_NODE: GpuNode = {
  id: 'node_primary',
  node_name: 'Primary Compute Node (H100 Cluster)',
  model_id: 'llama-3.3-70b-versatile',
  operator_paypal_email: process.env.PAYPAL_BUSINESS_EMAIL || 'sb-smwfk53876648@business.example.com',
  pending_payout_usd: 12.4500,
  total_paid_out_usd: 80.00,
  payout_threshold_usd: 10.00,
  status: 'online',
};

interface GlobalStore {
  sponsors: Sponsor[];
  node: GpuNode;
  promptCounter: number;
  recentLedger: InferenceLedgerEntry[];
  settlementLog: PayPalSettlement[];
}

declare global {
  // eslint-disable-next-line no-var
  var __PROMPT_FUND_STORE__: GlobalStore | undefined;
}

if (!globalThis.__PROMPT_FUND_STORE__) {
  globalThis.__PROMPT_FUND_STORE__ = {
    sponsors: INITIAL_SPONSORS,
    node: INITIAL_NODE,
    promptCounter: 843,
    recentLedger: [
      {
        id: 'led_842',
        prompt_id: '#842',
        timestamp: '1 min ago',
        model_id: 'Llama 3.3 70B',
        tokens: 580,
        sponsor_name: 'Neon Postgres',
        compute_cost_usd: 0.0042,
        node_credit_usd: 0.0038,
      },
      {
        id: 'led_841',
        prompt_id: '#841',
        timestamp: '3 mins ago',
        model_id: 'Llama 3.3 70B',
        tokens: 420,
        sponsor_name: 'Vercel Fluid',
        compute_cost_usd: 0.0031,
        node_credit_usd: 0.0028,
      },
      {
        id: 'led_840',
        prompt_id: '#840',
        timestamp: '5 mins ago',
        model_id: 'DeepSeek R1',
        tokens: 690,
        sponsor_name: 'Neon Postgres',
        compute_cost_usd: 0.0050,
        node_credit_usd: 0.0045,
      },
    ],
    settlementLog: [
      {
        id: 'set_902',
        batch_id: 'PAYPAL-BATCH-902',
        amount_usd: 10.00,
        recipient_email: 'gpu-provider@sandbox.paypal.com',
        status: 'SUCCESS',
        timestamp: '25 mins ago',
        simulated: true,
      },
    ],
  };
}

export const inMemoryStore = globalThis.__PROMPT_FUND_STORE__!;

export async function getTelemetryState(): Promise<TelemetryState> {
  const escrowPoolTotal = inMemoryStore.sponsors.reduce((sum, s) => sum + s.escrow_balance_usd, 0);

  return {
    sponsors: inMemoryStore.sponsors,
    node: inMemoryStore.node,
    escrowPoolTotal: Number(escrowPoolTotal.toFixed(4)),
    pendingNodeEarnings: Number(inMemoryStore.node.pending_payout_usd.toFixed(4)),
    recentLedger: inMemoryStore.recentLedger,
    settlementLog: inMemoryStore.settlementLog,
  };
}

export async function executeInferenceAccounting(params: {
  sponsorId: string;
  modelId: string;
  tokens: number;
  costUsd: number;
}): Promise<InferenceLedgerEntry> {
  const sponsor = inMemoryStore.sponsors.find((s) => s.id === params.sponsorId) || inMemoryStore.sponsors[0];
  const node = inMemoryStore.node;

  const nodeShare = Number((params.costUsd * 0.90).toFixed(6));

  // Deduct sponsor escrow, increment node pending
  sponsor.escrow_balance_usd = Math.max(0, Number((sponsor.escrow_balance_usd - params.costUsd).toFixed(6)));
  node.pending_payout_usd = Number((node.pending_payout_usd + nodeShare).toFixed(6));

  inMemoryStore.promptCounter += 1;
  const promptId = `#${inMemoryStore.promptCounter}`;

  const entry: InferenceLedgerEntry = {
    id: `led_${Date.now()}`,
    prompt_id: promptId,
    timestamp: 'Just now',
    model_id: params.modelId,
    tokens: params.tokens,
    sponsor_name: sponsor.company_name,
    compute_cost_usd: params.costUsd,
    node_credit_usd: nodeShare,
  };

  inMemoryStore.recentLedger.unshift(entry);
  if (inMemoryStore.recentLedger.length > 25) inMemoryStore.recentLedger.pop();

  return entry;
}
