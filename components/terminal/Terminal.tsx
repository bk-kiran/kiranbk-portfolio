'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import Wordle from '@/components/games/Wordle';
import Typing from '@/components/games/Typing';
import Snake from '@/components/games/Snake';

type Line = { type: 'input' | 'output' | 'error' | 'dim'; text: string };

const BOOT: Line[] = [
  { type: 'dim', text: 'kiranbk.com — interactive shell' },
  { type: 'dim', text: "type 'help' for commands" },
];

type AppKey = 'wordle' | 'typing' | 'snake';

const APPS: { key: AppKey; label: string }[] = [
  { key: 'wordle', label: 'wordle' },
  { key: 'typing', label: 'type test' },
  { key: 'snake', label: 'snake' },
];

const STORAGE_LINES = 'terminal-lines';
const STORAGE_HISTORY = 'terminal-history';

function loadLines(): Line[] {
  try {
    const raw = localStorage.getItem(STORAGE_LINES);
    if (raw) return JSON.parse(raw) as Line[];
  } catch { }
  return BOOT;
}

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { }
  return [];
}

interface Props { onClose: () => void }

export default function Terminal({ onClose }: Props) {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [ready, setReady] = useState(false);
  const [activeGame, setActiveGame] = useState<AppKey | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines(loadLines());
    setHistory(loadHistory());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_LINES, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
  }, [history, ready]);

  useEffect(() => {
    if (!activeGame) inputRef.current?.focus();
  }, [activeGame]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeGame) setActiveGame(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, activeGame]);

  function run(raw: string) {
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();
    const echo: Line = { type: 'input', text: `> ${trimmed}` };

    if (!trimmed) { setLines(l => [...l, echo]); setInput(''); return; }

    if (lower === 'clear') {
      setLines(BOOT);
      localStorage.setItem(STORAGE_LINES, JSON.stringify(BOOT));
      setInput('');
      setHistory(h => [trimmed, ...h]);
      setHistIdx(-1);
      return;
    }

    if (lower === 'exit') { onClose(); return; }

    let result: Line[];

    if (lower === 'help') {
      result = [
        { type: 'output', text: 'commands:' },
        { type: 'output', text: '  ask <question>  — ask the RAG bot anything about me' },
        { type: 'output', text: '  apps            — list mini apps' },
        { type: 'output', text: '  run <app>       — launch a mini app' },
        { type: 'output', text: '  contact         — get in touch' },
        { type: 'output', text: '  clear           — clear screen' },
        { type: 'output', text: '  exit            — close terminal' },
      ];

    } else if (lower === 'contact') {
      result = [
        { type: 'output', text: 'email     kiranbk1704@gmail.com' },
        { type: 'output', text: 'github    github.com/bk-kiran' },
        { type: 'output', text: 'linkedin  linkedin.com/in/bk-kiran' },
        { type: 'output', text: 'web       kiranbk.com' },
      ];

    } else if (lower === 'apps') {
      result = [
        { type: 'output', text: 'mini apps:' },
        ...APPS.map(a => ({ type: 'output' as const, text: `  ${a.key.padEnd(10)} — ${a.label}` })),
        { type: 'dim', text: "use 'run <app>' to launch" },
      ];

    } else if (lower.startsWith('ask ')) {
      const question = trimmed.slice(4).trim();
      if (!question) {
        result = [{ type: 'error', text: 'usage: ask <question>' }];
      } else {
        result = [
          { type: 'dim', text: 'thinking...' },
          { type: 'output', text: 'RAG bot coming soon — will answer: "' + question + '"' },
        ];
      }

    } else if (lower.startsWith('run ')) {
      const key = lower.slice(4).trim() as AppKey;
      const app = APPS.find(a => a.key === key);
      if (!app) {
        const known = APPS.map(a => a.key).join(', ');
        result = [
          { type: 'error', text: `unknown app: ${key}` },
          { type: 'dim', text: `available: ${known}` },
        ];
      } else {
        result = [{ type: 'dim', text: `launching ${app.label}… (esc to return)` }];
        setTimeout(() => setActiveGame(app.key), 80);
      }

    } else {
      result = [{ type: 'error', text: `command not found: ${lower}. try 'help'` }];
    }

    setLines(l => [...l, echo, ...result]);
    setHistory(h => [trimmed, ...h]);
    setHistIdx(-1);
    setInput('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
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

  const lineColor = (t: Line['type']) =>
    t === 'input' ? 'rgba(255,255,255,0.75)'
      : t === 'error' ? '#f87171'
        : t === 'dim' ? 'rgba(255,255,255,0.35)'
          : '#4ade80';

  const GameComponent =
    activeGame === 'wordle' ? Wordle :
      activeGame === 'typing' ? Typing :
        activeGame === 'snake' ? Snake : null;

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
        width: '100%', maxWidth: 700,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 32px 96px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column',
        background: '#0a0a0a',
        margin: '0 24px',
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
            {activeGame
              ? `kiran@portfolio — ${APPS.find(a => a.key === activeGame)?.label}`
              : 'kiran@portfolio — zsh'}
          </span>
          <button
            onClick={activeGame ? () => setActiveGame(null) : onClose}
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

        {/* Game view */}
        {GameComponent ? (
          <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column' }}>
            <GameComponent onExit={() => setActiveGame(null)} />
          </div>
        ) : (
          <>
            {/* Terminal output */}
            <div
              onClick={() => inputRef.current?.focus()}
              style={{
                flex: 1, overflowY: 'auto',
                padding: '18px 20px 4px',
                cursor: 'text',
                minHeight: 260, maxHeight: 380,
              }}
            >
              {lines.map((line, i) => (
                <div key={i} style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13, lineHeight: '22px',
                  color: lineColor(line.type),
                  whiteSpace: 'pre',
                }}>
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{
              padding: '6px 20px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                color: '#4ade80', fontFamily: "'Courier New', monospace",
                fontSize: 13, flexShrink: 0, userSelect: 'none',
              }}>
                &gt;
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, background: 'none',
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
