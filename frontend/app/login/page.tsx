import {Header} from "@/features/landingPage/components/header";
import {LoginForm} from "@/features/login/forms/components/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">Prihlásenie</h1>
                        <p className="text-muted-foreground">Prihláste sa do svojho účtu Knihy jázd</p>
                    </div>
                    <LoginForm/>
                </div>
            </main>
        </div>
    )
}