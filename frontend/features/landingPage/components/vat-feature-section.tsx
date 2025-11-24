import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, BarChart3, FileCheck } from "lucide-react"

export function VatFeatureSection() {
  return (
    <section className="border-t bg-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <Badge className="mb-2">100% DPH</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Chcete 100% odpočet DPH? Appka to postráži.
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Ak máte jedno auto, ktoré používate skutočne len na podnikanie, aplikácia vám pomôže viesť kompletnú
              elektronickú evidenciu, ktorá je nutná pre 100% odpočet DPH.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">100% business režim</h3>
              <p className="text-sm text-muted-foreground">
                Označte vozidlo ako firemné a aplikácia bude strážiť, aby spĺňalo podmienky pre plný odpočet DPH.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Blokovanie súkromných jázd</h3>
              <p className="text-sm text-muted-foreground">
                Výrazné varovanie pri pokuse o súkromnú jazdu na vozidle označenom ako 100% firemné.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Analýza rizík</h3>
              <p className="text-sm text-muted-foreground">
                Sledovanie počtu jázd, spotreby, stavu tachometra a nákladov pre identifikáciu potenciálnych problémov.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Automatický report</h3>
              <p className="text-sm text-muted-foreground">
                {"Vozidlo spĺňa / nespĺňa podmienky pre 100% DPH"} - jasný prehľad pre váš účtovný systém.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
