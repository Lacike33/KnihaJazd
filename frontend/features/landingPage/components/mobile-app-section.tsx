import { Card } from "@/components/ui/card"
import { Camera, ScanLine, Brain, Smartphone } from "lucide-react"

export function MobileAppSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl" />
              <div className="relative rounded-3xl border-8 border-foreground/20 bg-background p-4 shadow-2xl">
                <img
                  src="/mobile-app-camera-odometer-reading-ocr-interface.jpg"
                  alt="Mobilná aplikácia - fotenie tachometra"
                  className="w-full rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Po jazde len odfotíš tachometer. Ostatné spravíme za teba.
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Vodič po každej jazde otvorí mobilnú aplikáciu, odfotí stav tachometra a môže ísť ďalej. Fotka sa uloží
                ako dôkaz, appka z nej prečíta číslo a automaticky doplní jazdu podľa vašich šablón.
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="flex gap-4 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Fotka tachometra</h3>
                  <p className="text-sm text-muted-foreground">Uložená ako dôkaz pre daňovú kontrolu</p>
                </div>
              </Card>

              <Card className="flex gap-4 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ScanLine className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">OCR čítanie km</h3>
                  <p className="text-sm text-muted-foreground">Appka automaticky načíta stav odometra po jazde</p>
                </div>
              </Card>

              <Card className="flex gap-4 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Inteligentné priradenie</h3>
                  <p className="text-sm text-muted-foreground">
                    Spočíta rozdiel km, porovná ho s vašimi trasami a predvyplní jazdu
                  </p>
                </div>
              </Card>

              <Card className="flex gap-4 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Android / iOS</h3>
                  <p className="text-sm text-muted-foreground">
                    Funguje offline, dáta sa odošlú po pripojení na internet
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
