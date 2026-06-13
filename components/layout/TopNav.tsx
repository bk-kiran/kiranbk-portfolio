'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/themes/useTheme';
import type { Tab } from '@/app/page';

const TABS: { id: Tab; label: string; num: string }[] = [
  { id: 'about',      label: 'About',      num: '01' },
  { id: 'experience', label: 'Experience', num: '02' },
  { id: 'projects',   label: 'Projects',   num: '03' },
];

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

interface TopNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function TopNav({ activeTab, setActiveTab }: TopNavProps) {
  const { isDark, toggleTheme } = useTheme();
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <nav
      className="top-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 72px',
        height: 52,
        transition: 'background 200ms, border-color 200ms',
      }}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', height: '100%', gap: 2 }}>
        {TABS.map(({ id, label, num }) => {
          const isActive = activeTab === id;
          const isHovered = hoveredTab === id && !isActive;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              onMouseEnter={() => setHoveredTab(id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive
                  ? '1.5px solid var(--text)'
                  : '1.5px solid transparent',
                cursor: 'pointer',
                padding: '0 16px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: isActive
                  ? 'var(--text)'
                  : isHovered
                  ? 'var(--text)'
                  : 'var(--text-dim)',
                transition: 'color 150ms, border-color 150ms',
                marginBottom: -1,
              }}
            >
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                letterSpacing: '0.1em',
                opacity: isActive ? 0.4 : 0.35,
                color: 'inherit',
                lineHeight: 1,
              }}>
                {num}
              </span>
              <span style={{
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.01em',
                lineHeight: 1,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Theme icon — no bg/border, just color */}
      <button
        onClick={toggleTheme}
        onMouseEnter={() => setIconHovered(true)}
        onMouseLeave={() => setIconHovered(false)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          color: iconHovered ? 'var(--text)' : 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 150ms',
          borderRadius: 4,
        }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  );
}
