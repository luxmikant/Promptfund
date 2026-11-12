import { NextResponse } from 'next/server';
import { getTelemetryState } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await getTelemetryState();
    return NextResponse.json(state);
  } catch (error: unknown) {
    console.error('Telemetry error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch telemetry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
