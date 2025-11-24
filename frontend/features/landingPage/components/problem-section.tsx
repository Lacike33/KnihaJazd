import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertCircle, FileCheck, MapPin, Gauge, Calendar, Shield } from "lucide-react"

export function ProblemSection() {
  const requirements = [
    {
      icon: FileCheck,
      title: "Elektronická evidencia",
      description: "Povinná pre všetky vozidlá používané na podnikanie",
    },
    {
      icon: Shield,
      title: "100% DPH",
      description: "Len pri autách výlučne na podnikanie",
    },
    {
      icon: MapPin,
      title: "Povinné údaje",
      description: "Vodič, účel, miesta začiatku/konca jazdy",
    },
    {
      icon: Gauge,
      title: "Stav tachometra",
      description: "Kilometre na začiatku a konci každej jazdy",
    },
    {
      icon: Calendar,
      title: "Uzávierky",
      description: "Mesačná alebo štvrťročná archivácia údajov",
    },
    {
      icon: AlertCircle,
      title: "Preukázateľnosť",
      description: "Rozhodujúci moment pri daňovej kontrole",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <Badge variant="destructive" className="mb-2">
              Nové povinnosti od 2026
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Zákon o DPH sa mení. Sankcie nie.
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Ak evidenciu nemáte, neuzná sa vám odpočet DPH ani výdavky spojené s autom. Naša appka stráži všetky
              povinné údaje za vás.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req) => (
              <Card key={req.title} className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <req.icon className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="mb-2 font-semibold">{req.title}</h3>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
