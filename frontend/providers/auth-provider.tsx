"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { deleteTokens, getToken } from "@/features/login/actions/tokenActions";
import { getCurrentUser } from "@/features/login/data/getCurrentUser";
import { User } from "@/features/login/types/userTypes";
import { redirect } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasRole: (roles: string | string[]) => boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (user) return;

      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        deleteTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [user]);

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes("admin");
  };

  const login = async () => {
    const user = await getCurrentUser();

    setUser(user);
    redirect("/dashboard");
  };

  const logout = () => {
    setUser(null);
    redirect("/");
  };

  return <AuthContext.Provider value={{ user, loading, hasRole, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
