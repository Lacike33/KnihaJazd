import { Card } from "@/components/ui/card"

export function VerifiedPartnersSection() {
  const partners = [
    {
      name: "Auto Premium SK",
      logo: "/car-dealership-logo-premium.jpg",
    },
    {
      name: "Motor Trade Bratislava",
      logo: "/car-dealership-logo-trade.jpg",
    },
    {
      name: "Elite Motors",
      logo: "/car-dealership-logo-elite.jpg",
    },
    {
      name: "Autobazár Plus",
      logo: "/car-dealership-logo-plus.jpg",
    },
  ]

  return (
    <section id="verified-partners" className="border-t py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Overení partneri</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Autorizovaní predajcovia a showroomy, ktorí pomáhajú klientom pripraviť sa na nové pravidlá DPH 2026.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <Card
                key={partner.name}
                className="p-6 flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="w-full h-auto max-h-16 object-contain grayscale hover:grayscale-0 transition-all"
                />
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Chcete sa pridať medzi našich overených partnerov?{" "}
              <a href="/affiliate" className="text-primary hover:underline font-medium">
                Zaregistrujte sa tu
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
