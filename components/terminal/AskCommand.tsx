'use client';

import { useEffect, useRef, useState, KeyboardEvent, ReactNode } from 'react';
import manifestJson from '@/lib/rag/manifest.json';

interface Manifest {
  docs: { source: string; chunks: number }[];
  totalChunks: number;
  embedModel: string;
  updatedAt: string | null;
}
const manifest = manifestJson as Manifest;

// Color semantics from designs/_ ask _ design notes.png
const C = {
  bot: '#4ade80',
  user: '#67e8f9',
  cite: '#c084fc',
  suggest: '#fbbf24',
  dim: 'rgba(255,255,255,0.35)',
  text: 'rgba(255,255,255,0.82)',
  error: '#f87171',
};
const MONO = "'Courier New', monospace";

const SEEDED = [
  'why should I hire Kiran for an AI/ML role?',
  "what's Kiran's strongest project, technically?",
  'is Kiran available for a Fall 2026 internship?',
];

const STORAGE_TURNS = 'ask-turns';

interface Source { source: string; text: string; score?: number }

type Turn =
  | {
      kind: 'qa';
      question: string;
      answer: string;
      status: 'retrieving' | 'streaming' | 'done' | 'error';
      meta?: { chunks: number; ms: number; fallback?: boolean };
      sources?: Source[];
      suggestions?: string[];
      error?: string;
    }
  | { kind: 'system'; lines: string[] };

// ── parsing helpers ─────────────────────────────────────────────────────────

const SUGGESTIONS_RE = /<suggestions>([\s\S]*?)<\/suggestions>/;

/** Strip the <suggestions> block, including a half-streamed opening tag at the tail. */
function visibleAnswer(raw: string): string {
  const idx = raw.indexOf('<suggestions>');
  let text = idx === -1 ? raw : raw.slice(0, idx);
  const partial = text.match(/<[a-z]*$/);
  if (partial) text = text.slice(0, partial.index);
  return text.trim();
}

function parseSuggestions(raw: string): string[] {
  const m = raw.match(SUGGESTIONS_RE);
  if (!m) return [];
  try {
    const arr = JSON.parse(m[1]);
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === 'string').slice(0, 3) : [];
  } catch {
    return [];
  }
}

function citedIndexes(answer: string): number[] {
  const seen = new Set<number>();
  for (const m of answer.matchAll(/\[(\d+)\]/g)) seen.add(Number(m[1]));
  return [...seen].sort((a, b) => a - b);
}

