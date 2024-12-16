import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales | Dashboard", // This will be inserted into the template
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}
