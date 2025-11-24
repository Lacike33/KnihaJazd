import { Card } from "@/components/ui/card"
import { Building2, User, Car, CheckCircle2 } from "lucide-react"

export function ForWhoSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Pre koho to je</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Od roku 2026 už nestačí Excel ani papierová kniha jázd. Potrebujete elektronickú evidenciu podľa zákona –
              ideálne s mobilnou appkou, ktorú vodič použije za pár sekúnd po každej jazde.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">SZČO</h3>
              <p className="text-sm text-muted-foreground">Živnostníci s autom na firmu</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Malé s.r.o.</h3>
              <p className="text-sm text-muted-foreground">Firmy s 1-5 vozidlami</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">100% podnikanie</h3>
              <p className="text-sm text-muted-foreground">Auto len na firmu s plným DPH</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Bez GPS</h3>
              <p className="text-sm text-muted-foreground">Žiadne krabičky ani tracking</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
