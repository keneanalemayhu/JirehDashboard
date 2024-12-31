"use client";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/auth";
import { Icons } from "@/components/common/auth/AuthIcons";
import AuthHeader from "@/components/common/auth/AuthHeader";

// Reusable Logo Component
const LogoWithName = ({ className }: { className?: string }) => (
  <div
    className={`relative z-20 flex items-center text-lg font-medium ${className}`}
  >
    <Icons.logo className="mr-2 h-6 w-6" /> Jireh-Group
  </div>
);

export function PrivacyContent() {
  const { language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = translations[language].login;

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Mobile Logo */}
      <div className="lg:hidden w-full px-4 pt-6 pb-8">
        <LogoWithName />
      </div>

      {/* Desktop Logo */}
      <div className="hidden lg:block lg:fixed lg:top-10 lg:left-10">
        <LogoWithName />
      </div>

      {/* Framed Terms of Service Content */}
      <div className="flex flex-col items-center justify-center w-full h-full px-6 py-10">
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg overflow-y-auto h-[80vh]">
          <h1 className="text-2xl font-bold mb-4">
            Proprietary Software License Agreement
          </h1>
          <p>
            <strong>
              Copyright (c) 2024 Kenean Alemayhu Tilahun - Jireh-Group
            </strong>
          </p>
          <p>All rights reserved.</p>

          <h2 className="text-xl font-semibold mt-6">1. DEFINITIONS</h2>
          <p>
            <strong>"Software"</strong> refers to the Retail Business Management
            System and all its components.
          </p>
          <p>
            <strong>"Service"</strong> means the Software and any related
            services provided by Jireh-Group.
          </p>
          <p>
            <strong>"User"</strong> means any person or entity accessing or
            using the Software.
          </p>
          <p>
            <strong>"Subscriber"</strong> refers to the business entity that has
            purchased a subscription.
          </p>
          <p>
            <strong>"Subscription"</strong> means the paid right to access and
            use the Software.
          </p>
          <p>
            <strong>"Data"</strong> means any information processed or stored
            through the Software.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. LICENSE GRANT</h2>
          <p>
            This software is proprietary to Jireh-Group. Access is granted only
            through valid subscription and user agreements. The license is:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Non-exclusive</li>
            <li>Non-transferable</li>
            <li>Revocable</li>
            <li>Subject to continuous payment of subscription fees</li>
            <li>Limited to the subscription term</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. SUBSCRIPTION TERMS</h2>
          <h3 className="text-lg font-semibold mt-4">3.1 Duration</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Subscriptions are offered on a monthly basis</li>
            <li>Auto-renewal unless cancelled</li>
            <li>Minimum term commitments may apply</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">3.2 Payment Terms</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Fees are due in advance</li>
            <li>Non-payment leads to service suspension</li>
            <li>Prices subject to change with notice</li>
            <li>No refunds for partial months</li>
          </ul>

          {/* Add more sections here as needed */}

          <h2 className="text-xl font-semibold mt-6">16. GOVERNING LAW</h2>
          <p>
            This agreement is governed by the laws of Ethiopia. Any disputes
            shall be resolved in the courts of Ethiopia.
          </p>

          <div className="pt-6">
            <p>
              <strong>For licensing inquiries:</strong>
            </p>
            <p>Contact: Kenean Alemayhu Tilahun</p>
            <p>Email: keneanalemayhu@jireh-group.tech</p>
            <p>Phone: +251-93-560-9339</p>
            <p>Jireh-Group</p>
            <p>Bole, Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Header */}
      <div className="w-1/2 flex justify-end p-10">
        <AuthHeader />
      </div>
    </div>
  );
}
