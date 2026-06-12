'use client';

import { ReactNode, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { envConfigs } from '@/config';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined' && locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const storageKey = 'hailuo-theme';
  const theme = envConfigs.appearance || 'dark';

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={theme}
      forcedTheme={theme === 'dark' || theme === 'light' ? theme : undefined}
      storageKey={storageKey}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
