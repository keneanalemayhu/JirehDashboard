"use client";
import Link from "next/link";
import { Sun, Moon, Languages, Eye, EyeOff } from "lucide-react";
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
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations";
import { useState } from "react";

export function LoginForm() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].login;
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="dark:text-white">{t.email}</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                required
                className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2 relative">
              <Label className="dark:text-white">{t.password}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="*******"
                  required
                  className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Link
                href="#"
                className="text-sm underline dark:text-gray-400 hover:dark:text-gray-300"
              >
                {t.forgotPassword}
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              {t.loginButton}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm dark:text-gray-400">
            {t.noAccount}{" "}
            <Link
              href="/auth/register/"
              className="underline hover:dark:text-gray-300"
            >
              {t.register}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
