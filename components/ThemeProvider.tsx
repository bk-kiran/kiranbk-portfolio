'use client';

import { useEffect } from 'react';
import { type ThemeName, themes, applyThemeVars } from '@/lib/themes';

const STORAGE_KEY = 'theme';
const DEFAULT: ThemeName = 'tokyonight';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const name = saved && saved in themes ? saved : DEFAULT;
    applyThemeVars(themes[name]);
  }, []);

  return <>{children}</>;
}
