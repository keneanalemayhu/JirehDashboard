"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import { da } from "date-fns/locale";

const profileFormSchema = z.object({
  username: z.string().min(2).max(30),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        form.reset(data);
        setAvatar(data.avatar); // Ensure avatar state is updated
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchData();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    const formData = new FormData();
    formData.append("username", data.username);

    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    console.log("Submitting data:", Object.fromEntries(formData)); // Debug line

    try {
      const response = await updateProfileData(formData);
      toast.success("Profile updated successfully");
      setAvatar(response.avatar); // Ensure avatar state is updated
    } catch (error: any) {
      console.error("Error details:", error.response?.data); // Debug line
      toast.error("Failed to update profile");
    }
  }

  function removeAvatar() {
    setAvatar(null);
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
                      src={avatar || "/avatar/person.png"} // Ensure src is set correctly
                      alt="Profile picture"
                    />
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*" // Correct the accept attribute
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
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
