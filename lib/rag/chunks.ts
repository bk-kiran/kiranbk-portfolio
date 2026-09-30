// Chunking shared by scripts/ingest.ts (builds the vector index) and
// app/api/ask (fallback context when the vector store is unreachable).
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { education } from '../data/education';
import { skills } from '../data/skills';
import { personal, contact } from '../data/personal';

const MAX_CHARS = 900;

export interface Chunk { id: string; source: string; text: string }

// ── chunking helpers ────────────────────────────────────────────────────────

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Split long text on paragraph, then sentence boundaries so no chunk exceeds MAX_CHARS. */
function splitText(text: string): string[] {
  const out: string[] = [];
  let buf = '';
  const pieces = text.split(/\n{2,}/).flatMap(p =>
    p.length <= MAX_CHARS ? [p] : p.split(/(?<=[.!?])\s+/),
  );
  for (const piece of pieces) {
    const next = buf ? `${buf}\n\n${piece}` : piece;
    if (next.length > MAX_CHARS && buf) {
      out.push(buf);
      buf = piece;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) out.push(buf);
  return out.map(s => s.trim()).filter(Boolean);
}

export function push(chunks: Chunk[], source: string, text: string) {
  splitText(text).forEach((t, i) => {
    chunks.push({ id: `${source}#${chunks.length}-${i}`, source, text: t });
  });
}

// ── lib/data → chunks ───────────────────────────────────────────────────────

export function dataChunks(): Chunk[] {
  const chunks: Chunk[] = [];

  push(chunks, 'about.md', [
    `${personal.name} is a ${personal.degree} student at ${personal.school}, class of ${personal.classYear}.`,
    `GPA: ${personal.gpa}.`,
    `Currently seeking: ${personal.seeking.join('; ')}.`,
    `Contact: email ${contact.email}, GitHub ${contact.github}, LinkedIn ${contact.linkedin}, website ${contact.site}.`,
  ].join('\n'));

  for (const e of experience) {
    const bullets = e.bullets.filter(b => b && b !== 'soon');
    push(chunks, `experience.md §${e.id}`, [
      `${e.role} at ${e.company}${e.location ? ` (${e.location})` : ''}, ${e.period}.`,
      ...bullets.map(b => `- ${b}`),
      e.tags?.length ? `Technologies: ${e.tags.join(', ')}.` : undefined,
    ].filter(Boolean).join('\n'));
  }

  for (const p of projects) {
    push(chunks, `projects/${p.id}.md`, [
      `Project: ${p.name} (${p.status}${p.featured ? ', featured' : ''}).`,
      p.oneliner,
      p.description,
      `Tech: ${p.tech.join(', ')}.`,
      `Highlights: ${p.metrics.join('; ')}.`,
      `GitHub: ${p.github}${p.demo ? ` · Demo: ${p.demo}` : ''}`,
    ].join('\n'));
  }

  for (const ed of education) {
    push(chunks, `education.md §${ed.id}`, [
      `${ed.degree}, ${ed.institution} (${ed.location}). ${ed.period}.`,
      `Relevant coursework: ${ed.coursework.join(', ')}.`,
    ].join('\n'));

    for (const a of ed.activities) {
      const lines = [
        `${a.name}${a.role ? ` — ${a.role}` : ''} (${ed.institution}), ${a.period}.`,
        a.description,
        ...(a.bullets ?? []).map(b => `- ${b}`),
        a.courses?.length ? `Courses / tools: ${a.courses.join(', ')}.` : undefined,
        ...(a.project ?? []).map(p => `${p.name}: ${p.description ?? ''}`),
      ].filter(Boolean);
      push(chunks, `education.md §${slug(a.name)}`, lines.join('\n'));
    }
  }

  push(chunks, 'skills.md', Object.entries(skills)
    .map(([group, items]) => `${group}: ${items.map(i => i.name).join(', ')}`)
    .join('\n'));

  return chunks;
}
