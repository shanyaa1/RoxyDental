"use client";

import { ProfileProvider } from "@/contexts/ProfileContext";

export default function PerawatLayout({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}