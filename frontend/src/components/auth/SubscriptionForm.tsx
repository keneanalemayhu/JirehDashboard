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
import { PaymentDialog } from "./PaymentDialog";

function SubscriptionFormContent() {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].subscription;

  const getYearlyPrice = (monthlyPrice: number) => {
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
      {/* Existing header and back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/auth/register">
          <Button variant="ghost" className="gap-2">
            <MoveLeft className="h-5 w-5" />
            {t.back}
          </Button>
        </Link>
      </div>

      <AuthHeader />

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold text-center mb-10">{t.title}</h1>

        {/* Pricing disclaimer */}
        <div className="bg-muted/50 rounded-lg p-4 mb-10 max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            {t.disclaimer}
          </p>
          <p className="text-center text-muted-foreground text-sm mt-2">
            * All prices are exclusive of 15% TOT
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center mb-10">
          <ToggleGroup
            type="single"
            value={isYearly ? "yearly" : "monthly"}
            onValueChange={(value) => setIsYearly(value === "yearly")}
            className="bg-muted inline-flex items-center rounded-full p-1"
          >
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-6 py-2 text-sm data-[state=on]:bg-background"
              aria-label="Monthly billing"
            >
              {t.monthly}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-6 py-2 text-sm data-[state=on]:bg-background"
              aria-label="Yearly billing"
            >
              <span>{t.yearly}</span>
              {isYearly && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-orange-100 text-orange-600 hover:bg-orange-100"
                >
                  {t.save}
                </Badge>
              )}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Pricing cards */}
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
                      <span className="text-3xl font-bold">
                        {isYearly
                          ? `${Math.round(
                              getYearlyPrice(tier.monthlyPrice)
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
                {tier.monthlyPrice ? (
                  <PaymentDialog
                    price={
                      isYearly
                        ? getYearlyPrice(tier.monthlyPrice)
                        : tier.monthlyPrice
                    }
                  >
                    <Button className="w-full" variant="default">
                      {t.choosePlan}
                    </Button>
                  </PaymentDialog>
                ) : (
                  <Button
                    className="w-full"
                    disabled={tier.disabled}
                    variant="outline"
                  >
                    {tier.disabled ? t.comingSoon : t.contactSales}
                  </Button>
                )}
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
