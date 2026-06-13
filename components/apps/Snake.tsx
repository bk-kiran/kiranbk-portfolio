'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const APP_EXIT_EVENT = 'portfolio:app-exit';
const LEADERBOARD_KEY = 'snake-leaderboard';
const CELL = 20;
const COLS = 20;
const ROWS = 14;
const W = COLS * CELL;
const H = ROWS * CELL;

interface Pos { x: number; y: number }
interface LeaderboardEntry { score: number; initials: string; date: string }

type Phase = 'idle' | 'playing' | 'dead' | 'initials';

interface GameState {
  snake: Pos[];
  food: Pos;
  dir: Pos;
  nextDir: Pos;
  score: number;
  foodEaten: number;
}

function randFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initGame(): GameState {
  const snake = [{ x: 10, y: 7 }];
  return { snake, food: randFood(snake), dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, score: 0, foodEaten: 0 };
}

function getSpeed(foodEaten: number): number {
  return Math.max(80, 160 - Math.floor(foodEaten / 5) * 10);
}

function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch { return []; }
}

function saveLeaderboard(lb: LeaderboardEntry[]) {
  try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb)); } catch { /* ignore */ }
}

function qualifies(score: number, lb: LeaderboardEntry[]): boolean {
  if (score === 0) return false;
  if (lb.length < 5) return true;
  return score > lb[lb.length - 1].score;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(initGame());
  const phaseRef = useRef<Phase>('idle');
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [initials, setInitials] = useState('');
  const [pendingScore, setPendingScore] = useState(0);
  const activeRef = useRef(true);
  const speedRef = useRef(160);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = gameRef.current;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Food
    ctx.fillStyle = '#39d353';
    ctx.fillRect(g.food.x * CELL + 2, g.food.y * CELL + 2, CELL - 4, CELL - 4);

    // Snake
    g.snake.forEach((seg, i) => {
      const isHead = i === 0;
      const brightness = isHead ? 1 : Math.max(0.4, 1 - i / g.snake.length);
      const r = Math.floor(50 * brightness);
      const gr = Math.floor(200 * brightness);
      const b = Math.floor(80 * brightness);
      ctx.fillStyle = `rgb(${r},${gr},${b})`;
      const pad = isHead ? 1 : 2;
      ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      if (isHead) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(seg.x * CELL + 5, seg.y * CELL + 4, 3, 3);
        ctx.fillRect(seg.x * CELL + 12, seg.y * CELL + 4, 3, 3);
      }
    });

    // Idle overlay
    if (phaseRef.current === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#39d353';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE', W / 2, H / 2 - 12);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '12px monospace';
      ctx.fillText('Arrow keys / WASD to start', W / 2, H / 2 + 10);
      ctx.textAlign = 'left';
    }

    // Dead overlay
    if (phaseRef.current === 'dead') {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 14);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px monospace';
      ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 + 8);
      ctx.textAlign = 'left';
    }
  }, []);

  // Game step
  const step = useCallback(() => {
    const g = gameRef.current;
    if (g.dir.x === 0 && g.dir.y === 0) return;

    // Apply buffered direction
    g.dir = g.nextDir;

    const head = g.snake[0];
    const newHead = {
      x: ((head.x + g.dir.x) + COLS) % COLS,
      y: ((head.y + g.dir.y) + ROWS) % ROWS,
    };

    // Self collision
    if (g.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      phaseRef.current = 'dead';
      setPhase('dead');
      setScore(g.score);
      if (intervalRef.current) clearInterval(intervalRef.current);
      draw();
      return;
    }

    const ateFood = newHead.x === g.food.x && newHead.y === g.food.y;
    const newSnake = [newHead, ...g.snake];
    if (!ateFood) newSnake.pop();

    const newFoodEaten = g.foodEaten + (ateFood ? 1 : 0);
    const newScore = ateFood ? g.score + 10 : g.score;
    const newFood = ateFood ? randFood(newSnake) : g.food;

    if (ateFood && newFoodEaten % 5 === 0) {
      const newSpeed = getSpeed(newFoodEaten);
      speedRef.current = newSpeed;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(step, newSpeed);
    }

    gameRef.current = { ...g, snake: newSnake, food: newFood, score: newScore, foodEaten: newFoodEaten };
    if (ateFood) setScore(newScore);
    draw();
  }, [draw]);

  function startGame() {
    gameRef.current = initGame();
    phaseRef.current = 'playing';
    setPhase('playing');
    setScore(0);
    speedRef.current = 160;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(step, speedRef.current);
    draw();
  }

  // Keydown handler
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!activeRef.current) return;

      if (e.key === 'Escape') {
        activeRef.current = false;
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.dispatchEvent(new CustomEvent(APP_EXIT_EVENT));
        return;
      }

      const DIR_MAP: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };

      if (DIR_MAP[e.key]) {
        e.preventDefault();
        const newDir = DIR_MAP[e.key];
        const cur = gameRef.current.dir;

        if (phaseRef.current === 'idle' || phaseRef.current === 'dead') {
          gameRef.current.dir = newDir;
          gameRef.current.nextDir = newDir;
          startGame();
          return;
        }

        // Prevent reversing
        if (cur.x !== 0 && newDir.x === -cur.x) return;
        if (cur.y !== 0 && newDir.y === -cur.y) return;
        if (cur.x === 0 && cur.y === 0) {
          gameRef.current.dir = newDir;
          gameRef.current.nextDir = newDir;
        } else {
          gameRef.current.nextDir = newDir;
        }
      }

      if (e.key === 'Enter' && phaseRef.current === 'dead') {
        startGame();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle dead → initials or back to idle
  useEffect(() => {
    if (phase !== 'dead') return;
    const s = gameRef.current.score;
    if (qualifies(s, leaderboard)) {
      setPendingScore(s);
      setPhase('initials');
      phaseRef.current = 'initials';
    }
  }, [phase, leaderboard]);

  function submitInitials() {
    const tri = initials.toUpperCase().slice(0, 3).padEnd(3, '-');
    const entry: LeaderboardEntry = { score: pendingScore, initials: tri, date: formatDate(new Date()) };
    const newLb = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 5);
    setLeaderboard(newLb);
    saveLeaderboard(newLb);
    setInitials('');
    setPhase('dead');
    phaseRef.current = 'dead';
  }

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  const highScore = leaderboard[0]?.score ?? 0;

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Canvas area */}
      <div>
        {/* Score bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--color-text-dim)' }}>
          <span>SCORE <span style={{ color: 'var(--color-green)', fontWeight: 700 }}>{score}</span></span>
          <span>BEST <span style={{ color: 'var(--color-cyan)' }}>{highScore}</span></span>
        </div>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: 'block', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-text-dim)' }}>
          {phase === 'idle' && 'Arrow keys or WASD to start · Esc to exit'}
          {phase === 'playing' && `Speed: ${Math.round((160 - speedRef.current) / 8 + 1)}x · Esc to exit`}
          {phase === 'dead' && 'Enter to restart · Esc to exit'}
          {phase === 'initials' && 'New high score! Enter initials below'}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ minWidth: 160, fontSize: 11 }}>
        {/* Leaderboard */}
        <div style={{ color: 'var(--color-cyan)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>
          HIGH SCORES
        </div>
        {Array.from({ length: 5 }, (_, i) => {
          const entry = leaderboard[i];
          return (
            <div key={i} style={{ display: 'flex', gap: 8, lineHeight: 2, color: i === 0 ? 'var(--color-yellow)' : 'var(--color-text-dim)' }}>
              <span style={{ minWidth: '1.5ch' }}>{i + 1}.</span>
              <span style={{ minWidth: '3ch', color: entry ? 'var(--color-green)' : 'var(--color-text-dim)' }}>
                {entry?.initials ?? '---'}
              </span>
              <span style={{ minWidth: '5ch', textAlign: 'right' }}>{entry?.score ?? 0}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>{entry?.date ?? '---'}</span>
            </div>
          );
        })}

        {/* Initials input */}
        {phase === 'initials' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: 'var(--color-yellow)', marginBottom: 6 }}>
              Score: {pendingScore}
            </div>
            <div style={{ color: 'var(--color-text-dim)', marginBottom: 4 }}>Enter initials:</div>
            <input
              autoFocus
              value={initials}
              maxLength={3}
              onChange={e => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              onKeyDown={e => { if (e.key === 'Enter') submitInitials(); if (e.key === 'Escape') { setPhase('dead'); phaseRef.current = 'dead'; } }}
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-green)',
                fontFamily: 'inherit', fontSize: 18, fontWeight: 700,
                width: 60, padding: '4px 8px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                outline: 'none', borderRadius: 3,
              }}
            />
            <div style={{ marginTop: 4, color: 'var(--color-text-dim)' }}>Enter to confirm</div>
          </div>
        )}

        <div style={{ marginTop: 16, color: 'var(--color-text-dim)', lineHeight: 1.8 }}>
          <div>↑↓←→ or WASD</div>
          <div>Wrap-around walls</div>
          <div>Speed ↑ every 5 food</div>
        </div>
      </div>
    </div>
  );
}
