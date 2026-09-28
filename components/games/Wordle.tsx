'use client';

import { useEffect, useMemo, useState } from 'react';
import { entryForDate, dayNumber, dateKey, WORDLE_WORDS } from '@/lib/data/wordle';

const LEN = 5;
const MAX = 6;
const MONO = "'Courier New', monospace";
const STATS_KEY = 'wordle-stats';

type Clue = 'correct' | 'present' | 'absent';

interface DayState { guesses: string[]; done: boolean; won: boolean }
interface Stats { played: number; wins: number; streak: number; best: number; lastWin: string | null }

function grade(guess: string, answer: string): Clue[] {
  const out: Clue[] = Array(LEN).fill('absent');
  const pool = answer.split('') as (string | null)[];
  for (let i = 0; i < LEN; i++) {
    if (guess[i] === answer[i]) { out[i] = 'correct'; pool[i] = null; }
  }
  for (let i = 0; i < LEN; i++) {
    if (out[i] === 'correct') continue;
    const j = pool.indexOf(guess[i]);
    if (j !== -1) { out[i] = 'present'; pool[j] = null; }
  }
  return out;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { }
  return fallback;
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
}

function yesterdayKey(today: Date) {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

const CLUE_BG: Record<Clue, string> = { correct: '#4ade80', present: '#fbbf24', absent: '#262626' };
const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', '↵ZXCVBNM⌫'];
const CS = 44, GAP = 5;

interface Props { onExit: () => void }

export default function Wordle({ onExit: _onExit }: Props) {
  const today = useMemo(() => new Date(), []);
  const entry = useMemo(() => entryForDate(today), [today]);
  const answer = entry.word;
  const day = dayNumber(today);
  const storageKey = `wordle-${dateKey(today)}`;

  const [state, setState] = useState<DayState>({ guesses: [], done: false, won: false });
  const [stats, setStats] = useState<Stats>({ played: 0, wins: 0, streak: 0, best: 0, lastWin: null });
  const [current, setCurrent] = useState('');
  const [shake, setShake] = useState(false);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setState(read(storageKey, { guesses: [], done: false, won: false }));
    setStats(read(STATS_KEY, { played: 0, wins: 0, streak: 0, best: 0, lastWin: null }));
  }, [storageKey]);

  function flash(m: string) {
    setMsg(m);
    setShake(true);
    setTimeout(() => setShake(false), 380);
    setTimeout(() => setMsg(''), 1600);
  }

  function finish(next: DayState) {
    const s = read<Stats>(STATS_KEY, { played: 0, wins: 0, streak: 0, best: 0, lastWin: null });
    const streak = next.won ? (s.lastWin === yesterdayKey(today) ? s.streak + 1 : 1) : 0;
    const updated: Stats = {
      played: s.played + 1,
      wins: s.wins + (next.won ? 1 : 0),
      streak,
      best: Math.max(s.best, streak),
      lastWin: next.won ? dateKey(today) : s.lastWin,
    };
    write(STATS_KEY, updated);
    setStats(updated);
  }

  function press(key: string) {
    if (state.done) return;
    if (key === '⌫' || key === 'BACKSPACE') { setCurrent(c => c.slice(0, -1)); return; }
    if (key === '↵' || key === 'ENTER') {
      if (current.length < LEN) { flash('not enough letters'); return; }
      if (state.guesses.includes(current)) { flash('already guessed'); return; }
      const guesses = [...state.guesses, current];
      const won = current === answer;
      const next: DayState = { guesses, won, done: won || guesses.length >= MAX };
      setState(next);
      write(storageKey, next);
      setCurrent('');
      if (next.done) finish(next);
      return;
    }
    if (/^[A-Z]$/.test(key) && current.length < LEN) setCurrent(c => c + key);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        press(key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const clues = state.guesses.map(g => grade(g, answer));

  const keyState: Record<string, Clue> = {};
  state.guesses.forEach((g, gi) => g.split('').forEach((ch, i) => {
    const c = clues[gi][i];
    const prev = keyState[ch];
    if (prev === 'correct' || (prev === 'present' && c === 'absent')) return;
    keyState[ch] = c;
  }));

  function share() {
    const grid = clues.map(r => r.map(c => c === 'correct' ? '🟩' : c === 'present' ? '🟨' : '⬛').join('')).join('\n');
    const text = `kiranbk.com wordle #${day} ${state.won ? state.guesses.length : 'X'}/${MAX}\n\n${grid}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => { });
  }

  const cell = (clue: Clue | 'empty' | 'active'): React.CSSProperties => ({
    width: CS, height: CS, borderRadius: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: MONO, fontSize: 19, fontWeight: 700,
    transition: 'background 0.2s',
    ...(clue === 'empty'
      ? { background: '#0f0f0f', border: '2px solid rgba(255,255,255,0.08)' }
      : clue === 'active'
        ? { background: '#141414', color: 'rgba(255,255,255,0.9)', border: '2px solid rgba(255,255,255,0.35)' }
        : { background: CLUE_BG[clue], color: clue === 'absent' ? 'rgba(255,255,255,0.45)' : '#0a0a0a', border: '2px solid transparent' }),
  });

  const dim = 'rgba(255,255,255,0.35)';

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, padding: '16px 22px 14px', background: '#0a0a0a', fontFamily: MONO }}>
      {/* board */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: LEN * CS + (LEN - 1) * GAP, fontSize: 12 }}>
          <span style={{ color: '#4ade80' }}>WORDLE · day {day}</span>
          <span style={{ color: dim }}>guess {Math.min(state.guesses.length + (state.done ? 0 : 1), MAX)} / {MAX}</span>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: GAP }}>
          {msg && (
            <div style={{
              position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', zIndex: 1,
              background: 'rgba(255,255,255,0.9)', color: '#0a0a0a', fontSize: 12, padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap',
            }}>{msg}</div>
          )}
          {Array.from({ length: MAX }, (_, row) => {
            const done = row < state.guesses.length;
            const active = row === state.guesses.length && !state.done;
            const word = done ? state.guesses[row] : active ? current.padEnd(LEN) : ' '.repeat(LEN);
            return (
              <div key={row} style={{ display: 'flex', gap: GAP, animation: active && shake ? 'w4shake 0.38s' : 'none' }}>
                {Array.from({ length: LEN }, (_, col) => {
                  const ch = word[col].trim();
                  const clue = done ? clues[row][col] : active && ch ? 'active' : 'empty';
                  return <div key={col} style={cell(clue)}>{ch}</div>;
                })}
              </div>
            );
          })}
        </div>

        {/* on-screen keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginTop: 2 }}>
          {KEY_ROWS.map(row => (
            <div key={row} style={{ display: 'flex', gap: 3 }}>
              {row.split('').map(k => {
                const s = keyState[k];
                const wide = k === '↵' || k === '⌫';
                return (
                  <button key={k} onClick={() => press(k)} style={{
                    width: wide ? 36 : 24, height: 30, border: 'none', borderRadius: 3, cursor: 'pointer',
                    fontFamily: MONO, fontSize: 11, fontWeight: 700,
                    background: s ? CLUE_BG[s] : 'rgba(255,255,255,0.1)',
                    color: s && s !== 'absent' ? '#0a0a0a' : s === 'absent' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)',
                  }}>{k}</button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* side panel */}
      <div style={{ flex: 1, minWidth: 220, fontSize: 12, lineHeight: '20px', color: 'rgba(255,255,255,0.6)' }}>
        {state.done ? (
          <>
            <div style={{ color: state.won ? '#4ade80' : '#f87171', fontSize: 14, marginBottom: 4 }}>
              {state.won ? `solved in ${state.guesses.length}/${MAX}` : 'out of guesses'}
              <span style={{ color: 'rgba(255,255,255,0.85)' }}> · {answer}</span>
            </div>
            <div style={{ color: '#c084fc', letterSpacing: '0.12em', marginTop: 10 }}>WHY THIS WORD</div>
            <div>{entry.blurb}</div>
            {entry.link && (
              <a href={entry.link} target={entry.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ color: '#67e8f9', textDecoration: 'none' }}>
                {entry.link.replace('https://', '')} →
              </a>
            )}

            <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
              {[['played', stats.played], ['win %', stats.played ? Math.round((stats.wins / stats.played) * 100) : 0], ['streak', stats.streak], ['best', stats.best]].map(([label, v]) => (
                <div key={label}>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>{v}</div>
                  <div style={{ color: dim, fontSize: 10 }}>{label}</div>
                </div>
              ))}
            </div>

            <button onClick={share} style={{
              marginTop: 12, background: 'none', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 3,
              color: copied ? '#4ade80' : '#fbbf24', fontFamily: MONO, fontSize: 12, padding: '3px 10px', cursor: 'pointer',
            }}>
              {copied ? '✓ copied' : '↗ share result'}
            </button>
            <div style={{ color: dim, marginTop: 10 }}>new word at midnight · esc to return</div>
          </>
        ) : (
          <>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 6 }}>about-me wordle</div>
            <div>
              Every answer is a word from my life — a project, a tool I ship with, a place I have worked.
              {' '}{WORDLE_WORDS.length} words, one per day, same for every visitor.
            </div>
            <div style={{ marginTop: 8 }}>
              The day&apos;s word comes from a seeded shuffle of the list, and progress lives in localStorage — no server involved.
            </div>
            <div style={{ marginTop: 12, border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 4, padding: '6px 10px', color: dim }}>
              shortcuts · <span style={{ color: '#fbbf24' }}>↵</span> submit · <span style={{ color: '#fbbf24' }}>⌫</span> back · <span style={{ color: '#fbbf24' }}>esc</span> exit
            </div>
            <div style={{ marginTop: 10, color: dim, fontSize: 11 }}>
              <span style={{ color: '#4ade80' }}>■</span> right spot · <span style={{ color: '#fbbf24' }}>■</span> wrong spot · <span style={{ color: '#525252' }}>■</span> not in word
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes w4shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
