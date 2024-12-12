"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { useState } from "react";
import { Icons } from "@/components/common/auth/AuthIcons";
import AuthHeader from "@/components/common/auth/AuthHeader";
import { useAuth } from '@/hooks/use-auth';

function LoginFormContent() {
  const { language } = useLanguage();
  const t = translations[language].login;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });
      await login(email, password);
    } catch (err: any) {
      console.log('Login error response:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error ||
                          'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex">
      <AuthHeader />
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
            <form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="text-sm text-red-500 mt-2">{error}</div>
                )}
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t.loginButton}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t.or}
                </span>
              </div>
            </div>
            <div className="text-sm text-center">
              {t.noAccount}{" "}
              <Link href="/register" className="underline">
                {t.register}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return <LoginFormContent />;
}
