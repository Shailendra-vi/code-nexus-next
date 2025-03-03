"use client";

import Admin from "@/components/Admin";
import { useAuth } from "@/context/AuthContext";
import User from "@/components/User";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return;
  }

  return <>{user.role === "ADMIN" ? <Admin /> : <User />} </>;
}
