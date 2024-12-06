// app/context/LanguageContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type LanguageContextType = {
  language: "en" | "am";
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"en" | "am">("en");
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "am" : "en"));

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
