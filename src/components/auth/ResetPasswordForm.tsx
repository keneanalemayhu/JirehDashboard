"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
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
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { useState } from "react";
import AuthHeader from "@/components/common/auth/AuthHeader";

function ResetPasswordFormContent() {
  const { language } = useLanguage();
  const t = translations[language].resetPassword;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen p-4 flex items-center justify-center bg-background dark:bg-black">
      <AuthHeader />

      <Card className="w-full max-w-sm dark:bg-black dark:text-white dark:border dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription className="dark:text-gray-400">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2 relative">
              <Label className="dark:text-white">{t.newPassword}</Label>
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
            </div>

            <div className="grid gap-2 relative">
              <Label className="dark:text-white">{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="*******"
                  required
                  className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              {t.resetButton}
            </Button>
          </div>
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

export function ResetPasswordForm() {
  return <ResetPasswordFormContent />;
}
