'use client';

import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';

const COLS = 20, ROWS = 16, CELL = 16;
const BASE_SPEED = 140, MIN_SPEED = 70;
const LEADERBOARD_KEY = 'snake-leaderboard';
type Pt = { x: number; y: number };
type Dir = 'U' | 'D' | 'L' | 'R';
const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
const KEY: Record<string, Dir> = {
  ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R',
  w: 'U', s: 'D', a: 'L', d: 'R', W: 'U', S: 'D', A: 'L', D: 'R',
};

// Speeds up every 5 food.
const speedFor = (score: number) => Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / 5) * 10);

interface Entry { score: number; date: string }

function loadBoard(): Entry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) return JSON.parse(raw) as Entry[];
  } catch { }
  return [];
}

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
  const [board, setBoard]       = useState<Entry[]>([]);
  const [newBest, setNewBest]   = useState(false);
  const scoreRef = useRef(0);

  useEffect(() => { setBoard(loadBoard()); }, []);

  const recordScore = useCallback((final: number) => {
    if (final === 0) return;
    const prev = loadBoard();
    const next = [...prev, { score: final, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setNewBest(final > (prev[0]?.score ?? 0));
    setBoard(next);
    try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next)); } catch { }
  }, []);

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
    scoreRef.current = 0;
    setNewBest(false);
    draw();
  }, [restartKey, draw]);

  // game tick — a setTimeout chain so the speed can change as the score grows
  useEffect(() => {
    if (phase !== 'playing') return;
    let alive = true;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
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
        recordScore(scoreRef.current);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.food = randFood(s.snake);
        scoreRef.current += 1;
        setScore(scoreRef.current);
      } else {
        s.snake.pop();
      }
      draw();
      id = setTimeout(tick, speedFor(scoreRef.current));
    };
    id = setTimeout(tick, speedFor(scoreRef.current));
    return () => { alive = false; clearTimeout(id); };
  }, [phase, draw, recordScore]);

  const steer = useCallback((d: Dir) => {
    if (d !== OPP[gameRef.current.dir]) gameRef.current.nextDir = d;
    if (phase === 'idle') setPhase('playing');
  }, [phase]);

  const restart = useCallback(() => {
    setPhase('idle');
    setRestart(k => k + 1);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = KEY[e.key];
      if (d) {
        e.preventDefault();
        steer(d);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'dead') restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, steer, restart]);

  // touch: swipe on the board, or use the on-screen d-pad
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    if (phase === 'dead') { restart(); return; }
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x, dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 10px', gap: 8, background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: COLS * CELL, fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>snake</span>
        <span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>best {board[0]?.score ?? 0} · </span>
          <span style={{ color: '#4ade80' }}>score: {score}</span>
        </span>
      </div>
      <div style={{ position: 'relative', touchAction: 'none' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
          style={{ display: 'block', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }} />
        {phase === 'idle' && (
          <Overlay>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 12 }}>
              arrow keys / wasd / swipe to start
            </span>
          </Overlay>
        )}
        {phase === 'dead' && (
          <Overlay>
            <span style={{ color: newBest ? '#fbbf24' : '#f87171', fontFamily: 'monospace', fontSize: 14 }}>
              {newBest ? 'new high score!' : 'game over'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: 11, marginTop: 6 }}>
              score: {score} — space or tap to restart
            </span>
          </Overlay>
        )}
      </div>
      {board.length > 0 && (
        <div style={{ width: COLS * CELL, fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ color: '#c084fc', letterSpacing: '0.1em' }}>HIGH SCORES </span>
          {board.map((e, i) => (
            <span key={i} style={{ marginLeft: 10, color: i === 0 ? '#fbbf24' : undefined }}>
              {i + 1}. {e.score} <span style={{ opacity: 0.6 }}>{e.date}</span>
            </span>
          ))}
        </div>
      )}
      <div className="snake-dpad" style={{ display: 'none', gridTemplateColumns: 'repeat(3, 44px)', gap: 6 }}>
        {([['', null], ['▲', 'U'], ['', null], ['◀', 'L'], ['▼', 'D'], ['▶', 'R']] as [string, Dir | null][]).map(([label, d], i) =>
          d ? (
            <button key={i} aria-label={`move ${d}`} onClick={() => (phase === 'dead' ? restart() : steer(d))} style={{
              height: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)', color: '#4ade80', fontSize: 16,
            }}>{label}</button>
          ) : <span key={i} />,
        )}
      </div>
      <span style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', fontSize: 11 }}>esc — back to terminal</span>
      <style>{`@media (pointer: coarse) { .snake-dpad { display: grid !important; } }`}</style>
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
