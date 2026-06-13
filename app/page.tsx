'use client';

import Image from 'next/image';
import { useState } from 'react';

const SCATTER: { char: string; style: React.CSSProperties }[] = [
  { char: 'K', style: { top: -14, left: -36, transform: 'rotate(-18deg)' } },
  { char: 'I', style: { top: 6, right: -28, transform: 'rotate(11deg)' } },
  { char: 'R', style: { top: 90, left: -42, transform: 'rotate(-6deg)' } },
  { char: 'A', style: { top: 68, right: -32, transform: 'rotate(20deg)' } },
  { char: 'N', style: { bottom: 80, right: -38, transform: 'rotate(-13deg)' } },
  { char: 'B', style: { bottom: 56, left: -38, transform: 'rotate(8deg)' } },
  { char: 'K', style: { bottom: 16, right: -24, transform: 'rotate(-4deg)' } },
];

function PhotoHero() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ flexShrink: 0, position: 'relative', width: 260, height: 310 }}>
      {imgError ? (
        <div style={{
          width: 260, height: 310, borderRadius: 14,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, fontWeight: 700,
          fontFamily: 'var(--font-serif, Georgia, serif)',
          color: 'var(--text-dim)',
        }}>
          KB
        </div>
      ) : (
        <Image
          src="/avatar.jpg"
          width={260}
          height={310}
          alt="Kiran BK"
          priority
          onError={() => setImgError(true)}
          style={{ borderRadius: 14, objectFit: 'cover', display: 'block' }}
        />
      )}

      {SCATTER.map(({ char, style }, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            ...style,
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
            opacity: 0.16,
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '0.05em',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 100px)',
      padding: '80px 48px 60px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 80,
        maxWidth: 900,
        width: '100%',
      }}>
        {/* Intro text */}
        <div style={{ flex: 1, maxWidth: 400 }}>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            marginBottom: 22,
            fontWeight: 500,
          }}>
            Software Engineer · AI/ML
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.08,
            color: 'var(--text)',
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            I&rsquo;m Kiran &mdash;
          </h1>

          <p style={{
            fontSize: 18,
            color: 'var(--text-dim)',
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            building at the intersection of engineering and applied intelligence.
          </p>

          <p style={{
            fontSize: 14,
            color: 'var(--text-dim)',
            lineHeight: 1.85,
            marginBottom: 40,
          }}>
            CS Honors student at UMass Amherst, graduating May 2027. I build full-stack systems,
            AI/ML pipelines, and anything in between — from agentic backends to consumer-facing
            products.
          </p>

          <p style={{
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            opacity: 0.7,
          }}>
            Open to Full-time SWE and ML roles starting 2027
          </p>
        </div>

        {/* Photo */}
        <PhotoHero />
      </div>
    </div>
  );
}
