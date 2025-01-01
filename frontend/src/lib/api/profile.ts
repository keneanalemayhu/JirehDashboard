// lib/api/profile.ts
import { api } from "./api";
import { ProfileData,ProfileFormData } from "@/types/dashboard/business/profile";

export async function fetchProfileData() {
  try {
    const response = await api.get("/api/auth/profile/");
    return response.data;
  } catch (error) {
    console.error("[profileApi.fetch] Error:", error);
    throw error;
  }
}


export async function updateProfileData(data: FormData) {
    try {
        const response = await api.put("/api/auth/profile/", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("[accountApi.update] Error:", error);
        throw error;
    }
  }