import indexJson from './index.json';
import { embedQuery } from './embed';
import { dataChunks } from './chunks';

export interface Chunk {
  text: string;
  source: string;
  score: number;
}

interface IndexedChunk { id: string; source: string; text: string; vector: number[] }
interface VectorIndex { model: string; updatedAt: string | null; chunks: IndexedChunk[] }

// Built by `npm run ingest`. Small enough (a few hundred chunks at most) to rank
// in memory, so no external vector database sits in the request path.
const index = indexJson as VectorIndex;

// Fallback context is passed to the model whole, so cap it.
const FALLBACK_MAX_CHUNKS = 60;

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export type RetrievalMode = 'vector' | 'fallback';

/**
 * Top-k chunks for a query. Falls back to un-ranked context (the indexed text, or the
 * site's own data if the index hasn't been built) when embedding the query fails.
 */
export async function retrieve(query: string, topK = 8): Promise<{ chunks: Chunk[]; mode: RetrievalMode }> {
  if (index.chunks.length > 0) {
    try {
      const q = await embedQuery(query);
      const ranked = index.chunks
        .map(c => ({ text: c.text, source: c.source, score: cosine(q, c.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      return { chunks: ranked, mode: 'vector' };
    } catch (err) {
      console.error('[rag] query embedding failed, using un-ranked context', err);
      return {
        chunks: index.chunks.slice(0, FALLBACK_MAX_CHUNKS).map(c => ({ text: c.text, source: c.source, score: 0 })),
        mode: 'fallback',
      };
    }
  }
  return {
    chunks: dataChunks().map(c => ({ text: c.text, source: c.source, score: 0 })),
    mode: 'fallback',
  };
}

export const indexInfo = { chunks: index.chunks.length, updatedAt: index.updatedAt };
