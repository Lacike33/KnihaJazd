import { Card } from "@/components/ui/card"
import { CheckCircle2, FileText, Route, Calendar, FileCheck } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Elektronická kniha jázd podľa § 85n",
      description: "Automatické stráženie povinných údajov",
      details: [
        "Zákaz neúplných a neplatných záznamov",
        "Kontrola konzistencie dát",
        "Nemenné logovanie všetkých zmien",
      ],
    },
    {
      icon: FileText,
      title: "Evidencia nákladov",
      description: "PHM, servis, diaľnice a ďalšie výdavky",
      details: ["Rýchle nahranie dokladov", "Automatická kategorizácia", "Prepojenie s jazdami"],
    },
    {
      icon: Route,
      title: "Obľúbené trasy a šablóny",
      description: "Domov ↔ Firma, Firma → Klient",
      details: ["Konzistentné km a účel", "Minimum ručného písania", "Inteligentné predvypĺňanie"],
    },
    {
      icon: Calendar,
      title: "Mesačná/štvrťročná uzávierka",
      description: "Výpočet km, účelov a nákladov",
      details: ["Stráženie povinných polí", "Kontrola tachometra", "Automatická archivácia"],
    },
    {
      icon: FileCheck,
      title: "Výkaz pre DPH – pripravený pre kontrolu",
      description: "Kompletný PDF export podľa zákona",
      details: ["Presne podľa § 85n ods. 6", "Vhodný ako príloha k priznaniu", "Priamo na predloženie pri kontrole"],
    },
  ]

  return (
    <section id="features" className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Všetky povinnosti splníte jednou aplikáciou
            </h2>
            <p className="text-lg text-muted-foreground">Kompletné riešenie pre vedenie elektronickej knihy jázd</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="mb-4 text-muted-foreground">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
