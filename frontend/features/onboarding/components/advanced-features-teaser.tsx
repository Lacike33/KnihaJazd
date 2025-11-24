"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Route, FileText, Download, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdvancedFeaturesTeaserProps {
  open: boolean
  onComplete: () => void
  onLearnMore: (feature: string) => void
}

interface Feature {
  id: string
  icon: React.ElementType
  title: string
  description: string
  benefit: string
  action: string
}

export function AdvancedFeaturesTeaser({ open, onComplete, onLearnMore }: AdvancedFeaturesTeaserProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const features: Feature[] = [
    {
      id: "autogenerate",
      icon: Sparkles,
      title: "Autogenerovanie jázd",
      description: "Vyber dátumové obdobie, od-do tachometra, partnerov a appka ti vygeneruje celé obdobie.",
      benefit: "Ušetrí ti hodiny práce",
      action: "Vyskúšaj teraz",
    },
    {
      id: "templates",
      icon: Route,
      title: "Šablóny pravidelných jázd",
      description: "Napríklad každé pondelky: Domov → Firma. Nastav raz, použi donekonečna.",
      benefit: "Ideálne pre pravidelné trasy",
      action: "Vytvor šablónu",
    },
    {
      id: "vat_report",
      icon: FileText,
      title: "Výkaz pre DPH",
      description: "Jedným klikom vygeneruješ PDF v súlade s § 85n zákona o DPH.",
      benefit: "Zákonná forma ihneď",
      action: "Vyskúšaj export",
    },
    {
      id: "import",
      icon: Download,
      title: "Import z GPS / iných systémov",
      description: "Načítaj jazdy z GPS systému alebo iných aplikácií.",
      benefit: "Rýchle migrovanie dát",
      action: "Importuj dáta",
    },
  ]

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const handleFinish = () => {
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Pokročilé funkcie
          </DialogTitle>
          <p className="text-muted-foreground">Tieto funkcie ti ušetria čas. Môžeš ich vyskúšať teraz alebo neskôr.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              const isSelected = selectedFeatures.includes(feature.id)

              return (
                <Card
                  key={feature.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
                  onClick={() => toggleFeature(feature.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {feature.benefit}
                          </Badge>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{feature.description}</CardDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        onLearnMore(feature.id)
                      }}
                    >
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Nemusíš sa učiť všetko naraz</p>
              <p className="text-sm text-muted-foreground">
                Označené funkcie ti pridáme do zoznamu misií. Môžeš sa k nim vrátiť kedykoľvek cez menu Pomocník.
              </p>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>6/6 krokov</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFeatures([])
                onComplete()
              }}
            >
              Preskočiť
            </Button>
            <Button className="flex-1" onClick={handleFinish}>
              {selectedFeatures.length > 0 ? `Dokončiť (${selectedFeatures.length} označených)` : "Dokončiť tutoriál"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
