'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PASSAGES = [
  'the quick brown fox jumps over the lazy dog',
  'a software engineer writes code that speaks without words',
  'pack my box with five dozen liquor jugs',
  'type fast but always think before you build',
  'good code is its own best documentation',
  'simplicity is the ultimate sophistication in software design',
  'every great developer you know got there by solving problems',
  'move fast and build things that actually matter',
  'the best error message is the one that never shows up',
  'first make it work then make it right then make it fast',
];

const pick = () => PASSAGES[Math.floor(Math.random() * PASSAGES.length)];

function calcWpm(chars: number, ms: number) {
  return ms < 500 ? 0 : Math.round((chars / 5) / (ms / 60000));
}

type Phase = 'idle' | 'typing' | 'done';
interface Props { onExit: () => void }

export default function Typing({ onExit }: Props) {
  const [passage, setPassage] = useState(pick);
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
    setPassage(pick());
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
