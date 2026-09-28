export type EmbedInputType = 'query' | 'document';

export async function embed(texts: string[], inputType: EmbedInputType): Promise<number[][]> {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: texts, model: 'voyage-3-lite', input_type: inputType }),
  });

  if (!res.ok) {
    throw new Error(`Voyage AI error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  return (json.data as { embedding: number[] }[]).map(d => d.embedding);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embed([text], 'query');
  return vector;
}
