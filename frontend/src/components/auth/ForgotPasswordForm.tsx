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
import { useState, useEffect } from "react";
import AuthHeader from "@/components/common/auth/AuthHeader";
import router from "next/router";
import { useAuth } from "@/hooks/use-auth";

function ForgotPasswordFormContent() {
  const { language } = useLanguage();
  const t = translations[language].forgotPassword;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const { resetPasswordRequest } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    if (cooldown > 0) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await resetPasswordRequest(email);
      console.log(response.data.message);
      setCooldown(60); // Start 60 second cooldown
    } catch (error) {
      setError("Error sending reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 flex items-center justify-center bg-background dark:bg-black">
      <AuthHeader />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="email">{t.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <Button 
              type="submit" 
              disabled={isSubmitting || cooldown > 0}
              className="w-full mt-4"
            >
              {isSubmitting ? t.submitting : 
               cooldown > 0 ? `Try again in ${cooldown}s` : `send link`}
            </Button>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline">
            {t.backToLogin}
          </Link>
        </div>
      </form>
    </main>
  );
}

export function ForgotPasswordForm() {
  return <ForgotPasswordFormContent />;
}