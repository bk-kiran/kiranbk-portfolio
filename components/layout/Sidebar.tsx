'use client';

import { useState } from 'react';
import Image from 'next/image';

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GradCapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Sidebar() {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  function socialStyle(id: string): React.CSSProperties {
    return {
      color: hovered === id ? 'var(--accent)' : 'var(--text-dim)',
      textDecoration: 'none',
      transition: 'color 150ms',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      padding: '4px 0',
    };
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    padding: '4px 0',
    color: 'var(--text-dim)',
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: 260,
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg)',
        padding: '40px 24px',
        flexDirection: 'column',
        transition: 'background 200ms, border-color 200ms',
        flexShrink: 0,
      }}
    >
      {/* Headshot — 120px */}
      <div style={{ marginBottom: 20 }}>
        {imgError ? (
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            border: '2px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: 'var(--accent)',
          }}>
            KB
          </div>
        ) : (
          <Image
            src="/avatar.jpg"
            width={120}
            height={120}
            alt="Kiran BK"
            onError={() => setImgError(true)}
            style={{ borderRadius: '50%', border: '2px solid var(--border)', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>
        Kiran Balasundaram Kuppuraj
      </div>
      {/* Title */}
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>
        Software Engineer + AI/ML
      </div>
      {/* Tagline */}
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 24 }}>
        Honors CS · UMass Amherst '27
      </div>

      <div style={{ borderTop: '1px solid var(--border)', marginBottom: 20 }} />

      {/* Social + external links */}
      <div>
        <div style={rowStyle}>
          <LocationIcon /> Amherst, MA
        </div>
        <a
          href="https://kiranbk.com"
          target="_blank"
          rel="noopener noreferrer"
          style={socialStyle('website')}
          onMouseEnter={() => setHovered('website')}
          onMouseLeave={() => setHovered(null)}
        >
          <GlobeIcon /> kiranbk.com
        </a>
        <a
          href="mailto:kiranbk1704@gmail.com"
          style={socialStyle('email')}
          onMouseEnter={() => setHovered('email')}
          onMouseLeave={() => setHovered(null)}
        >
          <EnvelopeIcon /> kbalasundara@umass.edu
        </a>

        <a
          href="https://umass.edu"
          target="_blank"
          rel="noopener noreferrer"
          style={socialStyle('umass')}
          onMouseEnter={() => setHovered('umass')}
          onMouseLeave={() => setHovered(null)}
        >
          <GradCapIcon /> UMass Amherst
        </a>
        <a
          href="https://github.com/bk-kiran"
          target="_blank"
          rel="noopener noreferrer"
          style={socialStyle('github')}
          onMouseEnter={() => setHovered('github')}
          onMouseLeave={() => setHovered(null)}
        >
          <GitHubIcon /> github.com/bk-kiran
        </a>
        <a
          href="https://linkedin.com/in/bk-kiran"
          target="_blank"
          rel="noopener noreferrer"
          style={socialStyle('linkedin')}
          onMouseEnter={() => setHovered('linkedin')}
          onMouseLeave={() => setHovered(null)}
        >
          <LinkedInIcon /> linkedin.com/in/bk-kiran
        </a>
      </div>

      {/* Terminal button — pinned to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
          onMouseEnter={() => setHovered('terminal-btn')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: '100%',
            height: 36,
            background: hovered === 'terminal-btn' ? 'var(--accent)' : 'var(--text)',
            color: hovered === 'terminal-btn' ? 'white' : 'var(--bg)',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 150ms, color 150ms',
          }}
        >
          &gt; ask kiranbot
        </button>
      </div>
    </aside>
  );
}
