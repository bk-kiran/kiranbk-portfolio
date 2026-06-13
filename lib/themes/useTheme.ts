'use client';

import { useState, useEffect } from 'react';

const THEME_EVENT = 'portfolio-theme-change';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const dark = stored === 'dark';
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');
  }, []);

  // Sync across multiple useTheme() instances on the same page
  useEffect(() => {
    const handler = (e: Event) => {
      setIsDark((e as CustomEvent<{ dark: boolean }>).detail.dark);
    };
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { dark: next } }));
  }

  return { isDark, toggleTheme };
}
