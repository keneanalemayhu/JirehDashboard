"use client";

import Link from "next/link";
import { Sun, Moon, Languages, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/context/LanguageContext"; // Changed this line
import { translations } from "@/translations";

export function RegisterForm() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].register;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <main className="min-h-screen p-4 flex items-center justify-center bg-background dark:bg-black">
      <div className="fixed top-4 right-4 flex space-x-4">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
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

      <Card className="w-full max-w-4xl p-6 dark:bg-black dark:text-white dark:border dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription className="dark:text-gray-400">
            {t.description}
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t.personalInfo.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t.personalInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="dark:text-white">
                    {t.personalInfo.name}
                  </Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                    required
                  />
                  <Label className="dark:text-white">
                    {t.personalInfo.phone}
                  </Label>
                  <Input
                    type="number"
                    placeholder="+251-91-234-5678"
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                    required
                  />
                  <Label className="dark:text-white">
                    {t.personalInfo.email}
                  </Label>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                    required
                  />
                  <Label className="dark:text-white">
                    {t.personalInfo.password}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <Label className="dark:text-white">
                    {t.personalInfo.confirmPassword}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t.businessInfo.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t.businessInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="dark:text-white">
                    {t.businessInfo.businessName}
                  </Label>
                  <Input
                    type="text"
                    placeholder="My Business"
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                    required
                  />
                  <Label className="dark:text-white">
                    {t.businessInfo.businessPhone}
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+251-91-234-5678"
                    className="dark:bg-black dark:text-white dark:border-gray-800 focus:dark:border-gray-600"
                    required
                  />
                  <Label className="dark:text-white">
                    {t.businessInfo.businessType}
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full dark:bg-black dark:text-white dark:border-gray-800">
                      <SelectValue placeholder="Select a business type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-black dark:border-gray-800">
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            type="submit"
            className="w-1/3 dark:bg-white dark:text-black dark:border dark:border-gray-800 dark:hover:bg-gray-900"
          >
            {t.registerButton}
          </Button>
          <CardDescription className="dark:text-gray-400">
            {t.terms}{" "}
            <HoverCard>
              <HoverCardTrigger>
                <Link
                  href="/app/legal/terms"
                  target="_blank"
                  className="underline hover:dark:text-gray-300"
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
              <HoverCardTrigger>
                <Link
                  href="/app/legal/privacy"
                  target="_blank"
                  className="underline hover:dark:text-gray-300"
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
            .
          </CardDescription>
          <div className="mt-4 text-sm dark:text-gray-400">
            {t.haveAccount}{" "}
            <Link
              href="/auth/login"
              className="underline hover:dark:text-gray-300"
            >
              {t.login}
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}