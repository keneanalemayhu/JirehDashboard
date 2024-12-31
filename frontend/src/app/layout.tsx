import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Jireh-Dashboard",
    default: "JirehDashboard",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  description: "Simplify Management, Empower Businesses, Scale with Confidence",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "JirehDashboard",
    title: "JirehDashboard",
    description:
      "Simplify Management, Empower Businesses, Scale with Confidence",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/jireh.png`,
        width: 1200,
        height: 630,
        alt: "Jireh Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JirehDashboard",
    description:
      "Simplify Management, Empower Businesses, Scale with Confidence",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/jireh.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}