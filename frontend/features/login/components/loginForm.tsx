"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { loginClient } from "../actions/loginClient";
import { useAuth } from "@/providers/auth-provider";

const LoginForm = () => {
  const { login } = useAuth();
  const [state, formAction, isLoading] = useActionState(loginClient, {
    code: 0,
    message: "",
    msg_code: "",
    error: { isError: false },
    inputs: {
      email: "",
    },
    data: { userId: "" },
  });

  useEffect(() => {
    if (state.code === 200) {
      login();
    }
  }, [state.code, login]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" placeholder="vas@email.sk" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Heslo</Label>
        <Input id="password" type="password" name="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Prihlasujem..." : "Prihlásiť sa"}
      </Button>
      {state.error.isError && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
};

export default LoginForm;
