'use client';

import React from 'react';
import { 
  ArrowRight, 
  Coins, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

interface LandingPageProps {
  onLaunchWorkbench: () => void;
}

export function LandingPage({ onLaunchWorkbench }: LandingPageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FBFBF9] text-[#111110]">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E6E6E1] text-[#686763] text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#0D7A5F]" />
          <span>PayPal AI Hackathon 2026 • Dual-Rail Clearinghouse</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111110] max-w-4xl mx-auto leading-[1.1]">
            High-parameter open AI. <br className="hidden sm:inline" />
            <span className="text-[#005EA6]">Funded by brand liquidity.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#686763] max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate subscription paywalls. Sponsors deposit compute pools via <strong>PayPal Orders</strong>, users access 70B+ models for free, and GPU operators receive automated settlements via <strong>PayPal Payouts</strong>.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onLaunchWorkbench}
            className="w-full sm:w-auto px-6 py-3 rounded bg-[#005EA6] hover:bg-[#004d88] text-white font-medium text-sm flex items-center justify-center gap-2 transition shadow-sm"
          >
            <span>Launch Live Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded bg-[#FFFFFF] hover:bg-[#F4F4F0] border border-[#E6E6E1] text-[#111110] font-medium text-sm flex items-center justify-center gap-2 transition"
          >
            <span>View Architecture Docs</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#686763]" />
          </a>
        </div>

        {/* Live Metrics Strip */}
        <div className="pt-10 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded bg-white border border-[#E6E6E1]">
            <div className="text-[11px] font-mono text-[#686763] uppercase">Ad Pool Active</div>
            <div className="text-lg font-bold font-mono text-[#111110] tabular-nums mt-0.5">$68.49 USD</div>
          </div>
          <div className="p-3.5 rounded bg-white border border-[#E6E6E1]">
            <div className="text-[11px] font-mono text-[#686763] uppercase">Avg Model Latency</div>
            <div className="text-lg font-bold font-mono text-[#111110] tabular-nums mt-0.5">~280 tok/s</div>
          </div>
          <div className="p-3.5 rounded bg-white border border-[#E6E6E1]">
            <div className="text-[11px] font-mono text-[#686763] uppercase">Inference Cost / Prompt</div>
            <div className="text-lg font-bold font-mono text-[#005EA6] tabular-nums mt-0.5">$0.0042</div>
          </div>
          <div className="p-3.5 rounded bg-white border border-[#E6E6E1]">
            <div className="text-[11px] font-mono text-[#686763] uppercase">Operator Payouts</div>
            <div className="text-lg font-bold font-mono text-[#0D7A5F] tabular-nums mt-0.5">Automated</div>
          </div>
        </div>

      </section>

      {/* The 3-Sided Economy Diagram Section */}
      <section className="border-t border-[#E6E6E1] bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#005EA6]">
              Circular Liquidity Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111110]">
              How PayPal Powers the Compute Clearinghouse
            </h3>
            <p className="text-xs sm:text-sm text-[#686763]">
              Solving the micro-transaction barrier: macro liquidity on PayPal rails, sub-cent accounting on an off-chain ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Sponsors */}
            <div className="p-6 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-3">
              <div className="w-8 h-8 rounded bg-[#FFFFFF] border border-[#E6E6E1] flex items-center justify-center text-[#005EA6]">
                <Coins className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#111110]">1. Inbound Liquidity</h4>
              <p className="text-xs text-[#686763] leading-relaxed">
                Developer tools and cloud platforms fund advertising pools ($25+) using the <strong>PayPal Orders v2 API</strong>, targeting high-intent developer keywords.
              </p>
              <div className="text-[11px] font-mono text-[#005EA6] pt-1">
                API: POST /v2/checkout/orders
              </div>
            </div>

            {/* Step 2: Users */}
            <div className="p-6 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-3">
              <div className="w-8 h-8 rounded bg-[#FFFFFF] border border-[#E6E6E1] flex items-center justify-center text-[#111110]">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#111110]">2. Contextual Inference</h4>
              <p className="text-xs text-[#686763] leading-relaxed">
                Developers prompt 70B+ models for free. A zero-latency semantic classifier attaches an inline sponsor receipt, deducting sub-cents ($0.004) from the sponsor&apos;s escrow.
              </p>
              <div className="text-[11px] font-mono text-[#686763] pt-1">
                Llama 3.3 70B • DeepSeek R1 • Mixtral
              </div>
            </div>

            {/* Step 3: Node Payouts */}
            <div className="p-6 rounded bg-[#FBFBF9] border border-[#E6E6E1] space-y-3">
              <div className="w-8 h-8 rounded bg-[#FFFFFF] border border-[#E6E6E1] flex items-center justify-center text-[#0D7A5F]">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#111110]">3. Outbound Settlements</h4>
              <p className="text-xs text-[#686763] leading-relaxed">
                When a GPU node crosses the $10 payout threshold, PromptFund automatically dispatches funds to the operator&apos;s PayPal email via the <strong>PayPal Payouts v1 API</strong>.
              </p>
              <div className="text-[11px] font-mono text-[#0D7A5F] pt-1">
                API: POST /v1/payments/payouts
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-t border-[#E6E6E1] py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-[#111110]">
              Why PromptFund AI Wins Over Subscription Paywalls
            </h3>
            <p className="text-xs text-[#686763]">
              A structural comparison between traditional SaaS AI billing and the PayPal Clearinghouse model.
            </p>
          </div>

          <div className="border border-[#E6E6E1] rounded overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F4F0] text-[#686763] font-mono text-[11px] border-b border-[#E6E6E1]">
                <tr>
                  <th className="py-3 px-4">Feature / Metric</th>
                  <th className="py-3 px-4">Legacy AI SaaS</th>
                  <th className="py-3 px-4 text-[#005EA6]">PromptFund AI + PayPal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E1] text-[#111110]">
                <tr>
                  <td className="py-3 px-4 font-medium">User Access Cost</td>
                  <td className="py-3 px-4 text-[#686763]">$20 / month recurring</td>
                  <td className="py-3 px-4 font-semibold text-[#0D7A5F]">100% Free (Ad-Funded)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Payment Interchange Friction</td>
                  <td className="py-3 px-4 text-[#686763]">30¢ + 2.9% kills micro-prompts</td>
                  <td className="py-3 px-4 text-[#005EA6]">Macro-pooled liquidity</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Advertising Format</td>
                  <td className="py-3 px-4 text-[#686763]">Intrusive tracking popups</td>
                  <td className="py-3 px-4">Contextual 1-line developer receipts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Infrastructure Settlement</td>
                  <td className="py-3 px-4 text-[#686763]">Manual monthly invoices</td>
                  <td className="py-3 px-4 font-semibold text-[#0D7A5F]">Automated PayPal Payouts API</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={onLaunchWorkbench}
              className="px-6 py-2.5 rounded bg-[#111110] hover:bg-[#2B2B28] text-white font-medium text-xs inline-flex items-center gap-1.5 transition"
            >
              <span>Test Interactive Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E6E6E1] bg-[#F4F4F0] py-8 text-center text-xs text-[#686763]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[11px]">
            PromptFund AI • Built for PayPal AI Hackathon 2026
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="hover:underline">PayPal Developer</a>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="hover:underline">Vercel Ready</a>
            <button onClick={onLaunchWorkbench} className="text-[#005EA6] font-medium hover:underline">Launch App →</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
