'use client';

import { useState, useEffect } from 'react';
import FloatingNav from './FloatingNav';
import Terminal from '@/components/terminal/Terminal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setTerminalOpen(true);
    window.addEventListener('open-terminal', handler);
    return () => window.removeEventListener('open-terminal', handler);
  }, []);

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      transition: 'background 200ms, color 200ms',
      minHeight: '100vh',
    }}>
      <main className="main-content-area">
        {children}
      </main>
      <FloatingNav />
      {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
    </div>
  );
}
