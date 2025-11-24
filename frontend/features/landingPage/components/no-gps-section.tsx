import { Card } from "@/components/ui/card"
import { XCircle, CheckCircle2, FileText } from "lucide-react"

export function NoGpsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Bez GPS, bez komplikácií</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Všetko funguje aj bez GPS. Legálne a jednoducho.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-destructive/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Čo NEPOTREBUJETE</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <span>Žiadne GPS krabičky ani inštalácie do auta</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <span>Žiadne sledovanie polohy vodiča v reálnom čase</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <span>Žiadne zásahy do elektroniky vozidla</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <span>Žiadne mesačné poplatky za hardvér</span>
                </li>
              </ul>
            </Card>

            <Card className="border-primary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Čo POUŽÍVATE</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Šablóny obľúbených jázd (Domov → Firma)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Fotografie tachometra ako dôkaz</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>OCR na automatické čítanie kilometrov</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Jednoduchá mobilná appka - pár sekúnd po jazde</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Ideálne pre živnostníkov a malé firmy</h3>
                <p className="text-sm text-muted-foreground">
                  Nechcete GPS tracking, ale chcete mať pokoj na daniach? Naše riešenie je presne pre vás. Jednoduché,
                  zákonné a bez zbytočných technológií.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
