import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { retrieve } from '@/lib/rag/retrieve';
import { buildSystemPrompt, buildMessages } from '@/lib/rag/prompt';
import type { Message } from '@/lib/rag/prompt';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_HISTORY = 8;
const MAX_QUERY = 500;

// SSE protocol (one JSON payload per `data:` line):
//   {type:'meta', chunks, ms, fallback}  retrieval finished (fallback = un-ranked context, see lib/rag/retrieve)
//   {type:'text', text}            answer token(s)
//   {type:'sources', sources}      retrieved chunks, sent after the answer
//   {type:'error', message}
//   {type:'done'}
export async function POST(req: NextRequest) {
  let query: string;
  let history: Message[];
  try {
    const body = (await req.json()) as { query?: unknown; history?: unknown };
    query = typeof body.query === 'string' ? body.query.trim().slice(0, MAX_QUERY) : '';
    history = Array.isArray(body.history) ? (body.history as Message[]).slice(-MAX_HISTORY) : [];
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

        send(controller, {
          type: 'sources',
          sources: chunks.map(c => ({ source: c.source, text: c.text, score: c.score })),
        });
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
