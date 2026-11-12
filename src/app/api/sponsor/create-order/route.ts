import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { amountUsd = 25.0 } = await req.json().catch(() => ({}));
    const order = await createPayPalOrder(Number(amountUsd));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountUsd,
      simulated: order.simulated || false,
    });
  } catch (error: unknown) {
    console.error('Create order error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
