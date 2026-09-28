'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const QUOTES = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "The way to get startup ideas is to look for problems, preferably problems you have yourself.", author: "Paul Graham" },
  { text: "The most dangerous phrase in the language is: we've always done it this way.", author: "Grace Hopper" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger Dijkstra" },
  { text: "Concurrency is not parallelism.", author: "Rob Pike" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.", author: "Brian Kernighan" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Most of you are familiar with the virtues of a programmer: laziness, impatience, and hubris.", author: "Larry Wall" },
  { text: "The hottest new programming language is English.", author: "Andrej Karpathy" },
  { text: "Software 2.0 is code written by optimization rather than by humans.", author: "Andrej Karpathy" },
  { text: "Optimize for happiness.", author: "David Heinemeier Hansson" },
  { text: "Build something people want. Ship it. Iterate.", author: "Pieter Levels" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "I designed Ruby to make programmers happy.", author: "Yukihiro Matsumoto" },
  { text: "The bearing of a child takes nine months, no matter how many women are assigned. Many software tasks have this same character.", author: "Fred Brooks" },
  { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

type Quote = (typeof QUOTES)[number];
const pick = (): Quote => QUOTES[Math.floor(Math.random() * QUOTES.length)];

function calcWpm(chars: number, ms: number) {
  return ms < 500 ? 0 : Math.round((chars / 5) / (ms / 60000));
}

type Phase = 'idle' | 'typing' | 'done';
interface Props { onExit: () => void }

export default function Typing({ onExit }: Props) {
  const [quote,   setQuote]   = useState(pick);
  const passage = quote.text;
  const [typed,   setTyped]   = useState('');
  const [errors,  setErrors]  = useState(0);
  const [phase,   setPhase]   = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0);
  const startRef  = useRef<number | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { wrapRef.current?.focus(); }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const restart = useCallback(() => {
    stopTimer();
    startRef.current = null;
    setQuote(q => { let n = pick(); while (n === q) n = pick(); return n; });
    setTyped('');
    setErrors(0);
    setPhase('idle');
    setElapsed(0);
    setTimeout(() => wrapRef.current?.focus(), 0);
  }, [stopTimer]);

  // cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (phase === 'done') {
      if (e.key === 'Enter') restart();
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped(t => t.slice(0, -1));
      return;
    }
    if (e.key.length !== 1) return;

    setTyped(prev => {
      if (prev.length >= passage.length) return prev;

      if (!startRef.current) {
        startRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setElapsed(Date.now() - startRef.current!);
        }, 80);
        setPhase('typing');
      }

      const next = prev + e.key;
      let err = 0;
      for (let i = 0; i < next.length; i++) {
        if (next[i] !== passage[i]) err++;
      }
      setErrors(err);

      if (next.length === passage.length) {
        stopTimer();
        setElapsed(Date.now() - startRef.current!);
        setPhase('done');
      }

      return next;
    });
  }

  const wpm = calcWpm(typed.length, elapsed);
  const acc = typed.length > 0 ? Math.round(((typed.length - errors) / typed.length) * 100) : 100;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => wrapRef.current?.focus()}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 24px 12px', gap: 12, background: '#0a0a0a',
        outline: 'none', cursor: 'text', width: '100%', boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ color: '#4ade80' }}>type test</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>
          {phase === 'idle' ? 'start typing' : `${wpm} wpm · ${acc}%`}
        </span>
      </div>

      {/* passage */}
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: 15, lineHeight: '28px',
        width: '100%', userSelect: 'none', letterSpacing: '0.02em',
      }}>
        {passage.split('').map((ch, i) => {
          let color: string;
          let bg = 'transparent';
          if (i < typed.length) {
            if (typed[i] === ch) { color = '#4ade80'; }
            else { color = '#f87171'; bg = 'rgba(248,113,113,0.12)'; }
          } else if (i === typed.length) {
            color = 'rgba(255,255,255,0.85)';
          } else {
            color = 'rgba(255,255,255,0.22)';
          }
          return (
            <span key={i} style={{
              color, background: bg,
              borderBottom: i === typed.length ? '2px solid #4ade80' : '2px solid transparent',
            }}>
              {ch}
            </span>
          );
        })}
      </div>

      <div style={{ alignSelf: 'flex-end', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
        — {quote.author}
      </div>

      {phase === 'done' ? (
        <div style={{ textAlign: 'center', fontFamily: 'monospace', marginTop: 4 }}>
          <div style={{ fontSize: 32, color: '#4ade80', fontWeight: 700, lineHeight: 1 }}>
            {wpm}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4 }}>wpm</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
            accuracy: {acc}% · time: {(elapsed / 1000).toFixed(1)}s
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>enter to try again</div>
        </div>
      ) : (
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start' }}>
          {typed.length}/{passage.length}
        </div>
      )}

      <span style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', fontSize: 11 }}>esc — back to terminal</span>
    </div>
  );
}
