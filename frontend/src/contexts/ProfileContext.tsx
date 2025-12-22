// contexts/ProfileContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Profile {
  name: string;
  email: string;
  phone: string;
  accountType: string;
  specialization: string;
  strNumber: string;
  status: string;
  photoUrl: string;
  workplace?: string;
  joinDate?: string;
}

interface ProfileContextType {
  profileData: Profile;
  setProfileData: (data: Profile) => void;
}

const defaultProfile: Profile = {
  name: "Nabila",
  email: "nabila@example.com",
  phone: "08123456789",
  accountType: "Perawat",
  specialization: "Gigi Anak",
  strNumber: "STR123456",
  status: "Aktif",
  photoUrl: "",
  workplace: "RosyDental",
  joinDate: "2025-12-01",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<Profile>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
