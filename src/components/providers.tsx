'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/context/language-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
