"use server";

import { config } from "@/config/config";
import { getToken } from "../actions/tokenActions";

export const getCurrentUser = async () => {
  const response = await fetch(`${config.apiUrl}/v1/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const user = await response.json();

  if (response.status !== 200) {
    return null;
  }

  return user;
};
