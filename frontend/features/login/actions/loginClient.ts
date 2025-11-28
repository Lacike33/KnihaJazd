"use server";

import { jwtDecode, JwtPayload } from "jwt-decode";
import { config } from "@/config/config";
import { TActionResponse } from "../types/loginTypes";
import { setRefreshToken, setToken } from "./tokenActions";
import { serverError } from "@/utils/helpers/serverError";

// * -----------------------------------
// * Login
// * -----------------------------------

interface IJwtPayload extends JwtPayload {
  user_id: string;
}

export async function loginClient(prevState: TActionResponse, formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await fetch(`${config.apiUrl}/v1/accounts/signin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: rawData.email,
        password: rawData.password,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.status === 401) {
      return {
        code: response.status,
        message: data.message || "Invalid username or password",
        msg_code: data.msg_code || "UNKNOWN_CODE",
        error: {
          isError: true,
        },
        inputs: {
          email: rawData.email,
        },
      };
    }

    if (response.status === 200) {
      await setToken(data.data.access);
      await setRefreshToken(data.data.refresh);
      const decodedToken = (await jwtDecode(data.data.access)) as IJwtPayload;
      return {
        code: response.status,
        message: data.message || "",
        msg_code: data.msg_code || "UNKNOWN_CODE",
        error: {
          isError: false,
        },
        inputs: {
          email: "",
        },
        data: {
          userId: decodedToken.user_id,
        },
      };
    }
    return {
      code: response.status,
      message: data.message || "",
      msg_code: data.msg_code || "UNKNOWN_CODE",
      error: {
        isError: true,
      },
      inputs: {
        email: rawData.email,
      },
    };
  } catch {
    return serverError();
  }
}
