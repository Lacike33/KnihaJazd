"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, MapPin, Star, Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { createPlace } from "@/lib/api/places"
import { useToast } from "@/hooks/use-toast"

interface PlaceData {
  name: string
  address: string
  isFrequent: boolean
}

interface PlacesSetupProps {
  open: boolean
  onComplete: () => void
  onBack: () => void
}

export function PlacesSetup({ open, onComplete, onBack }: PlacesSetupProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [headquarters, setHeadquarters] = useState({
    name: "Sídlo firmy",
    address: "",
  })
  const [partners, setPartners] = useState<PlaceData[]>([{ name: "", address: "", isFrequent: true }])

  const addPartner = () => {
    setPartners([...partners, { name: "", address: "", isFrequent: false }])
  }

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index))
    }
  }

  const updatePartner = (index: number, field: keyof PlaceData, value: string | boolean) => {
    const updated = [...partners]
    updated[index] = { ...updated[index], [field]: value }
    setPartners(updated)
  }

  const handleSubmit = async () => {
    if (!headquarters.address) {
      toast({
        title: "Chyba",
        description: "Vyplň prosím adresu sídla firmy",
        variant: "destructive",
      })
      return
    }

    const firstPartner = partners[0]
    if (!firstPartner.name || !firstPartner.address) {
      toast({
        title: "Chyba",
        description: "Vyplň prosím aspoň jedného partnera",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Create headquarters
      await createPlace({
        name: headquarters.name,
        address: headquarters.address,
        type: "headquarters",
        isCompanyLocation: true,
      })

      // Create partners
      for (const partner of partners) {
        if (partner.name && partner.address) {
          await createPlace({
            name: partner.name,
            address: partner.address,
            type: "client",
            isCompanyLocation: false,
          })
        }
      }

      toast({
        title: "Miesta pridané!",
        description: "3/3 základov hotových.",
      })

      onComplete()
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať miesta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Level: Moje trasy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <h3 className="font-semibold">Sídlo firmy / Home office</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hq-name">Názov</Label>
                <Input
                  id="hq-name"
                  placeholder="Sídlo firmy"
                  value={headquarters.name}
                  onChange={(e) => setHeadquarters({ ...headquarters, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hq-address">
                  Adresa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hq-address"
                  placeholder="Hlavná 1, Bratislava"
                  value={headquarters.address}
                  onChange={(e) => setHeadquarters({ ...headquarters, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Partneri a ciele jázd</h3>
              <Button variant="outline" size="sm" onClick={addPartner} disabled={partners.length >= 5}>
                <Plus className="h-4 w-4 mr-1" />
                Pridať partnera
              </Button>
            </div>

            {partners.map((partner, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`partner-name-${index}`}>
                          Názov partnera <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`partner-name-${index}`}
                          placeholder="Názov firmy"
                          value={partner.name}
                          onChange={(e) => updatePartner(index, "name", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`partner-address-${index}`}>
                          Adresa <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`partner-address-${index}`}
                          placeholder="Adresa partnera"
                          value={partner.address}
                          onChange={(e) => updatePartner(index, "address", e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`frequent-${index}`}
                          checked={partner.isFrequent}
                          onCheckedChange={(checked) => updatePartner(index, "isFrequent", checked as boolean)}
                        />
                        <Label htmlFor={`frequent-${index}`} className="cursor-pointer text-sm">
                          <Star className="h-3 w-3 inline mr-1" />
                          Častý cieľ jazdy
                        </Label>
                      </div>
                    </div>

                    {partners.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePartner(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Tieto miesta ti neskôr ponúknem na jedno kliknutie pri jazde. Čím viac ich máš, tým rýchlejšie vypĺňaš
              knihu jázd.
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>4/6 krokov</span>
            </div>
            <Progress value={66.67} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} disabled={isLoading}>
              Späť
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || !headquarters.address || !partners[0].name || !partners[0].address}
            >
              {isLoading ? "Ukladám..." : "Pokračovať"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
