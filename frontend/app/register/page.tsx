import {Header} from "@/features/landingPage/components/header";
import {ClientRegistrationForm} from "@/features/register/forms/components/client-registration-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Začnite s Knihou jázd</h1>
            <p className="text-muted-foreground">Vytvorte si účet a získajte prístup k elektronickej evidencii jázd</p>
          </div>
          <ClientRegistrationForm />
        </div>
      </main>
    </div>
  )
}
