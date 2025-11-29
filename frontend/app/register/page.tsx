"use client";

import type React from "react";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {login} from "@/lib/api/auth";
import {useAuth} from "@/providers/auth-provider";
import {Car} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    const {login: authLogin} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({email, password});
            authLogin(response);
            toast({
                title: "Prihlásenie úspešné",
                description: "Vitajte späť!",
            });
        } catch (error) {
            toast({
                title: "Chyba prihlásenia",
                description: error instanceof Error ? error.message : "Nesprávne prihlasovacie údaje",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <Link href={"/"}>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <Car className="h-6 w-6 text-primary-foreground"/>
                        </div>
                    </Link>
                    <div>
                        <CardTitle className="text-2xl">Kniha jázd</CardTitle>
                        <CardDescription>Prihláste sa do svojho účtu</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="vas@email.sk" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Heslo</Label>
                            <Input id="password" type="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Prihlasujem..." : "Prihlásiť sa"}
                        </Button>
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
