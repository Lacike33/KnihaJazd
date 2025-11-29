import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Users, Link2, Coins, CheckCircle2} from "lucide-react"
import Link from "next/link"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";

export default function PartnersPage() {
    return (
        <div className="min-h-screen">
            <Header/>
            <main>
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                                Partnerský program pre profesionálov
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Pre účtovníkov, daňových poradcov a predajcov áut. Pomôžte klientom prežiť kontroly a
                                získajte finančnú
                                províziu.
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
                                    Pomôžte svojim klientom splniť zákonné požiadavky a získajte za to finančnú odmenu
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
                                            <span>A vy získavate finančnú províziu za každého klienta</span>
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
                                            Vytvorte si partnerský účet s identifikačnými údajmi vašej organizácie a
                                            získajte svoj osobný
                                            partnerský odkaz.
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
                                        <h4 className="text-lg font-semibold mb-2">3. Získavajte províziu v €</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Za každého platiaceho klienta dostanete finančnú províziu vyplatenú priamo
                                            na váš účet.
                                        </p>
                                    </Card>
                                </div>
                            </div>

                            <Card className="p-8 bg-primary/5 border-primary/20">
                                <h3 className="text-xl font-bold mb-4">Výhody pre partnerov</h3>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex gap-3">
                                        <span className="text-primary">✓</span>
                                        <span>Finančná provízia vyplatená v eurách</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary">✓</span>
                                        <span>Jedno riešenie pre všetkých klientov s autami</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary">✓</span>
                                        <span>Vidíte, či klient vedie evidenciu (a viete ho včas upozorniť)</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary">✓</span>
                                        <span>Opakovaná provízia z predplatného</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary">✓</span>
                                        <span>Detailný prehľad všetkých odporúčaní a výnosov</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card className="p-8 bg-background">
                                <h3 className="text-xl font-bold mb-4">Príklad výpočtu provízie</h3>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>Predstavte si, že odporučíte aplikáciu 10 vašim klientom:</p>
                                    <ul className="space-y-2 list-disc list-inside ml-4">
                                        <li>6 si vyberú Štartovací balík (19 € / mesiac)</li>
                                        <li>4 si vyberú Rozšírený balík (39 € / mesiac)</li>
                                    </ul>
                                    <p className="font-semibold text-foreground pt-2">
                                        = pravidelná mesačná provízia vyplatená v eurách na váš účet
                                    </p>
                                    <p className="text-sm italic">
                                        Presné percentá a podmienky zistíte po registrácii v partnerskom portáli.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pre predajcov áut */}
                <section className="py-20 border-t bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-5xl space-y-12">
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pre predajcov
                                    vozidiel</h2>
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Pridajte hodnotu svojim zákazníkom a získajte dodatočný príjem
                                </p>
                            </div>

                            <Card className="p-8">
                                <h3 className="text-2xl font-bold mb-6">DPH ready 2026 balíček</h3>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        Pri predaji firemného vozidla ponúknite klientovi ako benefit 3-mesačné
                                        predplatné aplikácie Kniha
                                        jázd zadarmo.
                                    </p>
                                    <ul className="space-y-3 list-disc list-inside ml-4">
                                        <li>Klient má evidenciu hneď od prvého dňa</li>
                                        <li>Vy získate províziu za aktiváciu</li>
                                        <li>Vybudujete si pozíciu partnera, ktorý myslí na zákazníka</li>
                                    </ul>
                                    <p className="font-semibold text-foreground pt-4">
                                        QR kód s partnerským linkom môžete priložiť priamo do vozidla pri odovzdaní
                                        kľúčov.
                                    </p>
                                </div>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="p-6 bg-background">
                                    <h4 className="text-lg font-semibold mb-3">Benefit pre zákazníka</h4>
                                    <p className="text-sm text-muted-foreground">
                                        3 mesiace zadarmo + pripravené na nové pravidlá DPH od 2026
                                    </p>
                                </Card>
                                <Card className="p-6 bg-background">
                                    <h4 className="text-lg font-semibold mb-3">Benefit pre vás</h4>
                                    <p className="text-sm text-muted-foreground">Provízia za každú aktiváciu + opakovaná
                                        provízia</p>
                                </Card>
                                <Card className="p-6 bg-background">
                                    <h4 className="text-lg font-semibold mb-3">Jednoduché použitie</h4>
                                    <p className="text-sm text-muted-foreground">
                                        QR kód priložený do vozidla, link v emails alebo na webe
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 border-t">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center space-y-8">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pripravení začať?</h2>
                            <p className="text-lg text-muted-foreground">
                                Či už ste účtovník, daňový poradca alebo predajca áut – môžete zarábať finančnú províziu
                                odporúčaním
                                Knihu jázd.
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
