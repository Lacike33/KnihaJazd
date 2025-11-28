"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import Link from "next/link";
import { loginClient } from "@/features/login/actions/loginClient";

export default function LoginPage() {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <Link href={"/"}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl">Kniha jázd</CardTitle>
            <CardDescription>Prihláste sa do svojho účtu</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
          <div className="mt-6 space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="font-semibold text-foreground">Testovacie účty:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                <strong>Admin:</strong> admin@knihajazd.sk / admin123
              </p>
              <p>
                <strong>Vodič:</strong> vodic@knihajazd.sk / vodic123
              </p>
              <p>
                <strong>Účtovník:</strong> uctovnik@knihajazd.sk / uctovnik123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
