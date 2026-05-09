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
    prompt: '#7aa2f7',
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
    prompt: '#268bd2',
  },
  nord: {
    bg: '#2e3440',
    bgSecondary: '#3b4252',
    border: '#4c566a',
    text: '#eceff4',
    textDim: '#d8dee9',
    green: '#a3be8c',
    cyan: '#88c0d0',
    yellow: '#ebcb8b',
    magenta: '#b48ead',
    red: '#bf616a',
    prompt: '#81a1c1',
  },
  paper: {
    bg: '#f5f0e8',
    bgSecondary: '#ede8e0',
    border: '#c8c0b0',
    text: '#2c2c2c',
    textDim: '#6b6b6b',
    green: '#2d6a2d',
    cyan: '#0a6b6b',
    yellow: '#8b6914',
    magenta: '#7b2d7b',
    red: '#a01010',
    prompt: '#1a4a8a',
  },
};

export const DEFAULT_THEME: ThemeName = 'tokyonight';
