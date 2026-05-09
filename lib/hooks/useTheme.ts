'use client';

import { useState, useEffect } from 'react';
import { type Theme, type ThemeName, themes, DEFAULT_THEME, applyThemeVars, THEME_CHANGE_EVENT } from '../themes';

const STORAGE_KEY = 'theme';

export function useTheme(): { theme: Theme; themeName: ThemeName; setTheme: (name: ThemeName) => void } {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const initial = stored && stored in themes ? stored : DEFAULT_THEME;
    setThemeName(initial);

    function onThemeChange(e: Event) {
      const name = (e as CustomEvent<ThemeName>).detail;
      if (name in themes) setThemeName(name);
    }
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  }, []);

  function setTheme(name: ThemeName) {
    setThemeName(name);
    localStorage.setItem(STORAGE_KEY, name);
    applyThemeVars(themes[name]);
  }

  return { theme: themes[themeName], themeName, setTheme };
}
