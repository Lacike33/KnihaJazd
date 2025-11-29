import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";
import {Users, Link2, Coins, BarChart3, CheckCircle2, TrendingUp} from "lucide-react"
import Link from "next/link"

export default function AffiliatePage() {
    return (
        <div className="min-h-screen">
            <Header/>
            <main>
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                                Partnerský a affiliate program
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Zarábajte provízie alebo získavajte kredity na predplatné, keď odporučíte Knihu jázd
                                svojim klientom,
                                kolegom alebo známym.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button size="lg" asChild>
                                    <Link href="/partners/register">Zaregistrovať sa ako partner</Link>
                                </Button>
                                <Button size="lg" variant="outline">
                                    Kontaktovať nás
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pre účtovníkov */}
                <section className="py-20 border-t">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-5xl space-y-12">
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pre účtovníkov a daňových
                                    poradcov</h2>
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Pomôžte svojim klientom splniť zákonné požiadavky a získajte za to odmenu
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="p-8">
                                    <h3 className="text-xl font-bold mb-4">Výzva vašich klientov</h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <span className="text-destructive">•</span>
                                            <span>Od roku 2026 prísnejšie pravidlá pre knihy jázd a DPH</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-destructive">•</span>
                                            <span>Neistota, či vedú evidenciu správne</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-destructive">•</span>
                                            <span>Manuálne Excel tabuľky sú časovo náročné a nespoľahlivé</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-destructive">•</span>
                                            <span>Chýbajúce dôkazy a fotodokumentácia</span>
                                        </li>
                                    </ul>
                                </Card>

                                <Card className="p-8 bg-primary/5 border-primary/20">
                                    <h3 className="text-xl font-bold mb-4">Vaše riešenie s Knihou jázd</h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                                            <span>Klienti vedú evidenciu podľa § 85n automaticky</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                                            <span>Ušetríte čas pri vysvetľovaní a kontrole</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                                            <span>Fotodokumentácia a archivácia zaručená</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                                            <span>A vy získavate províziu za každého klienta</span>
                                        </li>
                                    </ul>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-center">Ako funguje partnerský program</h3>
                                <div className="grid gap-6 md:grid-cols-3">
                                    <Card className="p-6">
                                        <div
                                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                                            <Users className="h-7 w-7 text-primary"/>
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2">1. Zaregistrujte sa</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Vytvorte si účet účtovníka/partnera a získajte svoj osobný partnerský odkaz.
                                        </p>
                                    </Card>

                                    <Card className="p-6">
                                        <div
                                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                                            <Link2 className="h-7 w-7 text-primary"/>
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2">2. Zdieľajte odkaz</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Pošlite link emailom, pridajte do podpisu, fakturačného systému alebo na váš
                                            web.
                                        </p>
                                    </Card>

                                    <Card className="p-6">
                                        <div
                                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                                            <Coins className="h-7 w-7 text-primary"/>
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2">3. Získavajte odmenu</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Za každého platiaceho klienta dostanete províziu v € alebo kredity na
                                            vlastné predplatné.
                                        </p>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Affiliate pre všetkých */}
                <section className="py-20 border-t bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-5xl space-y-12">
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    Affiliate program pre všetkých zákazníkov
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Nie ste účtovník? Žiadny problém. Každý platící zákazník má prístup k vlastnému
                                    odporúčaciemu linku
                                    priamo v aplikácii.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="p-6">
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Link2 className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Vlastný referenčný link</h3>
                                    <p className="text-sm text-muted-foreground">
                                        V sekcii &ldquo;Affiliate&rdquo; nájdete svoj jedinečný odkaz pripravený na zdieľanie.
                                    </p>
                                </Card>

                                <Card className="p-6">
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <TrendingUp className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Odmena za odporúčanie</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Provízia na účet alebo kredity znižujúce vaše vlastné náklady na predplatné.
                                    </p>
                                </Card>

                                <Card className="p-6">
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <BarChart3 className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Prehľadný dashboard</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Sledujte kliky, registrácie, a vaše celkové výnosy v reálnom čase.
                                    </p>
                                </Card>
                            </div>

                            <Card className="p-8 bg-background">
                                <h3 className="text-xl font-bold mb-4">Príklad výpočtu</h3>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>Predstavte si, že odporučíte aplikáciu 5 kolegom podnikateľom:</p>
                                    <ul className="space-y-2 list-disc list-inside ml-4">
                                        <li>3 si vyberú Štartovací balík (19 € / mesiac)</li>
                                        <li>2 si vyberú Rozšírený balík (39 € / mesiac)</li>
                                    </ul>
                                    <p className="font-semibold text-foreground pt-2">
                                        = pravidelná mesačná odmena + možnosť vlastného predplatného zadarmo
                                    </p>
                                    <p className="text-sm italic">Presné percentá a podmienky zistíte po
                                        registrácii.</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 border-t">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center space-y-8">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pripravení začať?</h2>
                            <p className="text-lg text-muted-foreground">
                                Či už ste účtovník, daňový poradca, alebo len spokojný zákazník – môžete zarábať
                                odporúčaním Knihu jázd.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/partners/register">Vytvoriť partnerský účet</Link>
                                </Button>
                                <Button size="lg" variant="outline">
                                    Máte otázky? Kontaktujte nás
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    )
}
