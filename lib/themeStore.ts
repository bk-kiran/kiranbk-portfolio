import { type ThemeName, themes, applyThemeVars, THEME_CHANGE_EVENT } from './themes';

const STORAGE_KEY = 'theme';

export function setThemeImperative(name: ThemeName): void {
  applyThemeVars(themes[name]);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, name);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: name }));
  }
}
