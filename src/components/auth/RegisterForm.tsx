"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
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
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { Icons } from "@/components/common/auth/AuthIcons";
import AuthHeader from "@/components/common/auth/AuthHeader";
import { useAuth } from "@/hooks/use-auth";
import { parsePhoneNumberFromString } from "libphonenumber-js";

//business_profile

// interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function RegisterForm() {
  const { language } = useLanguage(); // Updated to remove toggleLanguage
  const t = translations[language].register;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  const generateUsername = (fullName: string) => {
    return fullName.toLowerCase().trim().split(/\s+/).join(".");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    setUsername(generateUsername(newName));
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only letters, numbers, and dots
    const newUsername = event.target.value
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "");
    setUsername(newUsername);
  };

  const validateBusinessType = (type: string) => {
    const validTypes = ["retail", "wholesale", "service", "other"];
    return type ? validTypes.includes(type.toLowerCase()) : true;
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = event.target.value;
    setPhone(phoneNumber); // Store raw input first
  };

  const handleBusinessPhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phoneNumber = event.target.value;
    setBusinessPhone(phoneNumber); // Store raw input first
  };

  const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber?.trim()) return null;
    try {
      const parsedNumber = parsePhoneNumberFromString(phoneNumber, "US");
      return parsedNumber?.isValid() ? parsedNumber.format("E.164") : null;
    } catch (err) {
      console.log("Phone formatting error:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate required fields
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate business type if provided
    if (businessType && !validateBusinessType(businessType)) {
      setError("Invalid business type selected");
      setIsLoading(false);
      return;
    }

    try {
      // Create registration data object, omitting empty values
      const registrationData: any = {
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
      };

      // Only add optional fields if they have non-empty values
      if (firstName?.trim()) registrationData.first_name = firstName.trim();
      if (lastName?.trim()) registrationData.last_name = lastName.trim();

      const formattedPhone = formatPhoneNumber(phone);
      if (formattedPhone) {
        registrationData.phone_number = formattedPhone;
      }

      // Only add business profile if there's actual data
      const formattedBusinessPhone = formatPhoneNumber(businessPhone);
      const hasBusinessData =
        businessName?.trim() || businessType?.trim() || formattedBusinessPhone;

      if (hasBusinessData) {
        registrationData.business_profile = {};
        if (businessName?.trim())
          registrationData.business_profile.business_name = businessName.trim();
        if (businessType?.trim())
          registrationData.business_profile.business_type = businessType
            .trim()
            .toLowerCase();
        if (formattedBusinessPhone) {
          registrationData.business_profile.business_phone =
            formattedBusinessPhone;
        }
      }

      console.log(
        "Submitting registration data:",
        JSON.stringify(registrationData, null, 2)
      );
      await register(registrationData);
    } catch (err: any) {
      console.error("Registration Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
      });

      let errorMessage = "";

      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          // Handle nested error objects
          const processErrors = (obj: any, prefix = ""): string[] => {
            return Object.entries(obj).flatMap(([key, value]) => {
              if (Array.isArray(value)) {
                return [`${prefix}${key}: ${value.join(", ")}`];
              }
              if (typeof value === "object" && value !== null) {
                return processErrors(value, `${prefix}${key}: `);
              }
              return [`${prefix}${key}: ${value}`];
            });
          };

          errorMessage = processErrors(data).join("\n");
        } else {
          errorMessage = String(data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = "An unexpected error occurred during registration";
      }

      setError(errorMessage);
      console.error("Detailed Registration Error:", errorMessage); // Log detailed error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row">
      {/* Theme and Language Toggles - Fixed position */}
      <AuthHeader />

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
                  placeholder={t.personalInfo.namePlaceholder}
                  value={name}
                  onChange={handleNameChange}
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-white">
                  {t.personalInfo.username}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t.personalInfo.usernamePlaceholder}
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={false}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userPhone" className="text-white">
                  {t.personalInfo.phone}
                </Label>
                <Input
                  id="userPhone"
                  type="tel"
                  placeholder="0911121314"
                  value={phone}
                  onChange={handlePhoneChange}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">
                  {t.businessInfo.businessName}
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder={t.businessInfo.businessNamePlaceholder}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
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
                  placeholder="0911121314"
                  value={businessPhone}
                  onChange={handleBusinessPhoneChange}
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessType">
                  {t.businessInfo.businessType}
                </Label>
                <Select
                  value={businessType}
                  onValueChange={(value) => setBusinessType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t.businessInfo.businessTypePlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="mt-4" disabled={isLoading}>
                {t.registerButton}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div>
              {t.terms} <br />
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
