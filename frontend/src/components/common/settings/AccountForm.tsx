"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import { fetchAccountData, updateAccountData } from "@/lib/api/account";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const accountFormSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone_number: z.string().optional(),
  current_password: z.string().optional().or(z.string().min(8)),
  new_password: z.string().optional().or(z.string().min(8)),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      current_password: "",
      new_password: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAccountData();
        form.reset(data);
      } catch (error) {
        console.error("Error fetching account data:", error);
        toast.error("Failed to fetch account data.");
      }
    };
  
    fetchData();
  }, []); // Empty dependency array

  function onSubmit(data: AccountFormValues) {
    // Submit form data to the backend
    updateAccountData(data)
      .then(response => {
        console.log("Account updated successfully:", response);
        toast.success("Account updated successfully.");
      })
      .catch(error => {
        console.error("Error updating account:", error);
        toast.error("Failed to update account.");
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+251-91-112-1314" {...field} />
              </FormControl>
              <FormDescription>
                This is the phone associated with your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="abebe@email.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the email associated with your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                This is the password your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Enter a new password to update your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
