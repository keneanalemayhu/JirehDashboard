"use client";

import Link from "next/link";
import { Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  useLanguage,
  LanguageProvider,
} from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { useState } from "react";

function ForgotPasswordFormContent() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].forgotPassword;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Add your password reset logic here
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen p-4 flex items-center justify-center bg-background dark:bg-black">
      <div className="fixed top-4 right-4 flex space-x-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-white" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <button onClick={toggleLanguage}>
          <Languages
            className={cn("w-6 h-6", theme === "dark" && "text-white")}
          />
        </button>
      </div>

      <Card className="w-full max-w-sm dark:bg-black dark:text-white dark:border dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription className="dark:text-gray-400">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label className="dark:text-white">{t.email}</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
              />
            </div>
            <Button
              type="submit"
              disabled={!email || isSubmitting}
              className={cn(
                "w-full dark:bg-white dark:text-black dark:hover:bg-gray-100",
                (!email || isSubmitting) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? t.submitting : t.resetButton}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm dark:text-gray-400">
            <Link
              href="/auth/login"
              className="underline hover:dark:text-gray-300"
            >
              {t.backToLogin}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export function ForgotPasswordForm() {
  return (
    <LanguageProvider>
      <ForgotPasswordFormContent />
    </LanguageProvider>
  );
}
