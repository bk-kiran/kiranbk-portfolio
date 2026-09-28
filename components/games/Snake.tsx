'use client';

import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';

const COLS = 20, ROWS = 16, CELL = 16, SPEED = 130;
type Pt = { x: number; y: number };
type Dir = 'U' | 'D' | 'L' | 'R';
const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
const KEY: Record<string, Dir> = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' };

function randFood(snake: Pt[]): Pt {
  let p: Pt;
  do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

type Phase = 'idle' | 'playing' | 'dead';
interface Props { onExit: () => void }

export default function Snake({ onExit }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const gameRef    = useRef({ snake: [] as Pt[], dir: 'R' as Dir, nextDir: 'R' as Dir, food: { x: 15, y: 8 } as Pt });
  const [score, setScore]       = useState(0);
  const [phase, setPhase]       = useState<Phase>('idle');
  const [restartKey, setRestart] = useState(0);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { snake, food } = gameRef.current;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#4ade80' : `rgba(74,222,128,${Math.max(0.2, 1 - i * 0.04)})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  // init / restart
  useEffect(() => {
    const init = [{ x: 10, y: 8 }];
    gameRef.current = { snake: init, dir: 'R', nextDir: 'R', food: { x: 15, y: 8 } };
    setScore(0);
    draw();
  }, [restartKey, draw]);

  // game tick
  useEffect(() => {
    if (phase !== 'playing') return;
    let alive = true;
    const id = setInterval(() => {
      if (!alive) return;
      const s = gameRef.current;
      s.dir = s.nextDir;
      const head = { ...s.snake[0] };
      if (s.dir === 'U') head.y--;
      if (s.dir === 'D') head.y++;
      if (s.dir === 'L') head.x--;
      if (s.dir === 'R') head.x++;
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          s.snake.some(p => p.x === head.x && p.y === head.y)) {
        alive = false;
        setPhase('dead');
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.food = randFood(s.snake);
        setScore(n => n + 1);
      } else {
        s.snake.pop();
      }
      draw();
    }, SPEED);
    return () => { alive = false; clearInterval(id); };
  }, [phase, draw]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = KEY[e.key];
      if (d) {
        e.preventDefault();
        if (d !== OPP[gameRef.current.dir]) gameRef.current.nextDir = d;
        if (phase === 'idle') setPhase('playing');
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'dead') {
        setPhase('idle');
        setRestart(k => k + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 10px', gap: 8, background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: COLS * CELL, fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>snake</span>
        <span style={{ color: '#4ade80' }}>score: {score}</span>
      </div>
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
          style={{ display: 'block', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }} />
        {phase === 'idle' && (
          <Overlay>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 12 }}>
              press arrow key to start
            </span>
          </Overlay>
        )}
        {phase === 'dead' && (
          <Overlay>
            <span style={{ color: '#f87171', fontFamily: 'monospace', fontSize: 14 }}>game over</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: 11, marginTop: 6 }}>
              score: {score} — space to restart
            </span>
          </Overlay>
        )}
      </div>
      <span style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', fontSize: 11 }}>esc — back to terminal</span>
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 3,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,10,10,0.75)',
    }}>
      {children}
    </div>
  );
}
