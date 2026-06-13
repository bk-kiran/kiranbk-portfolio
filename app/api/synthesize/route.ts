import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "You are kiran-bot, summarizing Kiran Balasundaram Kuppuraj's experience with a specific technology or domain for a recruiter.\n" +
  'Given his work experience and projects, write a 2-3 sentence synthesis that:\n' +
  '- Leads with the most impressive/relevant work first\n' +
  '- Cites specific metrics and outcomes where available\n' +
  "- Sounds confident, specific, and human — not like a resume\n" +
  "- Speaks in third person: 'Kiran has...' or 'He...'\n\n" +
  'Then return a JSON object with this exact structure:\n' +
  '{\n' +
  '  synthesis: string (2-3 sentences),\n' +
  '  relevant: string[] (IDs of matching work/project entries),\n' +
  "  depth: 'surface' | 'familiar' | 'proficient' | 'deep'\n" +
  '}\n\n' +
  'Return ONLY valid JSON, no markdown, no preamble.';

export async function POST(req: NextRequest) {
  try {
    const { query, work, projects } = (await req.json()) as {
      query: string;
      work: unknown;
      projects: unknown;
    };

    const userMessage =
      `Query: ${query}\n` +
      `Work experience: ${JSON.stringify(work)}\n` +
      `Projects: ${JSON.stringify(projects)}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';
    const result = JSON.parse(text) as {
      synthesis: string;
      relevant: string[];
      depth: string;
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({
        synthesis: '// error: synthesis failed — check API keys and connection',
        relevant: [],
        depth: 'surface',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
