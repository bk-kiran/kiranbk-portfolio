import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  'You are a filter assistant for a developer portfolio. ' +
  'Given a search query and a list of projects/experiences, return the IDs of the most relevant matches as a JSON array. ' +
  'Only return IDs that genuinely match the query\'s technical intent. ' +
  'If nothing matches return an empty array. ' +
  'Return ONLY a JSON array of ID strings, nothing else. ' +
  'Example: ["dopamine-drop", "studylens-ai"]';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: string;
      query: string;
      projects?: unknown;
      experience?: unknown;
    };

    const items = body.type === 'projects' ? body.projects : body.experience;
    const userMessage = `Query: ${body.query}\nItems: ${JSON.stringify(items)}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]';
    const ids = JSON.parse(text) as string[];

    return new Response(JSON.stringify({ ids }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ids: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
