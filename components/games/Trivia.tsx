'use client';

import { useEffect, useState } from 'react';
import { allQuestions } from '@/lib/data/trivia';

const ROUND = 5;
const BEST_KEY = 'trivia-best';
const SEEN_KEY = 'trivia-seen';
const MONO = "'Courier New', monospace";

interface Q { id: string; q: string; options: string[]; correct: number; fact: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Question "type" for round variety: handwritten, or the generator kind (g:<kind>:…).
const kindOf = (id: string) => (id.startsWith('h:') ? 'h' : id.split(':')[1]);
const KIND_CAP: Record<string, number> = { h: 3 };

function readSeen(): string[] {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[]; } catch { return []; }
}

/**
 * Pick ROUND questions the player hasn't seen yet (cycling once the pool runs dry),
 * with at most one question per generated kind so rounds stay varied.
 */
function newRound(): { round: Q[]; seenCount: number; total: number } {
  const all = allQuestions();
  let seen = new Set(readSeen().filter(id => all.some(q => q.id === id)));
  if (all.length - seen.size < ROUND) seen = new Set();

  const kinds: Record<string, number> = {};
  const picked = [];
  for (const q of shuffle(all.filter(q => !seen.has(q.id)))) {
    const k = kindOf(q.id);
    if ((kinds[k] ?? 0) >= (KIND_CAP[k] ?? 1)) continue;
    kinds[k] = (kinds[k] ?? 0) + 1;
    picked.push(q);
    if (picked.length === ROUND) break;
  }

  // Starting a fresh cycle clears the stored list; answered questions are added in markSeen.
  if (seen.size === 0) {
    try { localStorage.setItem(SEEN_KEY, '[]'); } catch { }
  }

  return {
    round: picked.map(t => {
      const order = shuffle(t.options.map((_, i) => i));
      return { id: t.id, q: t.q, options: order.map(i => t.options[i]), correct: order.indexOf(t.answer), fact: t.fact };
    }),
    seenCount: seen.size,
    total: all.length,
  };
}

function markSeen(id: string): number {
  const seen = new Set(readSeen());
  seen.add(id);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch { }
  return seen.size;
}

interface Props { onExit: () => void }

export default function Trivia({ onExit: _onExit }: Props) {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [progress, setProgress] = useState({ seen: 0, total: 0 });

  function startRound() {
    const { round, seenCount, total } = newRound();
    setQuestions(round);
    setProgress({ seen: seenCount, total });
  }

  useEffect(() => {
    startRound();
    try { setBest(Number(localStorage.getItem(BEST_KEY)) || 0); } catch { }
  }, []);

  const finished = questions.length > 0 && idx >= questions.length;
  const current = questions[idx];

  function choose(i: number) {
    if (picked !== null || !current) return;
    setPicked(i);
    if (i === current.correct) setScore(s => s + 1);
    const seenCount = markSeen(current.id);
    setProgress(p => ({ ...p, seen: seenCount }));
  }

  function next() {
    if (picked === null) return;
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setPicked(null);
    if (nextIdx >= questions.length) {
      const final = score;
      if (final > best) {
        setBest(final);
        try { localStorage.setItem(BEST_KEY, String(final)); } catch { }
      }
    }
  }

  function restart() {
    startRound();
    setIdx(0);
    setPicked(null);
    setScore(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) {
        if (e.key === 'Enter') restart();
        return;
      }
      if (/^[1-4]$/.test(e.key)) choose(Number(e.key) - 1);
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const dim = 'rgba(255,255,255,0.35)';

  if (!current && !finished) return null;

  if (finished) {
    const verdict =
      score === ROUND ? 'perfect — you might know Kiran better than kiran-bot does.'
        : score >= 3 ? 'solid. you clearly read the résumé.'
          : 'try `ask` in the terminal and come back for a rematch.';
    return (
      <div style={{ padding: '28px 26px', fontFamily: MONO, textAlign: 'center', background: '#0a0a0a' }}>
        <div style={{ color: '#c084fc', letterSpacing: '0.12em', fontSize: 12 }}>HOW WELL DO YOU KNOW KIRAN?</div>
        <div style={{ color: '#4ade80', fontSize: 40, fontWeight: 700, margin: '14px 0 6px' }}>
          {score}<span style={{ fontSize: 16, color: dim }}> / {ROUND}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{verdict}</div>
        <div style={{ color: dim, fontSize: 12, marginTop: 10 }}>best: {best} / {ROUND}</div>
        <div style={{ color: dim, fontSize: 12, marginTop: 4 }}>
          {progress.seen} of {progress.total} questions seen · {progress.total - progress.seen >= ROUND ? 'next round is all new' : 'next round starts a fresh cycle'}
        </div>
        <div style={{ color: dim, fontSize: 11, marginTop: 16 }}>enter to play again · esc to return</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '18px 26px 16px', fontFamily: MONO, background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ color: '#c084fc', letterSpacing: '0.12em' }}>TRIVIA · {idx + 1}/{questions.length}</span>
        <span style={{ color: dim }}>score {score} · best {best}</span>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: '24px', margin: '16px 0 14px' }}>
        {current.q}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correct;
          const revealed = picked !== null;
          const border = revealed && isCorrect ? '#4ade80'
            : revealed && i === picked ? '#f87171'
              : 'rgba(255,255,255,0.12)';
          const color = revealed && isCorrect ? '#4ade80'
            : revealed && i === picked ? '#f87171'
              : 'rgba(255,255,255,0.8)';
          return (
            <button key={opt} onClick={() => choose(i)} disabled={revealed} style={{
              textAlign: 'left', background: revealed && isCorrect ? 'rgba(74,222,128,0.08)' : 'transparent',
              border: `1px solid ${border}`, borderRadius: 4, padding: '8px 12px',
              color, fontFamily: MONO, fontSize: 13, cursor: revealed ? 'default' : 'pointer',
            }}>
              <span style={{ color: '#fbbf24', marginRight: 10 }}>{i + 1}</span>{opt}
            </button>
          );
        })}
      </div>

      <div style={{ minHeight: 44, marginTop: 12, fontSize: 12, lineHeight: '19px' }}>
        {picked !== null ? (
          <>
            <span style={{ color: picked === current.correct ? '#4ade80' : '#f87171' }}>
              {picked === current.correct ? '✓ correct. ' : '✗ not quite. '}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{current.fact}</span>
            <div style={{ color: dim, marginTop: 4 }}>enter for {idx + 1 < questions.length ? 'next question' : 'your score'}</div>
          </>
        ) : (
          <span style={{ color: dim }}>press 1–4 or click an answer · esc to return</span>
        )}
      </div>
    </div>
  );
}
