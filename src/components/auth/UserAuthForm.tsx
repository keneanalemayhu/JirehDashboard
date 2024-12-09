"use client";

import * as React from "react";
import Link from "next/link";
import { Sun, Moon, Languages, Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useLanguage,
  LanguageProvider,
} from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function UserAuthFormContent({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].login;

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

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
          <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="dark:text-white" htmlFor="email">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                  />
                </div>
                <div className="grid gap-1 relative">
                  <Label className="dark:text-white" htmlFor="password">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600 pr-10"
                      placeholder="********"
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
                    href="/auth/forgot-password/"
                    className="text-sm underline dark:text-gray-400 hover:dark:text-gray-300"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
                <Button
                  disabled={isLoading}
                  className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-100"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t.loginButton}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground dark:bg-black dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              className="dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
            <div className="text-center text-sm dark:text-gray-400">
              {t.noAccount}{" "}
              <Link
                href="/auth/register/"
                className="underline hover:dark:text-gray-300"
              >
                {t.register}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export function UserAuthForm() {
  return (
    <LanguageProvider>
      <UserAuthFormContent />
    </LanguageProvider>
  );
}
