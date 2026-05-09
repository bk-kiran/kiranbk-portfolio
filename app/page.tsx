'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/terminal/Terminal';
import RecruiterView from '@/components/recruiter/RecruiterView';

type Mode = 'terminal' | 'recruiter';
const MODE_KEY = 'portfolioMode';

export default function Home() {
  const [mode, setMode] = useState<Mode>('terminal');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY) as Mode | null;
    if (saved === 'recruiter') setMode('recruiter');
    setReady(true);
  }, []);

  function toggle() {
    setMode(prev => {
      const next: Mode = prev === 'terminal' ? 'recruiter' : 'terminal';
      localStorage.setItem(MODE_KEY, next);
      return next;
    });
  }

  // Avoid flash of wrong mode before localStorage is read
  if (!ready) return null;

  return mode === 'recruiter'
    ? <RecruiterView onToggle={toggle} />
    : <Terminal onToggleRecruiter={toggle} />;
}
