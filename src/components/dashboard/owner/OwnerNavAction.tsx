"use client";
import React, { useState, useEffect } from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/owner/index";

export function NavActions() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].dashboard?.owner?.nav || {};

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Check localStorage first, then system preference
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkTheme(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    // Update DOM
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={toggleTheme}
        aria-label={t.toggleTheme || "Toggle theme"}
      >
        {isDarkTheme ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={toggleLanguage}
        aria-label={t.toggleLanguage || "Toggle language"}
      >
        <Languages className="h-4 w-4" />
      </Button>
    </div>
  );
}
