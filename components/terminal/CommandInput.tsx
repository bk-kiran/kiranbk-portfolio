'use client';

import { useState, useRef, type KeyboardEvent } from 'react';

interface Props {
  history: string[];
  onSubmit: (raw: string) => void;
}

export default function CommandInput({ history, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
        setValue('');
        setHistoryIdx(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setValue(history[history.length - 1 - next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) {
        setHistoryIdx(-1);
        setValue('');
      } else {
        setHistoryIdx(next);
        setValue(history[history.length - 1 - next] ?? '');
      }
    }
  }

  return (
    <div
      className="flex items-center gap-2 px-6 py-3 shrink-0 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <span className="select-none shrink-0 flex items-center gap-1">
        <span style={{ color: 'var(--color-prompt)' }}>kiran.sh</span>
        <span style={{ color: 'var(--color-text-dim)' }}>~ $</span>
      </span>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="flex-1 bg-transparent outline-none border-none"
        style={{ color: 'var(--color-text)', caretColor: 'var(--color-prompt)' }}
      />
    </div>
  );
}
