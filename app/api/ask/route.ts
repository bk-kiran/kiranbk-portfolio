import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { retrieve } from '@/lib/rag/retrieve';
import { buildSystemPrompt, buildMessages } from '@/lib/rag/prompt';
import type { Message } from '@/lib/rag/prompt';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_HISTORY = 8;        // messages (4 Q&A turns)
const MAX_QUERY = 500;         // characters
const MAX_HISTORY_CHARS = 2000; // per history message

// Best-effort per-IP rate limit. Edge instances don't share memory, so this only
// slows down a single abusive client — pair it with a Vercel firewall rule and an
// Anthropic spend limit for real protection.
const RATE_LIMIT = 10;         // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT;
}

/** Keep only well-formed user/assistant text turns, capped in count and length, starting with a user turn. */
function sanitizeHistory(raw: unknown): Message[] {
  if (!Array.isArray(raw)) return [];
  const clean = raw
    .filter((m): m is Message =>
      !!m && typeof m === 'object' &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CHARS) }))
    .slice(-MAX_HISTORY);
  while (clean.length && clean[0].role !== 'user') clean.shift();
  return clean;
}

// SSE protocol (one JSON payload per `data:` line):
//   {type:'meta', chunks, ms, fallback}  retrieval finished (fallback = un-ranked context, see lib/rag/retrieve)
//   {type:'text', text}            answer token(s)
//   {type:'error', message}
//   {type:'done'}
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'too many questions — give it a minute and try again' }, { status: 429 });
  }

  let query: string;
  let history: Message[];
  try {
    const body = (await req.json()) as { query?: unknown; history?: unknown };
    query = typeof body.query === 'string' ? body.query.trim().slice(0, MAX_QUERY) : '';
    history = sanitizeHistory(body.history);
  } catch {
    return Response.json({ error: 'invalid request body' }, { status: 400 });
  }
  if (!query) return Response.json({ error: 'empty question' }, { status: 400 });

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, payload: object) =>
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

  const body = new ReadableStream({
    async start(controller) {
      try {
        const t0 = Date.now();
        const { chunks, mode } = await retrieve(query);
        const fallback = mode === 'fallback';
        send(controller, { type: 'meta', chunks: chunks.length, ms: Date.now() - t0, fallback });

        const stream = anthropic.messages.stream({
          model: 'claude-opus-5',
          max_tokens: 4000,
          output_config: { effort: 'low' },
          system: buildSystemPrompt(chunks),
          messages: buildMessages(query, history),
        });

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            send(controller, { type: 'text', text: event.delta.text });
          }
        }

        send(controller, { type: 'done' });
      } catch (err) {
        console.error('[api/ask]', err);
        send(controller, { type: 'error', message: 'kiran-bot is unavailable right now — try `contact` instead.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
