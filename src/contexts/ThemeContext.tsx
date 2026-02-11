import { createContext, useContext, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type ThemeName =
  | 'midnight-gold'
  | 'ocean-blue'
  | 'forest-green'
  | 'rose-pink'
  | 'lavender-purple'
  | 'sunset-orange'
  | 'arctic-light'
  | 'crimson-noir'
  | 'cyber-neon'
  | 'mocha-brown';

export interface ThemeInfo {
  name: ThemeName;
  label: string;
  preview: string; // primary color for preview swatch
}

export const themes: ThemeInfo[] = [
  { name: 'midnight-gold', label: 'Midnight Gold', preview: 'hsl(38 92% 60%)' },
  { name: 'ocean-blue', label: 'Ocean Blue', preview: 'hsl(210 90% 55%)' },
  { name: 'forest-green', label: 'Forest Green', preview: 'hsl(150 60% 45%)' },
  { name: 'rose-pink', label: 'Rose Pink', preview: 'hsl(340 75% 60%)' },
  { name: 'lavender-purple', label: 'Lavender Purple', preview: 'hsl(270 65% 60%)' },
  { name: 'sunset-orange', label: 'Sunset Orange', preview: 'hsl(20 90% 55%)' },
  { name: 'arctic-light', label: 'Arctic Light', preview: 'hsl(210 40% 50%)' },
  { name: 'crimson-noir', label: 'Crimson Noir', preview: 'hsl(0 75% 50%)' },
  { name: 'cyber-neon', label: 'Cyber Neon', preview: 'hsl(160 100% 50%)' },
  { name: 'mocha-brown', label: 'Mocha Brown', preview: 'hsl(30 40% 45%)' },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeInfo: ThemeInfo;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeName>('app-theme', 'midnight-gold');

  const applyTheme = useCallback((t: ThemeName) => {
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const themeInfo = themes.find((t) => t.name === theme) || themes[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeInfo }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
