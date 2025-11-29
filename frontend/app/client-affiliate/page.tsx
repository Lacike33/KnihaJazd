import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Link2, BarChart3, Gift} from "lucide-react"
import Link from "next/link"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";

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
                                Affiliate program pre zákazníkov
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Odporučte Knihu jázd a získajte kredity na predplatné. Každý platící zákazník má prístup
                                k vlastnému
                                odporúčaciemu linku.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button size="lg" asChild>
                                    <Link href="/login">Prihlásiť sa</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/register">Zaregistrovať sa</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ako to funguje */}
                <section className="py-20 border-t">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-5xl space-y-12">
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    Znížte si vlastné náklady na predplatné
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Nie ste profesionálny partner? Žiadny problém. Každý platící zákazník má prístup k
                                    vlastnému affiliate
                                    linku priamo v aplikácii.
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
                                        V sekcii &ldquo;Affiliate&rdquo; v aplikácii nájdete svoj jedinečný odkaz
                                        pripravený na zdieľanie.
                                    </p>
                                </Card>

                                <Card className="p-6">
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Gift className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Kredity na predplatné</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Za každého platiaceho klienta získavate kredity, ktoré znižujú vaše vlastné
                                        náklady na predplatné.
                                    </p>
                                </Card>

                                <Card className="p-6">
                                    <div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <BarChart3 className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Prehľadný dashboard</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Sledujte kliky, registrácie a vaše celkové úspory v reálnom čase priamo v
                                        aplikácii.
                                    </p>
                                </Card>
                            </div>

                            <Card className="p-8 bg-background">
                                <h3 className="text-xl font-bold mb-4">Príklad výpočtu kreditov</h3>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>Predstavte si, že odporučíte aplikáciu 5 kolegom podnikateľom:</p>
                                    <ul className="space-y-2 list-disc list-inside ml-4">
                                        <li>3 si vyberú Štartovací balík (19 € / mesiac)</li>
                                        <li>2 si vyberú Rozšírený balík (39 € / mesiac)</li>
                                    </ul>
                                    <p className="font-semibold text-foreground pt-2">
                                        = mesačné kredity na vaše predplatné, môžete mať aplikáciu zadarmo
                                    </p>
                                    <p className="text-sm italic">Presné hodnoty kreditov zistíte po prihlásení v sekcii
                                        Affiliate.</p>
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-center">Rozdiel oproti partnerskému programu</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card className="p-6 bg-muted/30">
                                        <h4 className="text-lg font-semibold mb-3 text-primary">Affiliate program (pre
                                            vás)</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex gap-2">
                                                <span>✓</span>
                                                <span>Pre bežných používateľov aplikácie</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>✓</span>
                                                <span>Odmena vo forme kreditov na predplatné</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>✓</span>
                                                <span>Jednoduchá registrácia bez organizácie</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>✓</span>
                                                <span>Prístup priamo v aplikácii</span>
                                            </li>
                                        </ul>
                                    </Card>

                                    <Card className="p-6 bg-background">
                                        <h4 className="text-lg font-semibold mb-3">Partnerský program</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex gap-2">
                                                <span>•</span>
                                                <span>Pre účtovníkov, daňových poradcov, predajcov áut</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>•</span>
                                                <span>Finančná provízia vyplatená v eurách</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>•</span>
                                                <span>Vyžaduje identifikačné údaje organizácie</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span>•</span>
                                                <span>Samostatný partnerský portál</span>
                                            </li>
                                        </ul>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ako začať */}
                <section className="py-20 border-t bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl space-y-8">
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ako začať s affiliate
                                    programom</h2>
                            </div>

                            <div className="space-y-6">
                                <Card className="p-6">
                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2">Zaregistrujte sa a aktivujte
                                                predplatné</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Vytvorte si účet a vyberte si jeden z platených balíkov (Štartovací
                                                alebo Rozšírený).
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2">Nájdite svoj affiliate link v
                                                aplikácii</h4>
                                            <p className="text-sm text-muted-foreground">
                                                V sekcii &ldquo;<u>Affiliate</u>&rdquo; v aplikácii nájdete svoj osobný odkaz a nástroje na
                                                zdieľanie.
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2">Zdieľajte s kolegami a
                                                známymi</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Pošlite link emailom, na sociálnych sieťach alebo priamo známym
                                                podnikateľom.
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <div className="flex gap-4">
                                        <div
                                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                            4
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2">Získavajte kredity
                                                automaticky</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Za každého platiaceho klienta získate kredity, ktoré sa automaticky
                                                aplikujú na vaše predplatné.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 border-t">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center space-y-8">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pripravení začať šetriť?</h2>
                            <p className="text-lg text-muted-foreground">
                                Prihláste sa do aplikácie a aktivujte si affiliate program v sekcii Affiliate.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/register">Zaregistrovať sa</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/login">Už mám účet</Link>
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Ste profesionálny partner?{" "}
                                <Link href="/partners" className="text-primary hover:underline">
                                    Pozrite si partnerský program s finančnou províziou
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    )
}
