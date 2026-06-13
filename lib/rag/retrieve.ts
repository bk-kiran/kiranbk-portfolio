import { embedQuery } from './embed';

export interface Chunk {
  text: string;
  source: string;
  score: number;
}

interface UpstashResult {
  id: string;
  score: number;
  metadata: { text: string; source: string };
}

export async function retrieve(query: string, topK = 5): Promise<Chunk[]> {
  const vector = await embedQuery(query);

  const res = await fetch(`${process.env.UPSTASH_VECTOR_REST_URL}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vector, topK, includeMetadata: true }),
  });

  if (!res.ok) {
    throw new Error(`Upstash Vector error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  return (json.result as UpstashResult[]).map(r => ({
    text: r.metadata.text,
    source: r.metadata.source,
    score: r.score,
  }));
}
