import { mockAuthApi } from "../mock-api"
import type { User, LoginResponse } from "../types"

export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
  console.log("[v0] Login with mock data:", credentials.email)
  const result = await mockAuthApi.login(credentials.email, credentials.password)
  console.log("[v0] Mock login success:", result)

  // Store token in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", result.access_token)
  }

  return result
}

export async function getCurrentUser(): Promise<User> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  if (!token) {
    throw new Error("No token found")
  }

  console.log("[v0] Getting current user with token:", token)
  const user = await mockAuthApi.getCurrentUser(token)
  console.log("[v0] Current user:", user)
  return user
}

// Alias for compatibility
export const getMe = getCurrentUser

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}
