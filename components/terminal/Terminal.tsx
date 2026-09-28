'use client';

import { useState, useEffect, useRef, type ComponentType, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import AskShell from '@/components/terminal/AskCommand';
import { AppKey, Line, complete, runCommand } from '@/components/terminal/commands';
import Wordle from '@/components/games/Wordle';
import Typing from '@/components/games/Typing';
import Snake from '@/components/games/Snake';
import Matrix from '@/components/games/Matrix';
import Trivia from '@/components/games/Trivia';

const BOOT: Line[] = [
  { type: 'dim', text: 'kiranbk.com — interactive shell' },
  { type: 'dim', text: "type 'help' for commands · 'ask' to chat with kiran-bot · 'run wordle' for today's puzzle" },
];

const GAMES: Record<AppKey, ComponentType<{ onExit: () => void }>> = {
  wordle: Wordle,
  typing: Typing,
  snake: Snake,
  matrix: Matrix,
  trivia: Trivia,
};

type Mode = { kind: 'shell' } | { kind: 'ask'; question?: string } | { kind: 'app'; app: AppKey };

const STORAGE_LINES = 'terminal-lines';
const STORAGE_HISTORY = 'terminal-history';
const MAX_LINES = 400;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { }
  return fallback;
}

const lineColor: Record<Line['type'], string> = {
  input: 'rgba(255,255,255,0.75)',
  output: '#4ade80',
  error: '#f87171',
  dim: 'rgba(255,255,255,0.35)',
  accent: '#67e8f9',
  heading: '#c084fc',
};

interface Props { onClose: () => void }

export default function Terminal({ onClose }: Props) {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: 'shell' });
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines(load(STORAGE_LINES, BOOT));
    setHistory(load(STORAGE_HISTORY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_LINES, JSON.stringify(lines.slice(-MAX_LINES))); } catch { }
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history.slice(0, 100))); } catch { }
  }, [history, ready]);

  useEffect(() => {
    if (mode.kind === 'shell') inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lines, mode]);

  // Esc: leave the current app, or close the terminal from the shell.
  // (The ask sub-shell handles its own Esc so it can write a summary line.)
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mode.kind === 'app') setMode({ kind: 'shell' });
      else if (mode.kind === 'shell') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, mode]);

  function backToShell(summary?: string) {
    if (summary) setLines(l => [...l, { type: 'dim', text: summary }]);
    setMode({ kind: 'shell' });
  }

  function run(raw: string) {
    const trimmed = raw.trim();
    setInput('');
    setHistIdx(-1);
    const echo: Line = { type: 'input', text: `$ ${trimmed}` };
    if (!trimmed) { setLines(l => [...l, echo]); return; }

    setHistory(h => (h[0] === trimmed ? h : [trimmed, ...h]));

    let cleared = false;
    const result = runCommand(trimmed, {
      enterAsk: question => setMode({ kind: 'ask', question }),
      launch: app => setTimeout(() => setMode({ kind: 'app', app }), 80),
      clear: () => { cleared = true; },
      close: onClose,
    });

    if (cleared) setLines(BOOT);
    else setLines(l => [...l, echo, ...result]);
  }

  function handleKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const completion = complete(input);
      if (completion) setInput(completion);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (next < 0) return;
      setHistIdx(next);
      setInput(history[next] ?? '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(next); setInput(history[next]); }
    }
  }

  const Game = mode.kind === 'app' ? GAMES[mode.app] : null;
  const cwd = mode.kind === 'ask' ? '~/ask' : mode.kind === 'app' ? `~/apps/${mode.app}` : '~';

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div style={{
        width: '100%', maxWidth: 760,
        maxHeight: 'calc(100vh - 32px)',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 32px 96px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column',
        background: '#0a0a0a',
        margin: '0 16px',
      }}>

        {/* Title bar */}
        <div style={{
          background: '#141414',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 12, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em',
          }}>
            kiran@portfolio: {cwd}
          </span>
          <button
            onClick={() => {
              if (mode.kind === 'shell') onClose();
              else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3, cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 10, fontFamily: 'monospace',
              padding: '2px 9px', letterSpacing: '0.08em',
            }}
          >
            ESC
          </button>
        </div>

        {Game ? (
          <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <Game onExit={() => backToShell()} />
          </div>
        ) : mode.kind === 'ask' ? (
          <AskShell initialQuestion={mode.question} onExit={backToShell} />
        ) : (
          <>
            {/* Terminal output */}
            <div
              onClick={() => inputRef.current?.focus()}
              style={{
                flex: 1, overflowY: 'auto',
                padding: '18px 20px 4px',
                cursor: 'text',
                minHeight: 260, maxHeight: 420,
              }}
            >
              {lines.map((line, i) => {
                const style = {
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13, lineHeight: '22px',
                  color: lineColor[line.type],
                  whiteSpace: 'pre-wrap' as const,
                  paddingLeft: line.indent ? `${line.indent}ch` : undefined,
                  fontWeight: line.type === 'heading' ? 700 : undefined,
                  minHeight: 22,
                };
                return line.href ? (
                  <a key={i} href={line.href} target="_blank" rel="noreferrer"
                    style={{ ...style, display: 'block', textDecoration: 'none' }}>
                    {line.text}
                  </a>
                ) : (
                  <div key={i} style={style}>{line.text}</div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{
              padding: '6px 20px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 13, flexShrink: 0, userSelect: 'none',
              }}>
                <span style={{ color: '#4ade80' }}>kiran</span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>@</span>
                <span style={{ color: '#67e8f9' }}>portfolio</span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}> ~ </span>
                <span style={{ color: '#c084fc' }}>$</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="off"
                spellCheck={false}
                aria-label="terminal input"
                style={{
                  flex: 1, minWidth: 0, background: 'none',
                  border: 'none', outline: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13, caretColor: '#4ade80',
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

