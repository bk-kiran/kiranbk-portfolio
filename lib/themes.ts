export type ThemeName = 'tokyonight' | 'solarized' | 'nord' | 'paper';

export interface Theme {
  bg: string;
  bgSecondary: string;
  border: string;
  text: string;
  textDim: string;
  green: string;
  cyan: string;
  yellow: string;
  magenta: string;
  red: string;
  prompt: string;
}

export const themes: Record<ThemeName, Theme> = {
  tokyonight: {
    bg: '#1a1b26',
    bgSecondary: '#24283b',
    border: '#414868',
    text: '#c0caf5',
    textDim: '#565f89',
    green: '#9ece6a',
    cyan: '#7dcfff',
    yellow: '#e0af68',
    magenta: '#bb9af7',
    red: '#f7768e',
    prompt: '#9ece6a',
  },
  solarized: {
    bg: '#002b36',
    bgSecondary: '#073642',
    border: '#586e75',
    text: '#839496',
    textDim: '#657b83',
    green: '#859900',
    cyan: '#2aa198',
    yellow: '#b58900',
    magenta: '#d33682',
    red: '#dc322f',
    prompt: '#859900',
  },
  nord: {
    bg: '#2e3440',
    bgSecondary: '#3b4252',
    border: '#4c566a',
    text: '#d8dee9',
    textDim: '#616e88',
    green: '#a3be8c',
    cyan: '#88c0d0',
    yellow: '#ebcb8b',
    magenta: '#b48ead',
    red: '#bf616a',
    prompt: '#a3be8c',
  },
  paper: {
    bg: '#f2ede4',
    bgSecondary: '#e8e0d0',
    border: '#c9b99a',
    text: '#282828',
    textDim: '#7c6f64',
    green: '#427b58',
    cyan: '#076678',
    yellow: '#b57614',
    magenta: '#8f3f71',
    red: '#9d0006',
    prompt: '#427b58',
  },
};

export const DEFAULT_THEME: ThemeName = 'tokyonight';

export const THEME_CHANGE_EVENT = 'portfolio:theme-change';

export function applyThemeVars(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const r = document.documentElement;
  r.style.setProperty('--color-bg', theme.bg);
  r.style.setProperty('--color-bg-secondary', theme.bgSecondary);
  r.style.setProperty('--color-border', theme.border);
  r.style.setProperty('--color-text', theme.text);
  r.style.setProperty('--color-text-dim', theme.textDim);
  r.style.setProperty('--color-green', theme.green);
  r.style.setProperty('--color-cyan', theme.cyan);
  r.style.setProperty('--color-yellow', theme.yellow);
  r.style.setProperty('--color-magenta', theme.magenta);
  r.style.setProperty('--color-red', theme.red);
  r.style.setProperty('--color-prompt', theme.prompt);
}
