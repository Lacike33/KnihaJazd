"use server";

import { deleteTokens } from "./tokenActions";


// * -----------------------------------
// * Logout
// * -----------------------------------

export async function logoutClient() {
  await deleteTokens();
  return {
    code: 204,
    message: "",
    msg_code: "",
    error: {
      isError: false,
    },
  };
}
