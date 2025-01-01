"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AuthHeader from "@/components/common/auth/AuthHeader";

interface LoginFormData {
  identifier: string;
  password: string;
}

function LoginFormContent() {
  const { language } = useLanguage();
  const t = translations[language].login;
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Redirect if user is authenticated
    if (isAuthenticated) {
      router.push("/dashboard/business/owner/overview");
    }
  }, [isAuthenticated, router]);
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const response = await login(data.identifier, data.password);
      
      if (response?.success) {  // Add optional chaining
        // Store tokens and user data
        if (response.access) localStorage.setItem('access_token', response.access);
        if (response.refresh) localStorage.setItem('refresh_token', response.refresh);
        if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirect based on role
        const role = response.role;
        if (role.includes('super_admin')) {
          router.push('/dashboard/sadmin');
        }
        else if (role === 'owner' || role === 'admin') {
          router.push('/dashboard/business/owner');
        } else if (role === 'sales') {
          router.push('/dashboard/business/sales');
        } else if(role === 'warehouse_manager') {
          router.push('/dashboard/business/warehouse_manager');
        }
      } else {
        setError(response?.detail || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identifier || !password) return;

    const data: LoginFormData = {
      identifier,
      password,
    };

    await onSubmit(data);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 dark:bg-black">
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
              <Label htmlFor="identifier" className="dark:text-white">
                {t.emailOrUsername}
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t.emailOrUsernamePlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="dark:text-white">
                {t.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={!identifier || !password || isSubmitting}
              className={cn(
                "w-full dark:bg-white dark:text-black dark:hover:bg-gray-100",
                (!identifier || !password || isSubmitting) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? t.submitting : t.loginButton}
            </Button>
            <div className="text-sm text-center dark:text-gray-400">
              <Link
                href="/auth/forgot-password"
                className="underline hover:dark:text-gray-300"
              >
                {t.forgotPassword}
              </Link>
            </div>
            <div className="text-sm text-center">
              {t.noAccount}{" "}
              <Link href="/auth/register" className="underline">
                {t.register}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export function LoginForm() {
  return <LoginFormContent />;
}