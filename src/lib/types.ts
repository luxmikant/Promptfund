export interface Sponsor {
  id: string;
  company_name: string;
  ad_headline: string;
  cta_url: string;
  target_intent: string;
  escrow_balance_usd: number;
  total_deposited_usd: number;
}

export interface GpuNode {
  id: string;
  node_name: string;
  model_id: string;
  operator_paypal_email: string;
  pending_payout_usd: number;
  total_paid_out_usd: number;
  payout_threshold_usd: number;
  status: 'online' | 'busy' | 'offline';
}

export interface InferenceLedgerEntry {
  id: string;
  prompt_id: string;
  timestamp: string;
  model_id: string;
  tokens: number;
  sponsor_name: string;
  compute_cost_usd: number;
  node_credit_usd: number;
}

export interface PayPalSettlement {
  id: string;
  batch_id: string;
  amount_usd: number;
  recipient_email: string;
  status: string;
  timestamp: string;
  simulated?: boolean;
}

export interface SponsorReceipt {
  sponsorName: string;
  adHeadline: string;
  ctaUrl: string;
  tokens: number;
  computeCostUsd: number;
  modelId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
  computeCostUsd?: number;
  modelId?: string;
  sponsorReceipt?: SponsorReceipt;
  timestamp: number;
}

export interface TelemetryState {
  sponsors: Sponsor[];
  node: GpuNode;
  escrowPoolTotal: number;
  pendingNodeEarnings: number;
  recentLedger: InferenceLedgerEntry[];
  settlementLog: PayPalSettlement[];
}
