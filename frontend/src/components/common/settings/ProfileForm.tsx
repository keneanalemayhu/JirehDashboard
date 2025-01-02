"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useCallback } from "react";

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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { fetchProfileData, updateProfileData } from "@/lib/api/profile";
import { useEffect } from "react";

const profileFormSchema = z.object({
  username: z.string().min(2).max(30),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchProfileData();
      form.reset({
        username: data.username || "",
      });
      setAvatar(data.avatar);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    let mounted = true;

    if (mounted && isLoading) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [fetchData, isLoading]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", data.username);

    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const response = await updateProfileData(formData);
      toast.success("Profile updated successfully");
      setAvatar(response.avatar);
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  function removeAvatar() {
    setAvatar(null);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={avatar || "/avatar/person.png"}
                      alt="Profile picture"
                    />
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          form.setValue("avatar", event.target.files);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatar(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {avatar && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={removeAvatar}
                      >
                        Remove picture
                      </Button>
                    )}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}