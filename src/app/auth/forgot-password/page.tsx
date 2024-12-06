// app/auth/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <ForgotPasswordForm />
    </div>
  );
}