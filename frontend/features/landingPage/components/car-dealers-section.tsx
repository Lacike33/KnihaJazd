import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Car, QrCode, BadgeEuro, Award } from "lucide-react"

export function CarDealersSection() {
  return (
    <section id="car-dealers" className="border-t py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Benefit pre predajcov áut – auto pripravené na DPH 2026
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ak predávate vozidlá na firmu, vaši zákazníci budú riešiť knihu jázd a DPH. S našou aplikáciou im môžete
              hneď pri kúpe auta dať riešenie, ktoré im pomôže splniť nové povinnosti – a vám prinesie províziu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">DPH ready 2026 balíček</h3>
              <p className="text-sm text-muted-foreground">
                Pridajte k vozidlu nový balíček, ktorý klientom zabezpečí splnenie zákonných požiadaviek.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vlastný partnerský link + QR kód</h3>
              <p className="text-sm text-muted-foreground">
                Dostanete jedinečný odkaz a QR kód, ktorý môžete dať klientom priamo k zmluve o kúpe.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BadgeEuro className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Provízia za platiacich klientov</h3>
              <p className="text-sm text-muted-foreground">
                Za každého klienta, ktorý sa zaregistruje a začne platiť, získate pravidelnú províziu.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Logo predajcu na stránke</h3>
              <p className="text-sm text-muted-foreground">
                Vaše logo sa zobrazí v sekcii „Overení partneri" – pre dôveryhodnosť a viditeľnosť.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Prečo to dáva zmysel?</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                Väčšina firiem, ktoré kupujú vozidlá, bude musieť od roku 2026 viesť elektronickú knihu jázd. Ak im pri
                kúpe auta ponúknete riešenie, ktoré im to zjednoduší:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>zvýšite hodnotu vášho balíčka („auto + DPH ready")</li>
                <li>klient má pocit komplexného servisu (nemusí riešiť legislatívu, vy už riešenie máte pripravené)</li>
                <li>získate opakovaný príjem z provízií</li>
                <li>posilníte svoju pozíciu ako dôveryhodný partner pre firmy</li>
              </ul>
            </div>
          </Card>

          <div className="text-center">
            <Button size="lg" asChild>
              <a href="/partners/register">Stať sa partnerským predajcom</a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Registrácia je zdarma. Podmienky sa dohodneme individuálne.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
