'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';

type Line = { type: 'input' | 'output' | 'error' | 'dim'; text: string };

const BOOT: Line[] = [
  { type: 'dim',    text: 'kiranbk.com — interactive shell' },
  { type: 'dim',    text: "type 'help' for commands" },
];

const CMDS: Record<string, () => Line[]> = {
  help: () => [
    { type: 'output', text: 'commands:' },
    { type: 'output', text: '  about       — who I am' },
    { type: 'output', text: '  experience  — work history' },
    { type: 'output', text: '  projects    — what I\'ve built' },
    { type: 'output', text: '  skills      — tech stack' },
    { type: 'output', text: '  contact     — get in touch' },
    { type: 'output', text: '  clear       — clear screen' },
    { type: 'output', text: '  exit        — close terminal' },
  ],
  about: () => [
    { type: 'output', text: 'Kiran BK — Software Engineer + AI/ML' },
    { type: 'output', text: 'Honors CS @ UMass Amherst, Class of 2027' },
    { type: 'dim',    text: 'Building systems at the seam of engineering and applied AI.' },
    { type: 'dim',    text: 'Open to Summer 2026 internships.' },
  ],
  experience: () => [
    { type: 'output', text: 'Alterea            Software Developer       Jan 2026–Present' },
    { type: 'output', text: 'LeeYuen Housewares  SWE Intern               Jun–Aug 2025' },
    { type: 'output', text: 'TruBridge          Data Science Intern       Dec 2024–Feb 2025' },
    { type: 'output', text: 'Zyntra.io          SWE Intern               Jul–Aug 2024' },
    { type: 'output', text: 'BUILD UMass        SWE + Treasurer          Sep 2024–Present' },
  ],
  projects: () => [
    { type: 'output', text: 'Dopamine Drop       Canvas LMS gamification — convex + next.js' },
    { type: 'output', text: 'StudyLens AI        RAG study platform — openai + next.js' },
    { type: 'output', text: 'Kapok               Offline disaster relief — flutter + firebase' },
    { type: 'output', text: 'WC 2026 Predictor   ML pipeline — xgboost + monte carlo' },
    { type: 'output', text: 'Keepo               AI receipt tracker — dual LLM agents' },
  ],
  skills: () => [
    { type: 'dim',    text: 'Languages:' },
    { type: 'output', text: '  Python  TypeScript  Java  Dart  C  SQL' },
    { type: 'dim',    text: 'Frameworks:' },
    { type: 'output', text: '  React  Next.js  Spring Boot  Flutter  FastAPI' },
    { type: 'dim',    text: 'Infra:' },
    { type: 'output', text: '  AWS  Docker  Firebase  PostgreSQL  MongoDB  Convex' },
    { type: 'dim',    text: 'AI/ML:' },
    { type: 'output', text: '  PyTorch  LangGraph  Claude API  OpenAI  scikit-learn' },
  ],
  contact: () => [
    { type: 'output', text: 'email     kiranbk1704@gmail.com' },
    { type: 'output', text: 'github    github.com/bk-kiran' },
    { type: 'output', text: 'linkedin  linkedin.com/in/bk-kiran' },
    { type: 'output', text: 'web       kiranbk.com' },
  ],
};

interface Props { onClose: () => void }

export default function Terminal({ onClose }: Props) {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // ESC key closes
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const echo: Line = { type: 'input', text: `> ${raw}` };

    if (!cmd) { setLines(l => [...l, echo]); setInput(''); return; }

    if (cmd === 'clear') {
      setLines(BOOT);
      setInput('');
      setHistory(h => [raw, ...h]);
      setHistIdx(-1);
      return;
    }
    if (cmd === 'exit') { onClose(); return; }

    const result: Line[] = CMDS[cmd]
      ? CMDS[cmd]()
      : [{ type: 'error', text: `command not found: ${cmd}. try 'help'` }];

    setLines(l => [...l, echo, ...result]);
    setHistory(h => [raw, ...h]);
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
    : t === 'dim'   ? 'rgba(255,255,255,0.35)'
    : '#4ade80';

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
            kiran@portfolio — zsh
          </span>
          <button
            onClick={onClose}
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

        {/* Output */}
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
      </div>
    </div>
  );
}
