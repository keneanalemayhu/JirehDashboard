"use client";

import { useAuth } from "@/hooks/use-auth";
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
import { useRouter, useSearchParams } from "next/navigation";


function ResetPasswordFormContent() {
  const { language } = useLanguage();
  const t = translations[language].resetPassword;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract token and email from search parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const { resetPassword } = useAuth();

  const { user } = useAuth();
  if(user){
    console.log("Current user:", user);
  }else{
    console.log("No user found");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !token) {
      setError("Missing email or token");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Sending reset password request:", { email, token }); // Debug log
      const response = await resetPassword(email, token, newPassword);
      console.log("Reset password response:", response); // Debug log
      router.push('/auth/login');
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(
        error.response?.data?.errors?.token ||
        error.response?.data?.errors?.email ||
        error.response?.data?.errors?.new_password ||
        error.response?.data?.message ||
        "Error resetting password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2 relative">
              <Label className="dark:text-white">{t.newPassword}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
              >
                {t.backToLogin}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export function ResetPasswordForm() {
  return <ResetPasswordFormContent />;
}
