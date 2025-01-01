import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LocationFormData } from "@/types/dashboard/business/location";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(
      /^(?:\+251|0)?(?:-?\s*)?(?:9\d{8}|2\d{9})$/,
      "Contact number must be in format: +251-XX-XXX-XXXX"
    ),
  isActive: z.boolean().default(true),
});

interface LocationFormProps {
  initialData?: LocationFormData;
  onSubmit: (data: LocationFormData) => void;
  isLoading?: boolean;
}

export function LocationForm({
  initialData,
  onSubmit,
  isLoading = false,
}: LocationFormProps) {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      contactNumber: initialData?.contactNumber || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter location name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+251-XX-XXX-XXXX"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  {field.value ? "Location is active and visible" : "Location is inactive and hidden"}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Location"}
        </Button>
      </form>
    </Form>
  );
}
