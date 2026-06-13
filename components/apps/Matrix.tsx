'use client';

import { useEffect, useRef } from 'react';

const APP_EXIT_EVENT = 'portfolio:app-exit';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface Column {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  char: string;
}

export default function Matrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(true);
  const exitingRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    activeRef.current = true;
    exitingRef.current = false;
    particlesRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const FONT_SIZE = 14;
    const cols = Math.floor(W / FONT_SIZE);

    const columns: Column[] = Array.from({ length: cols }, (_, i) => ({
      x: i * FONT_SIZE,
      y: Math.random() * -H,
      speed: Math.random() * 1.5 + 0.5,
      length: Math.floor(Math.random() * 20 + 10),
      chars: Array.from({ length: 30 }, () => randChar()),
    }));

    let frameId: number;

    function animate() {
      if (!canvas) return;
      if (!activeRef.current && particlesRef.current.length === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FONT_SIZE}px monospace`;

      if (activeRef.current || exitingRef.current) {
        for (const col of columns) {
          col.y += col.speed;
          if (Math.random() < 0.08) {
            col.chars[Math.floor(Math.random() * col.chars.length)] = randChar();
          }

          for (let i = 0; i < col.length; i++) {
            const charY = col.y - i * FONT_SIZE;
            if (charY < 0 || charY > H) continue;
            const char = col.chars[i % col.chars.length];
            if (i === 0) {
              ctx.fillStyle = '#ffffff';
            } else {
              const fade = 1 - i / col.length;
              const g = Math.floor(fade * 180 + 30);
              ctx.fillStyle = `rgb(0, ${g}, 0)`;
            }
            ctx.fillText(char, col.x, charY);
          }

          if (col.y - col.length * FONT_SIZE > H) {
            col.y = -FONT_SIZE;
            col.speed = Math.random() * 1.5 + 0.5;
            col.length = Math.floor(Math.random() * 20 + 10);
          }
        }
      }

      // Draw ripple particles
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.life -= 0.04;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.life)})`;
          ctx.fillText(p.char, p.x, p.y);
        }
      }

      // Dispatch exit after particles fade
      if (exitingRef.current && particlesRef.current.length === 0) {
        activeRef.current = false;
        window.dispatchEvent(new CustomEvent(APP_EXIT_EVENT));
        return;
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    function onKey(e: KeyboardEvent) {
      if (exitingRef.current) return;
      if (!e.ctrlKey && !e.metaKey) e.preventDefault();

      exitingRef.current = true;

      const cx = W / 2;
      const cy = H / 2;
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.3;
        const speed = Math.random() * 10 + 3;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          char: randChar(),
        });
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      activeRef.current = false;
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={680}
        height={280}
        style={{ background: '#000', display: 'block', borderRadius: '4px' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          color: 'rgba(0, 180, 0, 0.5)',
          fontSize: 11,
          fontFamily: 'monospace',
          pointerEvents: 'none',
        }}
      >
        {'// press any key to exit'}
      </div>
    </div>
  );
}
