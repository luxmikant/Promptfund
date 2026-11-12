'use client';

import React, { useState } from 'react';
import { TelemetryState } from '@/lib/types';
import { Check, ArrowDownLeft, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface ClearinghouseDashboardProps {
  telemetry: TelemetryState | null;
  onRefresh: () => void;
}

export function ClearinghouseDashboard({ telemetry, onRefresh }: ClearinghouseDashboardProps) {
  const [isFunding, setIsFunding] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const escrowTotal = telemetry?.escrowPoolTotal ?? 68.4920;
  const pendingEarnings = telemetry?.pendingNodeEarnings ?? 12.4500;
  const sponsors = telemetry?.sponsors ?? [];
  const recentLedger = telemetry?.recentLedger ?? [];
  const settlementLog = telemetry?.settlementLog ?? [];

  // Inline Deposit $25 via PayPal Orders v2
  const handleFundPool = async () => {
    setIsFunding(true);
    setToastMessage(null);
    try {
      const createRes = await fetch('/api/sponsor/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: 25.0 }),
      });
      const orderData = await createRes.json();

      const captureRes = await fetch('/api/sponsor/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.orderId, amountUsd: 25.0 }),
      });
      const captureData = await captureRes.json();

      if (captureData.success) {
        setToastMessage(`✓ Deposited $25.00 via PayPal Orders v2 (${orderData.orderId})`);
        onRefresh();
      }
    } catch (e) {
      console.error('Fund pool error:', e);
    } finally {
      setIsFunding(false);
    }
  };

  // Inline Settle Node via PayPal Payouts v1
  const handleSettlePayouts = async () => {
    setIsSettling(true);
    setToastMessage(null);
    try {
      const res = await fetch('/api/payouts', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.settlement) {
        setToastMessage(`✓ Sent $${data.settlement.amount_usd.toFixed(2)} to ${data.settlement.recipient_email} (${data.settlement.batch_id})`);
        onRefresh();
      }
    } catch (e) {
      console.error('Payouts error:', e);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] overflow-y-auto">
      
      {/* Dashboard Section Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#E6E6E1] bg-[#FBFBF9] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111110]">
            Compute Clearinghouse
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#005EA6]/10 text-[#005EA6] border border-[#005EA6]/20 font-semibold">
            PayPal Developer Platform
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="text-[#686763] hover:text-[#111110] transition p-1 rounded"
          title="Refresh ledger state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        
        {/* Notification Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded bg-[#E7F6F1] border border-[#0D7A5F]/30 text-[#0D7A5F] text-xs font-mono flex items-center justify-between animate-fade-in">
            <span className="truncate mr-2 font-medium">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-[#0D7A5F] hover:opacity-75 shrink-0 text-sm">
              ×
            </button>
          </div>
        )}

        {/* 1. Top Metrics: Sponsor Pool & Pending Node Earnings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Sponsor Liquidity Pool Card */}
          <div className="p-4 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-2">
            <div className="flex items-center justify-between text-[#686763] text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold text-[#111110]">
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#005EA6]" /> Ad Pool
              </span>
              <span className="text-[10px] font-mono text-[#005EA6] bg-[#005EA6]/10 px-1.5 py-0.5 rounded font-semibold">
                Orders v2
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-[#111110] tabular-nums tracking-tight">
              ${escrowTotal.toFixed(4)}
            </div>

            <button
              onClick={handleFundPool}
              disabled={isFunding}
              className="w-full py-2 px-3 rounded bg-[#005EA6] hover:bg-[#004d88] text-white font-medium text-xs transition disabled:opacity-50 font-sans shadow-xs flex items-center justify-center gap-1"
            >
              {isFunding ? 'Connecting to PayPal...' : '+ Fund Pool ($25.00)'}
            </button>
          </div>

          {/* Pending Node Earnings Card */}
          <div className="p-4 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-2">
            <div className="flex items-center justify-between text-[#686763] text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold text-[#111110]">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0D7A5F]" /> Node Payouts
              </span>
              <span className="text-[10px] font-mono text-[#0D7A5F] bg-[#0D7A5F]/10 px-1.5 py-0.5 rounded font-semibold">
                Payouts v1
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-[#0D7A5F] tabular-nums tracking-tight">
              ${pendingEarnings.toFixed(4)}
            </div>

            <button
              onClick={handleSettlePayouts}
              disabled={isSettling}
              className="w-full py-2 px-3 rounded bg-[#111110] hover:bg-[#2B2B28] text-white font-medium text-xs transition disabled:opacity-50 font-sans shadow-xs flex items-center justify-center gap-1"
            >
              {isSettling ? 'Calling Payouts API...' : 'Settle via PayPal Payouts'}
            </button>
          </div>

        </div>

        {/* 2. Active Sponsor Campaigns */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#686763] border-b border-[#E6E6E1] pb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#111110]">Active Sponsor Campaigns</span>
            <span>Budget Remaining</span>
          </div>

          <div className="space-y-2 text-xs">
            {sponsors.map((sponsor) => {
              const maxBudget = sponsor.total_deposited_usd || 25.0;
              const percent = Math.min(100, Math.round((sponsor.escrow_balance_usd / maxBudget) * 100));

              return (
                <div key={sponsor.id} className="p-3 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#111110] flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#005EA6] shrink-0" />
                      <span className="truncate">{sponsor.company_name}</span>
                    </span>
                    <span className="font-mono tabular-nums text-[#111110] shrink-0 ml-2 font-semibold">
                      ${sponsor.escrow_balance_usd.toFixed(2)} left
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#E6E6E1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005EA6] transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="text-[10px] font-mono text-[#686763] truncate">
                    Target intents: {sponsor.target_intent.split(',').slice(0, 4).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Live Inference Ledger Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#686763] border-b border-[#E6E6E1] pb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#111110]">Live Inference Ledger</span>
            <span>Off-Chain Debits</span>
          </div>

          <div className="border border-[#E6E6E1] rounded overflow-x-auto bg-white">
            <table className="w-full text-left text-xs font-mono min-w-[300px]">
              <thead className="bg-[#F4F4F0] text-[#686763] text-[10px] border-b border-[#E6E6E1]">
                <tr>
                  <th className="py-2 px-2.5">Prompt ID</th>
                  <th className="py-2 px-2.5">Model</th>
                  <th className="py-2 px-2.5">Sponsor</th>
                  <th className="py-2 px-2.5 text-right">Cost (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E1] bg-white text-[11px] tabular-nums">
                {recentLedger.slice(0, 6).map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#FBFBF9] transition-colors">
                    <td className="py-2 px-2.5 text-[#111110] font-semibold">{entry.prompt_id}</td>
                    <td className="py-2 px-2.5 text-[#686763] truncate max-w-[80px]">{entry.model_id}</td>
                    <td className="py-2 px-2.5 text-[#005EA6] truncate max-w-[80px] font-medium">{entry.sponsor_name}</td>
                    <td className="py-2 px-2.5 text-right text-[#111110] font-semibold">
                      -${entry.compute_cost_usd.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PayPal Settlement Log */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#686763] border-b border-[#E6E6E1] pb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#111110]">PayPal Settlement Log</span>
            <span>Payouts v1 API</span>
          </div>

          <div className="space-y-1.5">
            {settlementLog.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded bg-[#FBFBF9] border border-[#E6E6E1] text-[11px] font-mono flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-[#0D7A5F] truncate mr-2 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{log.batch_id} (${log.amount_usd.toFixed(2)} USD)</span>
                </div>
                <span className="text-[#686763] text-[10px] shrink-0 font-medium">
                  {log.status} • {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Note Footer */}
        <div className="p-3 rounded bg-[#F4F4F0] border border-[#E6E6E1] text-[10px] text-[#686763] font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#005EA6] shrink-0" />
          <span>Macro-funding via PayPal Orders v2 • Micro-settlement via PayPal Payouts v1</span>
        </div>

      </div>

    </div>
  );
}
