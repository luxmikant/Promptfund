import { NextRequest, NextResponse } from 'next/server';
import { matchSponsorToPrompt } from '@/lib/ad-matcher';
import { executeInferenceAccounting } from '@/lib/store';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, modelId = 'Llama 3.3 70B' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Parallel Semantic Ad Match
    const adMatch = matchSponsorToPrompt(message);

    // 2. Inference (Groq if key provided, else smart technical response)
    let replyText = '';
    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey && !groqKey.includes('placeholder')) {
      try {
        const groqModel = modelId.includes('DeepSeek')
          ? 'deepseek-r1-distill-llama-70b'
          : modelId.includes('Mixtral')
          ? 'mixtral-8x7b-32768'
          : 'llama-3.3-70b-versatile';

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              {
                role: 'system',
                content: 'You are a senior engineer on PromptFund AI. Provide clear, direct, high-caliber technical responses.',
              },
              { role: 'user', content: message },
            ],
            temperature: 0.6,
            max_tokens: 1024,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          replyText = groqData.choices[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('Groq inference fallback:', err);
      }
    }

    if (!replyText) {
      replyText = getTechnicalResponse(message);
    }

    // Token accounting
    const promptTokens = Math.max(16, Math.round(message.split(/\s+/).length * 1.3));
    const completionTokens = Math.max(64, Math.round(replyText.split(/\s+/).length * 1.3));
    const totalTokens = promptTokens + completionTokens;

    // Rate: $0.0008 / 1k tokens for 70B class models
    const costUsd = Number(((totalTokens / 1000) * 0.0008).toFixed(6));

    // Deduct from sponsor, credit to node
    const ledgerEntry = await executeInferenceAccounting({
      sponsorId: adMatch.sponsor.id,
      modelId,
      tokens: totalTokens,
      costUsd,
    });

    return NextResponse.json({
      reply: replyText,
      tokens: totalTokens,
      computeCostUsd: costUsd,
      modelId,
      sponsorReceipt: {
        sponsorName: adMatch.sponsor.company_name,
        adHeadline: adMatch.adHeadline,
        ctaUrl: adMatch.ctaUrl,
        tokens: totalTokens,
        computeCostUsd: costUsd,
        modelId,
      },
      ledgerEntry,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function getTechnicalResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('postgres') || p.includes('sql') || p.includes('jsonb') || p.includes('index')) {
    return `To index a JSONB column efficiently in PostgreSQL for rapid key lookups, use a **GIN (Generalized Inverted Index)**:

\`\`\`sql
-- 1. Index the entire JSONB payload for jsonb_ops (supports ?, ?|, ?& operators)
CREATE INDEX idx_orders_payload_gin ON orders USING GIN (payload);

-- 2. Index specific high-throughput paths using jsonb_path_ops (smaller index size, faster equality)
CREATE INDEX idx_orders_customer_id ON orders USING GIN ((payload -> 'customer_id') jsonb_path_ops);
\`\`\`

#### Production Considerations:
* **\`jsonb_path_ops\` vs \`jsonb_ops\`:** If you only perform \`@>\` (contains) queries, \`jsonb_path_ops\` produces an index up to 60% smaller with faster lookup latency.
* **Partial Indexes:** If you only query active rows, add \`WHERE status = 'active'\` to avoid index bloat.`;
  }

  if (p.includes('next') || p.includes('docker') || p.includes('deploy') || p.includes('k8s')) {
    return `Here is a lightweight multi-stage Docker build for Next.js standalone output:

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

#### Key Architecture Notes:
* Enable \`output: 'standalone'\` in \`next.config.js\` to bundle only required production node_modules.
* Reduces image size from ~850MB to under 120MB for sub-second container cold starts.`;
  }

  return `### Architecture Assessment

1. **Decoupled Clearinghouse:** Running asynchronous token settlement off-chain preserves sub-millisecond Time-to-First-Token (TTFT).
2. **Deterministic Liquidity:** By batching payouts across a \$10.00 threshold, network transaction fees are minimized while guaranteeing node operator solvency.
3. **Contextual Sponsor Alignment:** Direct keyword and intent matching bridges relevant developer infrastructure to user prompts with zero privacy tracking.`;
}
