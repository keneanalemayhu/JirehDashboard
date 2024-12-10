"use client";

import Link from "next/link";
import { Sun, Moon, Languages, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
  useLanguage,
  LanguageProvider,
} from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { useState } from "react";
import { Icons } from "@/components/common/auth/Icons";

function LoginFormContent() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].login;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="h-screen w-screen flex">
      {/* Theme and Language Toggles - Fixed position */}
      <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 hover:bg-accent"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={toggleLanguage}
          className="rounded-md p-2 hover:bg-accent"
        >
          <Languages className="w-5 h-5" />
        </button>
      </div>

      {/* Left side - Dark section */}
      <div className="hidden lg:flex w-1/2 h-full bg-zinc-900 text-white flex-col justify-between p-10">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" /> Jireh-Group
        </div>
        <div className="relative z-20">
          <blockquote className="space-y-2">
            <p className="text-lg">{t.quote}</p>
            <footer className="text-sm">{t.quotee}</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    placeholder={t.loginPlaceholder}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    {t.forgotPassword}{" "}
                    <Link
                      href="/auth/forgot-password"
                      className="underline underline-offset-4 hover:text-primary"
                    ></Link>
                  </p>
                </Link>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t.loginButton}
                </Button>
              </div>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              {t.noAccount}{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <LanguageProvider>
      <LoginFormContent />
    </LanguageProvider>
  );
}
