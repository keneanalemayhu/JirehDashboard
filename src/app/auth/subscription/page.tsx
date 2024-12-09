import SubscriptionForm from "@/components/auth/SubscriptionForm";

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>
      <SubscriptionForm />
    </div>
  );
}
