import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Zadarmo",
      description: "Pre zoznámenie sa s aplikáciou",
      features: ["1 vozidlo", "20 jázd za mesiac", "Základné šablóny trás", "Export do PDF", "Email podpora"],
      cta: "Začať zadarmo",
      popular: false,
    },
    {
      name: "Pro",
      price: "19€",
      period: "/mesiac",
      description: "Plná elektronická evidencia",
      features: [
        "1 vozidlo bez limitov",
        "Neomedzené jazdy",
        "Mobilná aplikácia + OCR",
        "Evidencia nákladov",
        "100% DPH režim",
        "Mesačné uzávierky",
        "Prioritná podpora",
      ],
      cta: "Vyskúšať 30 dní zadarmo",
      popular: true,
    },
    {
      name: "Business",
      price: "49€",
      period: "/mesiac",
      description: "Pre malé firmy s viacerými autami",
      features: [
        "2-5 vozidiel",
        "Neomedzené jazdy",
        "Tímové účty",
        "Mobilná aplikácia + OCR",
        "Evidencia nákladov",
        "Vlastné šablóny",
        "Manažérsky prehľad",
        "Prioritná podpora 24/7",
      ],
      cta: "Kontaktovať nás",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Jednoduché ceny. Žiadne skryté poplatky.
            </h2>
            <p className="text-lg text-muted-foreground">Vyberte si plán, ktorý vám vyhovuje</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative p-8 ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Najpopulárnejší</Badge>}
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
