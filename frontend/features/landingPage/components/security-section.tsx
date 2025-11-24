import { Card } from "@/components/ui/card"
import { Shield, Lock, Database, FileCheck, History, Download } from "lucide-react"

export function SecuritySection() {
  const features = [
    {
      icon: Lock,
      title: "Nemenné logovanie zmien",
      description: "Každá úprava záznamu je zaznamenaná a nedá sa vymazať",
    },
    {
      icon: Database,
      title: "Archivácia podľa zákona",
      description: "Dáta uložené po požadovaný počet rokov v súlade s legislatívou",
    },
    {
      icon: FileCheck,
      title: "Kontrola konzistencie",
      description: "Automatická kontrola km, tachometra, PHL a ďalších údajov",
    },
    {
      icon: Download,
      title: "Export pre daňový úrad",
      description: "Všetky údaje exportovateľné na vyžiadanie kontrolóra",
    },
    {
      icon: History,
      title: "História fotiek",
      description: "Uložené fotky tachometra k uzávierkam a vybraným jazdám",
    },
    {
      icon: Shield,
      title: "Ochrana pred chybami",
      description: "Appka upozorní na podozrivé úpravy ešte pred kontrolou",
    },
  ]

  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Zákonná zhoda je základ</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Evidencia je uložená elektronicky, nemenným spôsobom a archivovaná podľa požiadaviek zákona. Aplikácia
              automaticky kontroluje povinné polia, dátumy, kilometrové rozdiely a náklady.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
