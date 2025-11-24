import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Link2, BarChart3 } from "lucide-react"

export function AffiliateSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Odporučte nás a znížte si vlastné náklady
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Každý platící zákazník má v aplikácii svoju sekciu „Affiliate", kde nájde osobný odkaz. Stačí ho poslať
              kolegovi, známemu podnikateľovi alebo klientovi – a za každého nového platiaceho používateľa získavate
              odmenu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vlastný referenčný link</h3>
              <p className="text-sm text-muted-foreground">
                Pre každého zákazníka vytvoríme jedinečný odkaz, ktorý môžete jednoducho zdieľať.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Odmena za každého klienta</h3>
              <p className="text-sm text-muted-foreground mb-3">Za každého platiaceho klienta získavate:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>províziu na účet</li>
                <li>kredity na predplatné (ďalší mesiac zadarmo)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Prehľad v dashboarde</h3>
              <p className="text-sm text-muted-foreground">Jednoduché sledovanie:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>koľko ľudí kliklo</li>
                <li>kto si službu aktivoval</li>
                <li>koľko ste už zarobili / ušetrili</li>
              </ul>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <a href="/affiliate">Viac o affiliate programe</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
