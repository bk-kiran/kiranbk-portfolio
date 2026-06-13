'use client';

import { useState, useEffect } from 'react';

const DARK_KEY = 'xp-dark-mode';
const DARK_EVENT = 'xp-dark-mode-change';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DARK_KEY) === 'true';
    setIsDark(saved);

    function onDarkChange(e: Event) {
      setIsDark((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(DARK_EVENT, onDarkChange);
    return () => window.removeEventListener(DARK_EVENT, onDarkChange);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem(DARK_KEY, String(next));
    window.dispatchEvent(new CustomEvent<boolean>(DARK_EVENT, { detail: next }));
  }

  return { isDark, toggleDark };
}
