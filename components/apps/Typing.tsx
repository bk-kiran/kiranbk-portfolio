'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const APP_EXIT_EVENT = 'portfolio:app-exit';

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

function pickQuote(lastIdx: number): { quote: (typeof QUOTES)[0]; idx: number } {
  let idx = Math.floor(Math.random() * QUOTES.length);
  if (idx === lastIdx) idx = (idx + 1) % QUOTES.length;
  return { quote: QUOTES[idx], idx };
}

interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
}

export default function Typing() {
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [quote, setQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalStats, setFinalStats] = useState<Stats | null>(null);
  const activeRef = useRef(true);

  // Live timer
  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => setElapsed(Date.now() - startTime), 500);
    return () => clearInterval(id);
  }, [startTime, finished]);

  function restart() {
    const { quote: q, idx } = pickQuote(quoteIdx);
    setQuote(q);
    setQuoteIdx(idx);
    setTyped('');
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    setFinalStats(null);
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeRef.current) return;

    if (e.key === 'Escape') {
      activeRef.current = false;
      window.dispatchEvent(new CustomEvent(APP_EXIT_EVENT));
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      restart();
      return;
    }

    if (finished) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped(prev => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      setTyped(prev => {
        const next = prev + e.key;
        if (!startTime) setStartTime(Date.now());

        if (next.length === quote.text.length) {
          const secs = startTime ? (Date.now() - startTime) / 1000 : 0;
          const correct = next.split('').filter((c, i) => c === quote.text[i]).length;
          const wpm = secs > 0 ? Math.round((correct / 5) / (secs / 60)) : 0;
          const accuracy = next.length > 0 ? Math.round((correct / next.length) * 1000) / 10 : 100;
          setFinished(true);
          setFinalStats({ wpm, accuracy, time: Math.round(secs) });
          setElapsed(Date.now() - (startTime ?? Date.now()));
        }

        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, quote.text, startTime]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const elapsedSec = Math.floor(elapsed / 1000);
  const correctSoFar = typed.split('').filter((c, i) => c === quote.text[i]).length;
  const liveWpm = startTime && elapsed > 0
    ? Math.round((correctSoFar / 5) / ((elapsed / 1000) / 60))
    : 0;
  const liveAcc = typed.length > 0
    ? Math.round((correctSoFar / typed.length) * 100)
    : 100;

  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-4" style={{ maxWidth: 640 }}>
      {/* Quote display */}
      <div
        className="text-sm leading-relaxed"
        style={{ lineHeight: 1.8, letterSpacing: '0.01em' }}
        aria-label="quote text"
      >
        {quote.text.split('').map((char, i) => {
          let color: string;
          let extra: React.CSSProperties = {};

          if (i < typed.length) {
            color = typed[i] === char ? 'var(--color-green)' : 'var(--color-red)';
          } else if (i === typed.length && !finished) {
            color = 'var(--color-text)';
            extra = { borderBottom: '2px solid var(--color-cyan)', paddingBottom: '1px' };
          } else {
            color = 'var(--color-text-dim)';
          }

          return (
            <span key={i} style={{ color, ...extra }}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Live stats bar */}
      {!finished && (
        <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-cyan)' }}>WPM: {liveWpm}</span>
          {' · '}
          <span>Accuracy: {liveAcc}%</span>
          {' · '}
          <span>Time: {timeStr}</span>
          {' · '}
          <span>Tab to restart · Esc to exit</span>
        </div>
      )}

      {/* Results */}
      {finished && finalStats && (
        <div className="space-y-1 text-xs">
          <div style={{ color: 'var(--color-text-dim)' }}>{'// completed'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '11ch 1fr', gap: '2px', lineHeight: 1.8 }}>
            <span style={{ color: 'var(--color-cyan)' }}>WPM:</span>
            <span style={{ color: 'var(--color-green)', fontWeight: 700 }}>{finalStats.wpm}</span>
            <span style={{ color: 'var(--color-cyan)' }}>Accuracy:</span>
            <span style={{ color: 'var(--color-text)' }}>{finalStats.accuracy}%</span>
            <span style={{ color: 'var(--color-cyan)' }}>Time:</span>
            <span style={{ color: 'var(--color-text)' }}>{finalStats.time}s</span>
            <span style={{ color: 'var(--color-cyan)' }}>Quote by:</span>
            <span style={{ color: 'var(--color-text-dim)' }}>{quote.author}</span>
          </div>
          <div className="mt-2" style={{ color: 'var(--color-text-dim)' }}>
            {'Tab to play again · Esc to exit'}
          </div>
        </div>
      )}
    </div>
  );
}
