'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/lib/themes/useTheme';

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 12h20" />
    </svg>
  );
}

function GradCapIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const PAGE_ITEMS = [
  { href: '/',            Icon: HomeIcon,      label: 'Home' },
  { href: '/experience',  Icon: BriefcaseIcon, label: 'Experience' },
  { href: '/education',   Icon: GradCapIcon,   label: 'Education' },
  { href: '/projects',    Icon: FolderIcon,    label: 'Projects' },
];

const DIVIDER = <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 6px', flexShrink: 0 }} />;

function Tooltip({ label }: { label: string }) {
  return (
    <span style={{
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--text)',
      color: 'var(--bg)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.02em',
      padding: '3px 8px',
      borderRadius: 5,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>
      {label}
    </span>
  );
}

export default function FloatingNav() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const baseBtn = (id: string, active: boolean): React.CSSProperties => ({
    position: 'relative',
    width: 38,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    background: active || hovered === id ? 'var(--bg-secondary)' : 'transparent',
    color: active || hovered === id ? 'var(--text)' : 'var(--text-dim)',
    transition: 'background 150ms, color 150ms',
    textDecoration: 'none',
    flexShrink: 0,
  });

  return (
    <div className="floating-nav-wrapper">
      <nav
        className="glass-pill"
        style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', gap: 2, borderRadius: 999 }}
      >
        {PAGE_ITEMS.map(({ href, Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              style={baseBtn(label, isActive) as React.CSSProperties}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            >
              <Icon />
              {hovered === label && <Tooltip label={label} />}
            </Link>
          );
        })}

        {DIVIDER}

        <a
          href="https://github.com/bk-kiran"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={baseBtn('github', false) as React.CSSProperties}
          onMouseEnter={() => setHovered('github')}
          onMouseLeave={() => setHovered(null)}
        >
          <GitHubIcon />
          {hovered === 'github' && <Tooltip label="GitHub" />}
        </a>

        <a
          href="https://linkedin.com/in/bk-kiran"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={baseBtn('linkedin', false) as React.CSSProperties}
          onMouseEnter={() => setHovered('linkedin')}
          onMouseLeave={() => setHovered(null)}
        >
          <LinkedInIcon />
          {hovered === 'linkedin' && <Tooltip label="LinkedIn" />}
        </a>

        {DIVIDER}

        <button
          aria-label="Open terminal"
          onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
          onMouseEnter={() => setHovered('terminal')}
          onMouseLeave={() => setHovered(null)}
          style={baseBtn('terminal', false)}
        >
          <TerminalIcon />
          {hovered === 'terminal' && <Tooltip label="Ask kiranbot" />}
        </button>

        <button
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          onMouseEnter={() => setHovered('theme')}
          onMouseLeave={() => setHovered(null)}
          style={baseBtn('theme', false)}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          {hovered === 'theme' && <Tooltip label={isDark ? 'Light mode' : 'Dark mode'} />}
        </button>
      </nav>
    </div>
  );
}
