import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amountUsd = 25.0 } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const capture = await capturePayPalOrder(orderId, Number(amountUsd));

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountUsd,
      capture,
    });
  } catch (error: unknown) {
    console.error('Capture order error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to capture order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
