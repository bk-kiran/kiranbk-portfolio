import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { retrieve } from '@/lib/rag/retrieve';
import { buildSystemPrompt, buildMessages } from '@/lib/rag/prompt';
import type { Message } from '@/lib/rag/prompt';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { query, history = [] } = (await req.json()) as {
      query: string;
      history: Message[];
    };

    const chunks = await retrieve(query, 5);
    const systemPrompt = buildSystemPrompt(chunks);
    const messages = buildMessages(query, history);

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();

    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${event.delta.text}\n\n`),
              );
            }
          }
          controller.enqueue(
            encoder.encode(`data: [SOURCES]${JSON.stringify(chunks)}\n\n`),
          );
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
