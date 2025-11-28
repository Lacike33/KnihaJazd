"use server";

import { config } from "@/config/config";
import { cookies } from "next/headers";

const AUTH_TOKEN_AGE = 1800;
const REFRESH_TOKEN_AGE = 604800;
const TOKEN_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";

// * -----------------------------------
// * Get Access Token
// * -----------------------------------

export async function getToken() {
  return (await cookies()).get(TOKEN_NAME)?.value;
}

// * -----------------------------------
// * Get Refresh Token
// * -----------------------------------

export async function getRefreshToken() {
  return (await cookies()).get(TOKEN_REFRESH_NAME)?.value;
}

// * -----------------------------------
// * Set Token
// * -----------------------------------

export async function setToken(authToken: string) {
  (await cookies()).set({
    name: TOKEN_NAME,
    value: authToken,
    httpOnly: true, // limit client-side js
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: AUTH_TOKEN_AGE,
  });
  return;
}

// * -----------------------------------
// * Set Refresh Token
// * -----------------------------------

export async function setRefreshToken(authRefreshToken: string) {
  (await cookies()).set({
    name: TOKEN_REFRESH_NAME,
    value: authRefreshToken,
    httpOnly: true, // limit client-side js
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: REFRESH_TOKEN_AGE,
  });
  return;
}

// * -----------------------------------
// * Delete tokens
// * -----------------------------------

export async function deleteTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_REFRESH_NAME);
  cookieStore.delete(TOKEN_NAME);
  return;
}

// * -----------------------------------
// * Refresh Access Token
// * -----------------------------------

export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const formData = new URLSearchParams();
  formData.append("refresh", refreshToken);

  const response = await fetch(`${config.apiUrl}/v1/accounts/signin/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();
  console.log(`REFRESH TOKEN`);
  console.log(data);
  if (data.access) {
    await setToken(data.access);
    return data.access;
  }

  return null;
};
