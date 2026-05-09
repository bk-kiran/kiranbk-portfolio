'use client';

import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import '@/components/commands';
import { useTheme } from '@/lib/hooks/useTheme';
import { registry } from '@/lib/commandRegistry';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';
import CommandInput from './CommandInput';
import OutputRenderer from './OutputRenderer';

interface TerminalEntry {
  id: string;
  input: string | null;
  output: ReactNode;
}

const SECTION_MAP: Record<string, string> = {
  whoami: '~',
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  run: 'apps',
  play: 'apps',
  apps: 'apps',
  contact: 'contact',
};

function deriveSection(cmd: string): string | null {
  const name = cmd.trim().split(/\s+/)[0];
  return SECTION_MAP[name] ?? null;
}

function getTitle(section: string): string {
  return section === '~' ? 'kiran.sh — v1.0.0' : `kiran.sh — ~/${section}`;
}

interface Props {
  onToggleRecruiter: () => void;
}

export default function Terminal({ onToggleRecruiter }: Props) {
  useTheme();
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('~');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeOutput = (
      <div style={{ color: 'var(--color-text-dim)' }}>
        <div>Last login: {new Date().toDateString()} on ttys001</div>
        <div>
          Welcome. Type{' '}
          <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>help</span>
          {' '}to list commands, or just read on.
        </div>
      </div>
    );

    setEntries([
      { id: 'welcome', input: null, output: welcomeOutput },
      { id: 'init-whoami', input: 'whoami', output: registry.execute('whoami') },
      { id: 'init-help', input: 'help', output: registry.execute('help') },
    ]);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  function handleSubmit(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setEntries([]);
      setHistory(prev => [...prev, trimmed]);
      return;
    }

    const output = registry.execute(trimmed);
    setEntries(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, input: trimmed, output },
    ]);
    setHistory(prev => [...prev, trimmed]);

    const section = deriveSection(trimmed);
    if (section !== null) setActiveSection(section);
  }

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden font-mono text-sm"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <TitleBar title={getTitle(activeSection)} onToggle={onToggleRecruiter} />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar activeSection={activeSection} onNavigate={handleSubmit} />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable output */}
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
          >
            {entries.map(entry => (
              <div key={entry.id}>
                {entry.input !== null && (
                  <div className="flex items-baseline gap-1 mb-1 select-none flex-wrap">
                    <span style={{ color: 'var(--color-prompt)' }}>kiran.sh</span>
                    <span style={{ color: 'var(--color-text-dim)' }}>~ $</span>
                    <span style={{ color: 'var(--color-yellow)' }} className="ml-1">
                      {entry.input}
                    </span>
                  </div>
                )}
                <OutputRenderer output={entry.output} />
              </div>
            ))}
          </div>

          <CommandInput history={history} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
