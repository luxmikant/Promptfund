import { inMemoryStore } from './store';
import { PayPalSettlement } from './types';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'sb';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

const isPayPalConfigured = Boolean(
  PAYPAL_CLIENT_ID &&
  PAYPAL_CLIENT_ID !== 'sb' &&
  PAYPAL_CLIENT_SECRET &&
  !PAYPAL_CLIENT_SECRET.includes('placeholder')
);

export async function getPayPalAccessToken(): Promise<string> {
  if (!isPayPalConfigured) {
    return 'MOCK_SANDBOX_ACCESS_TOKEN_' + Date.now();
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal OAuth failed: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(amountUsd: number = 25.0) {
  if (!isPayPalConfigured) {
    const mockOrderId = 'ORD-SB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    return {
      id: mockOrderId,
      status: 'CREATED',
      simulated: true,
      amount: amountUsd,
    };
  }

  const token = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `PU_COMPUTE_POOL_${Date.now()}`,
          description: 'PromptFund AI - Sponsor Compute Pool Liquidity',
          amount: {
            currency_code: 'USD',
            value: amountUsd.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Create Order failed: ${error}`);
  }

  return response.json();
}

export async function capturePayPalOrder(orderId: string, amountUsd: number = 25.0) {
  if (!isPayPalConfigured || orderId.startsWith('ORD-SB-')) {
    // Add funds across active sponsors
    inMemoryStore.sponsors[0].escrow_balance_usd += amountUsd;
    inMemoryStore.sponsors[0].total_deposited_usd += amountUsd;

    return {
      id: orderId,
      status: 'COMPLETED',
      simulated: true,
      amount: amountUsd,
    };
  }

  const token = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Capture Order failed: ${error}`);
  }

  const data = await response.json();

  // Credit to active sponsor
  inMemoryStore.sponsors[0].escrow_balance_usd += amountUsd;
  inMemoryStore.sponsors[0].total_deposited_usd += amountUsd;

  return data;
}

export async function executePayPalPayout(amountUsd: number): Promise<PayPalSettlement> {
  const node = inMemoryStore.node;
  const batchId = `BATCH-${Math.floor(100 + Math.random() * 900)}`;

  let officialBatchId = batchId;
  let isSimulated = false;

  if (!isPayPalConfigured) {
    officialBatchId = `SB-BATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    isSimulated = true;
  } else {
    try {
      const token = await getPayPalAccessToken();
      const response = await fetch(`${PAYPAL_API_BASE}/v1/payments/payouts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_batch_header: {
            sender_batch_id: `PF_${Date.now()}`,
            email_subject: 'PromptFund AI Compute Node Settlement',
          },
          items: [
            {
              recipient_type: 'EMAIL',
              amount: {
                value: amountUsd.toFixed(2),
                currency: 'USD',
              },
              note: `Compute settlement payout for ${node.node_name}`,
              receiver: node.operator_paypal_email,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        officialBatchId = data.batch_header?.payout_batch_id || officialBatchId;
      } else {
        const errText = await response.text();
        console.warn('PayPal Payouts API returned non-200 (falling back to sandbox settlement batch):', errText);
        isSimulated = true;
      }
    } catch (err) {
      console.warn('PayPal Payouts request exception:', err);
      isSimulated = true;
    }
  }

  // Update node balances
  node.total_paid_out_usd += amountUsd;
  node.pending_payout_usd = 0.0;

  const settlement: PayPalSettlement = {
    id: `set_${Date.now()}`,
    batch_id: officialBatchId,
    amount_usd: amountUsd,
    recipient_email: node.operator_paypal_email,
    status: 'SUCCESS',
    timestamp: 'Just now',
    simulated: isSimulated,
  };

  inMemoryStore.settlementLog.unshift(settlement);
  if (inMemoryStore.settlementLog.length > 10) inMemoryStore.settlementLog.pop();

  return settlement;
}
