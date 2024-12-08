"use client";
import React, { useState, useEffect } from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavActions() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState("en");

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

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
    // You might want to persist language preference similarly:
    // localStorage.setItem("language", language === "en" ? "am" : "en");
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={toggleTheme}
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
      >
        <Languages className="h-4 w-4" />
      </Button>
    </div>
  );
}