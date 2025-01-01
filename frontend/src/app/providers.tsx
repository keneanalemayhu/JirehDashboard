// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/context/LanguageContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
        <Toaster richColors position="top-right" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
