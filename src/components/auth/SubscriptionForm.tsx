"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const tiers = [
  {
    name: "Basic",
    monthlyPrice: 2499,
    features: [
      "Single location management",
      "Up to 3 user accounts",
      "Basic inventory tracking",
      "Simple sales reporting",
      "Email support",
      "Basic order management",
      "5GB storage",
      "Standard security features",
    ],
  },
  {
    name: "Standard",
    monthlyPrice: 3499,
    features: [
      "Up to 3 locations",
      "Up to 10 user accounts",
      "Advanced inventory management",
      "Detailed sales analytics",
      "Priority email support",
      "Comprehensive order tracking",
      "15GB storage",
      "Enhanced security features",
      "Employee management",
      "Basic API access",
      "Export reports (PDF, Excel)",
      "Automated backup",
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 7499,
    features: [
      "Unlimited locations",
      "Unlimited user accounts",
      "Real-time inventory sync",
      "Advanced analytics dashboard",
      "24/7 email & phone support",
      "Custom reporting",
      "Unlimited storage",
      "Premium security features",
      "Advanced employee management",
      "Full API access",
      "Bulk operations",
      "Custom roles & permissions",
      "Integration capabilities",
      "Automated notifications",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    features: [
      "Unlimited locations",
      "Unlimited user accounts",
      "Enterprise-grade analytics",
      "Dedicated account manager",
      "Custom implementation support",
      "Unlimited storage",
      "Military-grade security",
      "White-label options",
      "Advanced integrations",
      "Custom API solutions",
      "Multi-branch management",
      "Advanced audit logs",
      "Priority feature requests",
      "Customized training",
      "SLA guarantees",
    ],
  },
];

export default function SubscriptionForm() {
  const [isYearly, setIsYearly] = useState(false);

  const getYearlyPrice = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return null;
    return monthlyPrice * 12 * 0.84; // 16% discount
  };

  return (
    <>
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
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="yearly"
            className="rounded-full px-6 py-2 text-sm data-[state=on]:bg-background transition-all duration-300 ease-in-out"
            aria-label="Yearly billing"
          >
            <span>Yearly</span>
            {isYearly && (
              <Badge
                variant="secondary"
                className="ml-2 bg-orange-100 text-orange-600 hover:bg-orange-100 transition-all duration-300 ease-in-out"
              >
                Save 16%
              </Badge>
            )}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
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
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </>
                ) : (
                  "Contact Sales"
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
              <Button className="w-full">
                {tier.monthlyPrice ? "Choose Plan" : "Contact Sales"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
