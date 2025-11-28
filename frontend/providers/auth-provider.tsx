"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, setToken } from "@/lib/api";
import type { User, LoginResponse } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const token = getToken()
  //     if (!token) {
  //       setLoading(false)
  //       return
  //     }

  //     try {
  //       const userData = await getMe()
  //       setUser(userData)
  //     } catch (error) {
  //       console.error("Auth error:", error)
  //       removeToken()
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   initAuth()
  // }, [])

  const login = (response: LoginResponse) => {
    setToken(response.access_token);
    setUser(response.user);
    router.push("/dashboard");
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/login");
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
