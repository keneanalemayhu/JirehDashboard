"use client";

import Link from "next/link";
import { Sun, Moon, Languages, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations";
import { Icons } from "@/components/common/Icons";

export function RegisterForm() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].register;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row">
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

      {/* Left side - Personal Information */}
      <div className="lg:hidden w-full px-4 pt-6 pb-8">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" /> Jireh-Group
        </div>
      </div>

      <div className="w-full lg:w-1/2 lg:h-full bg-zinc-900 text-white p-8 lg:p-10">
        <div className="hidden lg:block lg:fixed lg:top-10 lg:left-10">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.logo className="mr-2 h-6 w-6" /> Jireh-Group
          </div>
        </div>

        <div className="h-full flex flex-col justify-center">
          <div className="w-full max-w-[350px] mx-auto space-y-6 lg:-mt-10">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t.personalInfo.title}
              </h1>
              <p className="text-sm text-white">{t.personalInfo.description}</p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">
                  {t.personalInfo.name}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-white">
                  {t.personalInfo.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251-91-234-5678"
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  {t.personalInfo.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">
                  {t.personalInfo.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    disabled={isLoading}
                    className="pr-10 bg-zinc-800 border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  {t.personalInfo.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    disabled={isLoading}
                    className="pr-10 bg-zinc-800 border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Business Information */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[350px] space-y-6 lg:-mt-10">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t.businessInfo.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.businessInfo.description}
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">
                  {t.businessInfo.businessName}
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="My Business"
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessPhone">
                  {t.businessInfo.businessPhone}
                </Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  placeholder="+251-91-234-5678"
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessType">
                  {t.businessInfo.businessType}
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-4" disabled={isLoading}>
                {t.registerButton}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div>
              {t.terms}{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href="/app/legal/terms"
                    target="_blank"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {t.termsLink}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>{t.termsofservice}</p>
                  <Link
                    href="/app/legal/terms"
                    target="_blank"
                    className="text-blue-500 underline hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    {t.learnmore}
                  </Link>
                </HoverCardContent>
              </HoverCard>{" "}
              {t.and}{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href="/app/legal/privacy"
                    target="_blank"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {t.privacyLink}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>{t.privacypolicy}</p>
                  <Link
                    href="/app/legal/privacy"
                    target="_blank"
                    className="text-blue-500 underline hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    {t.learnmore}
                  </Link>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div>
              {t.haveAccount}{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t.login}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