function snippet(text: string, max = 110) {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function loadTurns(): Turn[] {
  try {
    const raw = localStorage.getItem(STORAGE_TURNS);
    if (raw) {
      // Anything mid-flight when the page closed can't resume.
      return (JSON.parse(raw) as Turn[]).map(t =>
        t.kind === 'qa' && t.status !== 'done' && t.status !== 'error'
          ? { ...t, status: 'error', error: 'interrupted' }
          : t);
    }
  } catch { }
  return [];
}

// ── rendering helpers ───────────────────────────────────────────────────────

function withCitations(text: string): ReactNode[] {
  return text.split(/(\[\d+\])/g).map((part, i) =>
    /^\[\d+\]$/.test(part) ? (
      <span key={i} style={{
        color: C.cite, border: `1px solid ${C.cite}55`, background: `${C.cite}14`,
        borderRadius: 3, padding: '0 3px', margin: '0 1px', fontSize: 11,
      }}>{part}</span>
    ) : <span key={i}>{part}</span>,
  );
}

function Label({ who }: { who: 'you' | 'kiran-bot' }) {
  return (
    <span style={{ color: who === 'you' ? C.user : C.bot, flexShrink: 0, userSelect: 'none' }}>
      {who} ›
    </span>
  );
}

// ── component ───────────────────────────────────────────────────────────────

interface Props {
  initialQuestion?: string;
  onExit: (summary: string) => void;
}

export default function AskShell({ initialQuestion, onExit }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestIdx, setSuggestIdx] = useState(-1);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const askedInitial = useRef(false);

  const busy = turns.some(t => t.kind === 'qa' && (t.status === 'retrieving' || t.status === 'streaming'));
  const qaTurns = turns.filter((t): t is Extract<Turn, { kind: 'qa' }> => t.kind === 'qa');
  const lastSuggestions = [...qaTurns].reverse().find(t => t.suggestions?.length)?.suggestions ?? SEEDED;

  useEffect(() => {
    setTurns(loadTurns());
    setReady(true);
    inputRef.current?.focus();
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_TURNS, JSON.stringify(turns)); } catch { }
  }, [turns, ready]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [turns]);

  useEffect(() => {
    if (ready && initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      ask(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, initialQuestion]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      exit();
    };
    // Capture phase so the terminal's own Esc handler doesn't also close the modal.
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  });

  function exit() {
    abortRef.current?.abort();
    const n = qaTurns.length;
    onExit(n ? `left ~/ask · ${n} question${n === 1 ? '' : 's'} this session` : 'left ~/ask');
  }

  function updateLast(patch: Partial<Extract<Turn, { kind: 'qa' }>>) {
    setTurns(ts => {
      const copy = [...ts];
      for (let i = copy.length - 1; i >= 0; i--) {
        const t = copy[i];
        if (t.kind === 'qa') { copy[i] = { ...t, ...patch }; break; }
      }
      return copy;
    });
  }

  async function ask(question: string) {
    const history = qaTurns
      .filter(t => t.status === 'done')
      .slice(-4)
      .flatMap(t => [
        { role: 'user' as const, content: t.question },
        { role: 'assistant' as const, content: visibleAnswer(t.answer) },
      ]);

    setTurns(ts => [...ts, { kind: 'qa', question, answer: '', status: 'retrieving' }]);

    const controller = new AbortController();
    abortRef.current = controller;
    let raw = '';

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          if (!evt.startsWith('data: ')) continue;
          const payload = JSON.parse(evt.slice(6));
          if (payload.type === 'meta') {
            updateLast({ status: 'streaming', meta: { chunks: payload.chunks, ms: payload.ms, fallback: payload.fallback } });
          } else if (payload.type === 'text') {
            raw += payload.text;
            updateLast({ answer: raw });
          } else if (payload.type === 'sources') {
            updateLast({ sources: payload.sources });
          } else if (payload.type === 'error') {
            throw new Error(payload.message);
          }
        }
      }
      updateLast({ status: 'done', answer: raw, suggestions: parseSuggestions(raw) });
      setSuggestIdx(-1);
    } catch (err) {
      if (controller.signal.aborted) return;
      updateLast({ status: 'error', error: err instanceof Error ? err.message : 'something went wrong' });
    }
  }

  function exportTranscript() {
    const md = [
      `# kiran-bot transcript`,
      `_exported ${new Date().toLocaleString()} from kiranbk.com_`,
      '',
      ...qaTurns.filter(t => t.status === 'done').flatMap(t => {
        const answer = visibleAnswer(t.answer);
        const cited = citedIndexes(answer);
        return [
          `**you ›** ${t.question}`,
          '',
          `**kiran-bot ›** ${answer}`,
          '',
          ...(t.sources ?? [])
            .map((s, i) => ({ s, n: i + 1 }))
            .filter(({ n }) => cited.includes(n))
            .map(({ s, n }) => `> [${n}] ${s.source} — "${snippet(s.text)}"`),
          '',
        ];
      }),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kiran-bot-transcript.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function slash(cmd: string): string[] {
    switch (cmd) {
      case '/reset':
        abortRef.current?.abort();
        setTurns([]);
        return [];
      case '/sources':
        if (!manifest.totalChunks) return ["knowledge base not indexed yet — run 'npm run ingest'"];
        return [
          `knowledge base · ${manifest.docs.length} docs · ${manifest.totalChunks} chunks · ${manifest.embedModel}`,
          ...manifest.docs.map(d => `  ${d.source.padEnd(34)} ${String(d.chunks).padStart(3)} chunks`),
        ];
      case '/export':
        if (!qaTurns.some(t => t.status === 'done')) return ['nothing to export yet'];
        exportTranscript();
        return ['transcript downloaded · kiran-bot-transcript.md'];
      case '/help':
        return [
          '/reset    clear this conversation',
          '/sources  list the indexed documents',
          '/export   download the transcript as markdown',
          '/exit     back to the shell (or press Esc)',
        ];
      case '/exit':
        exit();
        return [];
      default:
        return [`unknown command ${cmd} — try /help`];
    }
  }

  function submit() {
    const q = input.trim();
    setInput('');
    setHistIdx(-1);
    setSuggestIdx(-1);
    if (!q) return;
    if (q.startsWith('/')) {
      const lines = slash(q.split(/\s+/)[0].toLowerCase());
      if (lines.length) setTurns(ts => [...ts, { kind: 'system', lines: [`> ${q}`, ...lines] }]);
      return;
    }
    if (busy) return;
    ask(q);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { submit(); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const next = (suggestIdx + 1) % lastSuggestions.length;
      setSuggestIdx(next);
      setInput(lastSuggestions[next]);
      return;
    }
    const asked = qaTurns.map(t => t.question).reverse();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, asked.length - 1);
      if (next < 0) return;
      setHistIdx(next);
      setInput(asked[next]);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(Math.max(next, -1));
      setInput(next < 0 ? '' : asked[next]);
    }
  }

  const row = { display: 'flex', gap: 10, alignItems: 'flex-start' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: MONO, fontSize: 13, lineHeight: '21px' }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{ overflowY: 'auto', padding: '16px 20px 4px', minHeight: 300, maxHeight: 440, cursor: 'text' }}
      >
        {/* header card */}
        <div style={{ borderLeft: `3px solid ${C.cite}`, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', marginBottom: 14, borderRadius: 4 }}>
          <div style={{ color: C.cite }}>▲ kiran-bot · ask anything about Kiran</div>
          <div style={{ color: C.dim, fontSize: 12 }}>
            RAG over my résumé, experience, projects & coursework. answers cite their sources.
            {manifest.totalChunks > 0 && ` · ${manifest.docs.length} docs · ${manifest.totalChunks} chunks indexed`}
          </div>
          <div style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>
            try:{' '}
            {SEEDED.map((s, i) => (
              <span key={s}>
                <button onClick={() => !busy && ask(s)} style={{ ...btnReset, color: C.suggest }}>&quot;{s}&quot;</button>
                {i < SEEDED.length - 1 && ' · '}
              </span>
            ))}
          </div>
        </div>

        {turns.map((t, ti) => {
          if (t.kind === 'system') {
            return (
              <div key={ti} style={{ marginBottom: 10 }}>
                {t.lines.map((l, i) => (
                  <div key={i} style={{ color: i === 0 ? C.text : C.dim, whiteSpace: 'pre-wrap' }}>{l}</div>
                ))}
              </div>
            );
          }

          const answer = visibleAnswer(t.answer);
          const cited = citedIndexes(answer);
          const shownSources = (t.sources ?? [])
            .map((s, i) => ({ s, n: i + 1 }))
            .filter(({ n }) => cited.includes(n));
          const isLast = ti === turns.length - 1;

          return (
            <div key={ti} style={{ marginBottom: 14 }}>
              <div style={row}>
                <Label who="you" />
                <span style={{ color: C.text }}>{t.question}</span>
              </div>

              <div style={{ ...row, marginTop: 6 }}>
                <Label who="kiran-bot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {t.status === 'retrieving' && (
                    <div style={{ color: C.dim, fontStyle: 'italic' }}>↻ retrieving from knowledge base…</div>
                  )}
                  {t.meta && t.status === 'streaming' && (
                    <div style={{ color: C.dim, fontStyle: 'italic', fontSize: 12 }}>
                      {t.meta.fallback
                        ? '↻ search unavailable · answering from the full knowledge base'
                        : `↻ ${t.meta.chunks} chunks · ${(t.meta.ms / 1000).toFixed(2)}s`}
                    </div>
                  )}
                  {answer && (
                    <div style={{ color: C.text, whiteSpace: 'pre-wrap' }}>
                      {withCitations(answer)}
                      {t.status === 'streaming' && <span className="ask-cursor" />}
                    </div>
                  )}
                  {t.status === 'streaming' && !answer && <span className="ask-cursor" />}
                  {t.status === 'error' && (
                    <div style={{ color: C.error }}>error: {t.error}</div>
                  )}

                  {t.status === 'done' && shownSources.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <div style={{ color: C.dim, letterSpacing: '0.12em' }}>SOURCES</div>
                      {shownSources.map(({ s, n }) => (
                        <div key={n} style={{ color: C.dim }}>
                          <span style={{ color: C.cite }}>[{n}]</span>{' '}
                          <span style={{ color: C.user }}>{s.source}</span>
                          {' · '}&ldquo;{snippet(s.text)}&rdquo;
                        </div>
                      ))}
                    </div>
                  )}

                  {t.status === 'done' && isLast && t.suggestions && t.suggestions.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <div style={{ color: C.dim, letterSpacing: '0.12em' }}>FOLLOW UP · tab to cycle</div>
                      {t.suggestions.map(s => (
                        <div key={s}>
                          <button onClick={() => !busy && ask(s)} style={{ ...btnReset, color: C.suggest, textAlign: 'left' }}>
                            → {s}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* input row */}
      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', margin: '0 20px', padding: '10px 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Label who="you" />
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setSuggestIdx(-1); }}
          onKeyDown={handleKey}
          placeholder={busy ? 'kiran-bot is answering…' : 'ask a question, or /help'}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none',
            color: C.text, fontFamily: MONO, fontSize: 13, caretColor: C.user,
          }}
        />
        <span style={{ color: C.dim, fontSize: 11, flexShrink: 0 }} className="ask-hints">
          ↑↓ history · tab suggest · esc exit
        </span>
      </div>

      <style>{`
        .ask-cursor {
          display: inline-block; width: 8px; height: 15px; margin-left: 2px;
          vertical-align: text-bottom; background: ${C.bot};
          animation: ask-blink 1s steps(1) infinite;
        }
        @keyframes ask-blink { 50% { opacity: 0; } }
        @media (max-width: 560px) { .ask-hints { display: none; } }
      `}</style>
    </div>
  );
}

const btnReset = {
  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
  fontFamily: MONO, fontSize: 12,
} as const;
