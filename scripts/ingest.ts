/**
 * Builds the ask-kiran knowledge base.
 *
 *   npm run ingest            chunk + embed everything, write the local vector index
 *   npm run ingest -- --dry   chunk only, print what would be indexed
 *
 * Sources:
 *   - lib/data/*.ts            experience, projects, education, skills, personal
 *   - corpus/**                any .md / .txt / .pdf / .docx you drop in (see corpus/README.md)
 *   - public/resume.pdf        the résumé linked from the site (skipped if corpus/ has a resume.pdf)
 *
 * Output:
 *   - lib/rag/index.json       chunks + voyage-3-lite vectors, searched by app/api/ask at request time
 *   - lib/rag/manifest.json    doc/chunk counts shown by `/sources` in the ask sub-shell
 */
import fs from 'node:fs';
import path from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';

import { embed } from '../lib/rag/embed';
import { Chunk, dataChunks, push, slug } from '../lib/rag/chunks';

const ROOT = process.cwd();
const CORPUS = path.join(ROOT, 'corpus');
const INDEX = path.join(ROOT, 'lib/rag/index.json');
const MANIFEST = path.join(ROOT, 'lib/rag/manifest.json');
const PUBLIC_RESUME = path.join(ROOT, 'public/resume.pdf');
const EMBED_MODEL = 'voyage-3-lite';
const EMBED_BATCH = 32;
const DRY = process.argv.includes('--dry');

// ── corpus/ → chunks ────────────────────────────────────────────────────────

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    if (d.name.startsWith('.')) return [];
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

/** Markdown: split on headings, keeping each heading with its section for context. */
function markdownChunks(text: string, rel: string): Chunk[] {
  const chunks: Chunk[] = [];
  for (const section of text.split(/\n(?=#{1,3} )/)) {
    const heading = section.match(/^#{1,3} (.+)/)?.[1];
    if (section.trim()) push(chunks, heading ? `${rel} §${slug(heading)}` : rel, section.trim());
  }
  return chunks;
}

const SECTION_HEADINGS = /^(SUMMARY|OBJECTIVE|EDUCATION|EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|RESEARCH EXPERIENCE|PROJECTS|TECHNICAL PROJECTS|SKILLS|TECHNICAL SKILLS|LEADERSHIP|ACTIVITIES|INVOLVEMENT|RESEARCH|AWARDS|HONORS|PUBLICATIONS|CERTIFICATIONS|COURSEWORK|VOLUNTEER)\b/i;

/** Plain text (PDF/DOCX/TXT): group lines under the nearest ALL-CAPS-style section heading. */
function textChunks(text: string, rel: string): Chunk[] {
  const chunks: Chunk[] = [];
  let heading: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    const body = buf.join('\n').trim();
    if (body) push(chunks, heading ? `${rel} §${slug(heading)}` : rel, body);
    buf = [];
  };
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (SECTION_HEADINGS.test(trimmed) && trimmed.length < 40) {
      flush();
      heading = trimmed;
    } else {
      buf.push(trimmed);
    }
  }
  flush();
  return chunks;
}

async function fileChunks(file: string, rel = path.relative(CORPUS, file)): Promise<Chunk[] | null> {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.md' || ext === '.mdx') return markdownChunks(fs.readFileSync(file, 'utf8'), rel);
  if (ext === '.txt') return textChunks(fs.readFileSync(file, 'utf8'), rel);
  if (ext === '.pdf') {
    const pdf = await getDocumentProxy(new Uint8Array(fs.readFileSync(file)));
    const { text } = await extractText(pdf, { mergePages: true });
    return textChunks(text, rel);
  }
  if (ext === '.docx') {
    const { value } = await mammoth.extractRawText({ path: file });
    return textChunks(value, rel);
  }
  return null;
}

// ── embedding ───────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Voyage's free tier is rate-limited (a few requests/min), so back off on 429s. */
async function embedWithRetry(texts: string[]): Promise<number[][]> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await embed(texts, 'document');
    } catch (err) {
      if (attempt >= 6 || !String(err).includes('429')) throw err;
      const wait = 20_000 * attempt;
      console.log(`  rate limited by Voyage, retrying in ${wait / 1000}s…`);
      await sleep(wait);
    }
  }
}

// ── main ────────────────────────────────────────────────────────────────────

async function main() {
  try { process.loadEnvFile(path.join(ROOT, '.env.local')); } catch { /* rely on real env */ }

  const chunks = dataChunks();
  const corpusFiles = walk(CORPUS).filter(f => path.basename(f).toLowerCase() !== 'readme.md');
  const skipped: string[] = [];

  for (const file of corpusFiles) {
    const result = await fileChunks(file);
    if (result) chunks.push(...result);
    else skipped.push(path.relative(ROOT, file));
  }
  if (!corpusFiles.some(f => path.basename(f).toLowerCase() === 'resume.pdf') && fs.existsSync(PUBLIC_RESUME)) {
    chunks.push(...(await fileChunks(PUBLIC_RESUME, 'resume.pdf'))!);
  }

  // Group by top-level doc (the part before "§") for the manifest.
  const docCounts = new Map<string, number>();
  for (const c of chunks) {
    const doc = c.source.split(' §')[0];
    docCounts.set(doc, (docCounts.get(doc) ?? 0) + 1);
  }
  const manifest = {
    docs: [...docCounts].map(([source, n]) => ({ source, chunks: n })),
    totalChunks: chunks.length,
    embedModel: EMBED_MODEL,
    updatedAt: new Date().toISOString(),
  };

  console.log(`${manifest.docs.length} docs · ${chunks.length} chunks`);
  for (const d of manifest.docs) console.log(`  ${d.source.padEnd(44)} ${d.chunks}`);
  if (skipped.length) console.log(`skipped (unsupported type): ${skipped.join(', ')}`);

  if (DRY) return;
  if (!process.env.VOYAGE_API_KEY) throw new Error('missing VOYAGE_API_KEY (set it in .env.local)');

  const vectors: number[][] = [];
  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH);
    vectors.push(...await embedWithRetry(batch.map(c => `${c.source}\n${c.text}`)));
    console.log(`  embedded ${Math.min(i + EMBED_BATCH, chunks.length)}/${chunks.length}`);
  }

  const index = {
    model: EMBED_MODEL,
    updatedAt: manifest.updatedAt,
    // 4 decimals is plenty for cosine ranking and keeps the file small.
    chunks: chunks.map((c, i) => ({
      id: c.id,
      source: c.source,
      text: c.text,
      vector: vectors[i].map(v => Math.round(v * 1e4) / 1e4),
    })),
  };

  fs.writeFileSync(INDEX, JSON.stringify(index) + '\n');
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const kb = Math.round(fs.statSync(INDEX).size / 1024);
  console.log(`wrote ${path.relative(ROOT, INDEX)} (${kb} KB) and ${path.relative(ROOT, MANIFEST)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
