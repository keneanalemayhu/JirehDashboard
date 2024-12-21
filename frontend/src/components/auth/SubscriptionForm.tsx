"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MoveLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useLanguage,
  LanguageProvider,
} from "@/components/context/LanguageContext";
import AuthHeader from "@/components/common/auth/AuthHeader";
import { translations } from "@/translations/auth/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

function SubscriptionFormContent() {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].subscription;

  const getYearlyPrice = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return null;
    return monthlyPrice * 12 * 0.84;
  };

  const tiers = [
    {
      name: t.professional.name,
      monthlyPrice: 9999,
      features: t.professional.features,
      disabled: false,
    },
    {
      name: t.enterprise.name,
      monthlyPrice: null,
      features: t.enterprise.features,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen w-full py-10">
      <div className="fixed top-4 left-4 z-50">
        <Link href="/auth/register">
          <Button variant="ghost" className="gap-2">
            <MoveLeft className="h-5 w-5" />
            {t.back}
          </Button>
        </Link>
      </div>

      {/* Theme and Language Toggles - Fixed position */}
      <AuthHeader />

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold text-center mb-10">{t.title}</h1>
        <div className="bg-muted/50 rounded-lg p-4 mb-10 max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            {t.disclaimer}
          </p>
        </div>
        <div className="flex justify-center items-center mb-10">
          <ToggleGroup
            type="single"
            value={isYearly ? "yearly" : "monthly"}
            onValueChange={(value) => setIsYearly(value === "yearly")}
            className="bg-muted inline-flex items-center rounded-full p-1 transition-all duration-300 ease-in-out"
          >
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-6 py-2 text-sm data-[state=on]:bg-background transition-all duration-300 ease-in-out"
              aria-label="Monthly billing"
            >
              {t.monthly}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-6 py-2 text-sm data-[state=on]:bg-background transition-all duration-300 ease-in-out"
              aria-label="Yearly billing"
            >
              <span>{t.yearly}</span>
              {isYearly && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-orange-100 text-orange-600 hover:bg-orange-100 transition-all duration-300 ease-in-out"
                >
                  {t.save}
                </Badge>
              )}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>
                  {tier.monthlyPrice ? (
                    <>
                      <span className="text-3xl font-bold transition-all duration-300 ease-in-out">
                        {isYearly
                          ? `${Math.round(
                              getYearlyPrice(tier.monthlyPrice) as number
                            ).toLocaleString()} ETB`
                          : `${tier.monthlyPrice.toLocaleString()} ETB`}
                      </span>
                      <span className="text-muted-foreground">
                        {isYearly ? t.perYear : t.perMonth}
                      </span>
                    </>
                  ) : (
                    t.contactSales
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={tier.disabled}
                  variant={tier.disabled ? "outline" : "default"}
                >
                  {tier.disabled
                    ? t.comingSoon
                    : tier.monthlyPrice
                    ? t.choosePlan
                    : t.contactSales}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionForm() {
  return (
    <LanguageProvider>
      <SubscriptionFormContent />
    </LanguageProvider>
  );
}
