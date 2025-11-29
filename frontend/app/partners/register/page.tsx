import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";
// import {PartnerRegistrationForm} from "@/components/forms/partner-registration"
import {Shield, Users, TrendingUp} from "lucide-react"
import {PartnerRegistrationForm} from "@/features/register/forms/components/partner-registration-form";

export default function PartnerRegisterPage() {
    return (
        <div className="min-h-screen">
            <Header/>
            <main className="py-20 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-5xl">
                        <div className="grid gap-12 lg:grid-cols-2 items-start">
                            {/* Left side - Info */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">Registrácia
                                        partnera</h1>
                                    <p className="text-lg text-muted-foreground">
                                        Vytvorte si partnerský účet a začnite zarábať provízie alebo kredity odporúčaním
                                        Knihy jázd.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                            <Shield className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Bezpečný prístup</h3>
                                            <p className="text-sm text-muted-foreground">Vaše údaje sú chránené a
                                                zabezpečené podľa GDPR</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                            <Users className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Pre účtovníkov aj jednotlivcov</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Či už ste firma alebo jednotlivec, program je otvorený pre všetkých
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                            <TrendingUp className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Okamžitý prístup</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Po registrácii získate svoj partnerský odkaz a prístup k dashboardu
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-lg bg-muted/50 border">
                                    <h3 className="font-semibold mb-2">Čo získate?</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Vlastný partnerský odkaz na sledovanie</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Dashboard s prehľadom príjmov</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Marketingové materiály na stiahnutie</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Pravidelné provízie alebo kredity</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right side - Form */}
                            <div className="lg:sticky lg:top-24">
                                <PartnerRegistrationForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
