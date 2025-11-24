"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Route, CheckCircle2, Gamepad2, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTrip } from "@/lib/api/trips"
import { getVehicles } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { getPlaces } from "@/lib/api/places"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

interface FirstTripTutorialProps {
  open: boolean
  onComplete: () => void
  onBack: () => void
}

type TutorialStep = 1 | 2 | 3 | 4 | 5 | 6

export function FirstTripTutorial({ open, onComplete, onBack }: FirstTripTutorialProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<TutorialStep>(1)
  const [isLoading, setIsLoading] = useState(false)

  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [places, setPlaces] = useState<any[]>([])

  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    startPlaceId: "",
    endPlaceId: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
  })

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      const [vehiclesData, driversData, placesData] = await Promise.all([getVehicles(), getDrivers(), getPlaces()])
      setVehicles(vehiclesData)
      setDrivers(driversData)
      setPlaces(placesData)

      if (vehiclesData.length > 0) {
        setFormData((prev) => ({ ...prev, vehicleId: vehiclesData[0].id }))
      }
      if (driversData.length > 0) {
        setFormData((prev) => ({ ...prev, driverId: driversData[0].id }))
      }
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
    }
  }

  const predefinedPurposes = ["Obchodné stretnutie", "Servis", "Nákup materiálu", "Návšteva klienta", "Doprava tovaru"]

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as TutorialStep)
    }
  }

  const handleSubmit = async () => {
    if (!formData.vehicleId || !formData.driverId || !formData.startPlaceId || !formData.endPlaceId) {
      toast({
        title: "Chyba",
        description: "Vyplň prosím všetky povinné polia",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createTrip({
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        startPlaceId: formData.startPlaceId,
        endPlaceId: formData.endPlaceId,
        purpose: formData.purpose || "Služobná cesta",
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        distance: 0,
      })

      toast({
        title: "Prvá jazda hotová!",
        description: "Takto budeš pridávať väčšinu jázd.",
      })

      onComplete()
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vytvoriť jazdu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Krok 1: Vyber vozidlo</p>
                <p className="text-sm text-muted-foreground">Vozidlo je už predvyplnené - stačí potvrdiť</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vozidlo</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyber vozidlo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.licensePlate} - {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Krok 2: Vyber vodiča</p>
                <p className="text-sm text-muted-foreground">Vodič je už predvyplnený - stačí potvrdiť</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vodič</Label>
              <Select
                value={formData.driverId}
                onValueChange={(value) => setFormData({ ...formData, driverId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyber vodiča" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.firstName} {d.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Krok 3: Zvoľ odkiaľ - kam</p>
                <p className="text-sm text-muted-foreground">Vyber miesta z tvojho zoznamu</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Z</Label>
                <Select
                  value={formData.startPlaceId}
                  onValueChange={(value) => setFormData({ ...formData, startPlaceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Začiatok" />
                  </SelectTrigger>
                  <SelectContent>
                    {places.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Do</Label>
                <Select
                  value={formData.endPlaceId}
                  onValueChange={(value) => setFormData({ ...formData, endPlaceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Koniec" />
                  </SelectTrigger>
                  <SelectContent>
                    {places.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Krok 4: Pridaj účel jazdy</p>
                <p className="text-sm text-muted-foreground">Vyber z ponuky alebo zadaj vlastný</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Účel jazdy</Label>
              <div className="grid grid-cols-2 gap-2">
                {predefinedPurposes.map((purpose) => (
                  <Button
                    key={purpose}
                    variant={formData.purpose === purpose ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setFormData({ ...formData, purpose })}
                  >
                    {purpose}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Alebo zadaj vlastný účel..."
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Krok 5: Nastav dátum a čas</p>
                <p className="text-sm text-muted-foreground">Alebo nechaj dnešný dátum</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dátum</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Začiatok</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Koniec</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold">Krok 6: Ulož jazdu</p>
                <p className="text-sm text-muted-foreground">Skontroluj údaje a potvrď</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vozidlo</span>
                  <span className="font-medium">{vehicles.find((v) => v.id === formData.vehicleId)?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vodič</span>
                  <span className="font-medium">
                    {drivers.find((d) => d.id === formData.driverId)?.firstName}{" "}
                    {drivers.find((d) => d.id === formData.driverId)?.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trasa</span>
                  <span className="font-medium">
                    {places.find((p) => p.id === formData.startPlaceId)?.name} →{" "}
                    {places.find((p) => p.id === formData.endPlaceId)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Účel</span>
                  <span className="font-medium">{formData.purpose}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dátum</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Route className="h-6 w-6" />
            Level: Vytvorme tvoju prvú jazdu
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {getStepContent()}

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>{currentStep}/6 krokov</span>
            </div>
            <Progress value={(currentStep / 6) * 100} className="h-2" />
          </div>

          <div className="flex gap-3">
            {currentStep === 1 ? (
              <Button variant="outline" onClick={onBack}>
                Späť
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setCurrentStep((currentStep - 1) as TutorialStep)}>
                Späť
              </Button>
            )}

            {currentStep < 6 ? (
              <Button className="flex-1" onClick={handleNext}>
                Ďalej <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Ukladám..." : "Uložiť jazdu"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
