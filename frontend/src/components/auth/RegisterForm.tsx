"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
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
import { RegisterData, useAuth } from "@/hooks/use-auth";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function RegisterForm() {
  const { language } = useLanguage(); // Updated to remove toggleLanguage
  const t = translations[language as keyof typeof translations].register;
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
  const [businessAddress, setBusinessAddress] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    username?: string;
    phone?: string;
    businessPhone?: string;
  }>({});

  const generateUsername = (fullName: string) => {
    return fullName.toLowerCase().trim().split(/\s+/).join(".");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: undefined }));
    return true;
  };

  const validateConfirmPassword = (confirmPass: string) => {
    if (confirmPass !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return false;
    }
    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    return true;
  };

  const validateName = (name: string) => {
    if (!name) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      return false;
    }
    if (name.length < 2) {
      setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validateUsername = (username: string) => {
    if (!username) {
      setErrors(prev => ({ ...prev, username: "Username is required" }));
      return false;
    }
    if (username.length < 3) {
      setErrors(prev => ({ ...prev, username: "Username must be at least 3 characters" }));
      return false;
    }
    setErrors(prev => ({ ...prev, username: undefined }));
    return true;
  };

  const validatePhone = (phone: string) => {
    if (phone) {
      // For numbers starting with +251, total length should be 13
      if (phone.startsWith('+251') && phone.length > 13) {
        setErrors(prev => ({ ...prev, phone: "Phone number too long" }));
        return false;
      }
      // For numbers starting with 0, total length should be 10
      if (phone.startsWith('0') && phone.length > 10) {
        setErrors(prev => ({ ...prev, phone: "Phone number too long" }));
        return false;
      }
      if (!phone.match(/^(\+251|0)\d+$/)) {
        setErrors(prev => ({ ...prev, phone: "Invalid phone number format" }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateBusinessPhone = (phone: string) => {
    if (phone) {
      // For numbers starting with +251, total length should be 13
      if (phone.startsWith('+251') && phone.length > 13) {
        setErrors(prev => ({ ...prev, businessPhone: "Phone number too long" }));
        return false;
      }
      // For numbers starting with 0, total length should be 10
      if (phone.startsWith('0') && phone.length > 10) {
        setErrors(prev => ({ ...prev, businessPhone: "Phone number too long" }));
        return false;
      }
      if (!phone.match(/^(\+251|0)\d+$/)) {
        setErrors(prev => ({ ...prev, businessPhone: "Invalid phone number format" }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, businessPhone: undefined }));
    return true;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    validateConfirmPassword(newConfirmPassword);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    setUsername(generateUsername(newName));
    validateName(newName);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value.toLowerCase().replace(/[^a-z0-9.]/g, "");
    setUsername(newUsername);
    validateUsername(newUsername);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNumber = event.target.value;
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Limit the length based on the prefix
    if (phoneNumber.startsWith('+251') && phoneNumber.length > 13) {
      phoneNumber = phoneNumber.slice(0, 13);
    } else if (phoneNumber.startsWith('0') && phoneNumber.length > 10) {
      phoneNumber = phoneNumber.slice(0, 10);
    }
    
    setPhone(phoneNumber);
    validatePhone(phoneNumber);
  };

  const handleBusinessPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNumber = event.target.value;
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Limit the length based on the prefix
    if (phoneNumber.startsWith('+251') && phoneNumber.length > 13) {
      phoneNumber = phoneNumber.slice(0, 13);
    } else if (phoneNumber.startsWith('0') && phoneNumber.length > 10) {
      phoneNumber = phoneNumber.slice(0, 10);
    }
    
    setBusinessPhone(phoneNumber);
    validateBusinessPhone(phoneNumber);
  };

  const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber?.trim()) return '';
    
    // Remove any non-digit characters
    let phone = phoneNumber.replace(/\D/g, '');
    
    // Handle Ethiopian numbers
    if (phone.length === 9) { // Format: 911234567
      return '+251' + phone;
    } else if (phone.length === 10 && phone.startsWith('0')) { // Format: 0911234567
      return '+251' + phone.substring(1);
    } else if (!phone.startsWith('+')) {
      return '+' + phone;
    }
    
    return phoneNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register button clicked"); // Log to check if function is called
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
      // Create registration data object, adhering to RegisterData interface
      const registrationData: RegisterData = {
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
        name: name.trim(),
        user_name: username.trim(),
        phone_number: formatPhoneNumber(phone),
        business_profile: businessName ? {
          business_name: businessName.trim(),
          business_type: businessType.trim(),
          business_phone: formatPhoneNumber(businessPhone),
          business_address: businessAddress.trim()
        } : undefined
      };

      // Remove undefined or empty string values
      Object.keys(registrationData).forEach(key => {
        if (registrationData[key as keyof RegisterData] === undefined || registrationData[key as keyof RegisterData] === '') {
          delete registrationData[key as keyof RegisterData];
        }
      });

      if (registrationData.business_profile) {
        if (registrationData.business_profile) {
          (Object.keys(registrationData.business_profile) as (keyof typeof registrationData.business_profile)[]).forEach(key => {
            if (registrationData.business_profile![key] === undefined || registrationData.business_profile![key] === '') {
              delete registrationData.business_profile![key];
            }
          });
        }
        
        // Remove business_profile if it's empty
        if (Object.keys(registrationData.business_profile).length === 0) {
          delete registrationData.business_profile;
        }
      }

      console.log(
        "Submitting registration data:",
        JSON.stringify(registrationData, null, 2)
      );

      // Call the register function from useAuth
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

  const validateBusinessType = (type: string) => {
    const validTypes = ["retail", "wholesale", "service", "other"];
    return type ? validTypes.includes(type.toLowerCase()) : true;
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
                <Label htmlFor="email" className="text-white">
                  {t.personalInfo.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.personalInfo.email}
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
              </div>
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
                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
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
                {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-white">
                  {t.personalInfo.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0911121314"
                  value={phone} // Add value prop
                  onChange={handlePhoneChange} // Add onChange handler
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700"
                />
                {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
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
                    value={password} // Add value prop
                    onChange={handlePasswordChange} // Add onChange handler
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
                {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
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
                    value={confirmPassword} // Add value prop
                    onChange={handleConfirmPasswordChange} // Add onChange handler
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
                {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
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
                  value={businessName} // Add value prop
                  onChange={(e) => setBusinessName(e.target.value)} // Add onChange handler
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="business-phone">
                  {t.businessInfo.businessPhone}
                </Label>
                <Input
                  id="business-phone"
                  type="tel"
                  placeholder="0911121314"
                  value={businessPhone} // Add value prop
                  onChange={handleBusinessPhoneChange} // Add onChange handler
                  disabled={isLoading}
                />
                {errors.businessPhone && <span className="text-sm text-red-500">{errors.businessPhone}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessAddress">
                  {t.businessInfo.businessAddress}
                </Label>
                <Input
                  id="businessAddress" // Corrected id
                  type="text"
                  placeholder={t.businessInfo.businessAddressPlaceholder}
                  value={businessAddress} // Add value prop
                  onChange={(e) => setBusinessAddress(e.target.value)} // Add onChange handler
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessType">
                  {t.businessInfo.businessType}
                </Label>
                <Select
                  value={businessType} // Add value prop
                  onValueChange={(value) => setBusinessType(value)} // Add onChange handler
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t.businessInfo.businessTypePlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-4" type="submit" disabled={isLoading}>
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
