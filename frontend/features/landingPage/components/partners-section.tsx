import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Link2, Coins } from "lucide-react"

export function PartnersSection() {
  return (
    <section id="partners" className="border-t py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Pomôžte klientom prežiť kontroly. My odmeníme vás.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Účtovníci, daňoví poradcovia a business partneri si môžu vytvoriť svoj partnerský účet, získať vlastný
              odkaz a pravidelnú províziu z platiacich klientov.
            </p>
          </div>

          <Card className="p-8 md:p-10 bg-muted/30">
            <h3 className="text-2xl font-bold mb-6">Pre účtovníkov a daňových poradcov</h3>
            <div className="space-y-6 text-muted-foreground">
              <p>Vaši klienti riešia autá na firmu, DPH a knihy jázd.</p>
              <p>Vy riešite, či majú všetko správne zaevidované a čo im pri kontrole uznajú.</p>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">S touto aplikáciou:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>máte istotu, že klient vedie evidenciu podľa zákona</li>
                  <li>ušetríte čas pri vysvetľovaní, čo všetko musí obsahovať kniha jázd</li>
                  <li>a za každého platiaceho klienta získate odmenu</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Ako funguje partnerský program</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">1. Zaregistrujte sa ako partner</h4>
                <p className="text-sm text-muted-foreground">
                  Vytvoríte si účet účtovníka alebo partnera a dostanete svoj osobný odkaz.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">2. Zdieľajte odkaz s klientmi</h4>
                <p className="text-sm text-muted-foreground">
                  Pošlite link emailom, vložte ho do fakturačného systému, na web alebo do podpisu.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">3. Zarábate, keď klienti platia</h4>
                <p className="text-sm text-muted-foreground mb-3">Za každého nového platiaceho klienta získate:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>buď províziu vyplatenú v eurách</li>
                  <li>alebo kredity na vlastné predplatné</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Konkrétne podmienky budú vysvetlené po registrácii.
                </p>
              </Card>
            </div>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Výhody pre účtovníkov</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Máte jedno riešenie pre všetkých klientov s autami</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Vidíte, či klient vedie evidenciu (a viete ho včas upozorniť)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Získavate opakovanú odmenu z predplatného</span>
              </li>
            </ul>
          </Card>

          <div className="text-center">
            <Button size="lg" asChild>
              <a href="/affiliate">Zistiť viac o partnerstve</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
