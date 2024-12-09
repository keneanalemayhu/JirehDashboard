// app/context/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  language: "en" | "am";
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with a function to check localStorage
  const [language, setLanguage] = useState<"en" | "am">(() => {
    // Only access localStorage during client-side execution
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("jireh-language");
      return (savedLanguage === "en" || savedLanguage === "am") ? savedLanguage : "en";
    }
    return "en";
  });

  // Update localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem("jireh-language", language);
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "am" : "en"));

  // Handle hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};