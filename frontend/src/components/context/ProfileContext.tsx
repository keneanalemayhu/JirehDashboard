"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchProfileData, updateProfileData } from '@/lib/api/profile';
import { toast } from 'sonner';

interface ProfileData {
  username: string;
  email: string;
  avatar: string | null;
}

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  refetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

let profileCache: ProfileData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(profileCache);
  const [isLoading, setIsLoading] = useState(!profileCache);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    const now = Date.now();
    if (profileCache && now - lastFetchTime < CACHE_DURATION) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProfileData();
      const profileData = {
        username: data.username || '',
        email: data.email || '',
        avatar: data.avatar || null,
      };
      setProfile(profileData);
      profileCache = profileData;
      lastFetchTime = now;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err as Error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (data: any) => {
    try {
      setIsLoading(true);
      const updatedData = await updateProfileData(data);
      const profileData = {
        username: updatedData.username || '',
        email: updatedData.email || '',
        avatar: updatedData.avatar || null,
      };
      setProfile(profileData);
      profileCache = profileData;
      lastFetchTime = Date.now();
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refetchProfile: fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
