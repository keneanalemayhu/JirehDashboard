//src/types/dashboard/business/profile.ts
export interface ProfileData {
    username: string;
    avatar: string | null;
  }
  
  export interface ProfileFormData {
    username: string;
    avatar?: File;
  }