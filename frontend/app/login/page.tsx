"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/features/login/components/loginForm";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { user } = useAuth();

  if (user) redirect("/dashboard");

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
          <LoginForm />
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
