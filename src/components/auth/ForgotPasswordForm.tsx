"use client";

import Link from "next/link";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { useState } from "react";
import AuthHeader from "@/components/common/auth/AuthHeader";

function ForgotPasswordFormContent() {
  const { language } = useLanguage();
  const t = translations[language].forgotPassword;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Add your password reset logic here
    setIsSubmitting(false);
  };

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
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="dark:text-white">
                {t.email}
              </Label>
              <Input
                id="email"
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
  return <ForgotPasswordFormContent />;
}
