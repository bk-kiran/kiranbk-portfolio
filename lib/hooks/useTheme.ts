'use client';

import { useState, useEffect } from 'react';
import { type Theme, type ThemeName, themes, DEFAULT_THEME } from '../themes';

const STORAGE_KEY = 'portfolio-theme';

export function useTheme(): { theme: Theme; themeName: ThemeName; setTheme: (name: ThemeName) => void } {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && stored in themes) {
      setThemeName(stored);
    }
  }, []);

  function setTheme(name: ThemeName) {
    setThemeName(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  return { theme: themes[themeName], themeName, setTheme };
}
