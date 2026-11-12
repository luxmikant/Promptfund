import { NextResponse } from 'next/server';
import { executePayPalPayout } from '@/lib/paypal';
import { inMemoryStore } from '@/lib/store';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const node = inMemoryStore.node;
    const amountToSettle = node.pending_payout_usd > 0.05 ? Number(node.pending_payout_usd.toFixed(2)) : 10.0;

    const settlement = await executePayPalPayout(amountToSettle);

    return NextResponse.json({
      success: true,
      settlement,
      node: {
        pending_payout_usd: node.pending_payout_usd,
        total_paid_out_usd: node.total_paid_out_usd,
      },
    });
  } catch (error: unknown) {
    console.error('Payouts route error:', error);
    const msg = error instanceof Error ? error.message : 'Payout execution failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
