"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Car } from "lucide-react"
import { createVehicle } from "@/lib/api/vehicles"
import { useToast } from "@/hooks/use-toast"

interface VehicleSetupProps {
  open: boolean
  onComplete: (vehicleId: string) => void
  onBack: () => void
}

export function VehicleSetup({ open, onComplete, onBack }: VehicleSetupProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    licensePlate: "",
    name: "",
    odometer: "",
    fuelConsumption: "",
  })

  const handleSubmit = async () => {
    if (!formData.licensePlate || !formData.name) {
      toast({
        title: "Chyba",
        description: "Vyplň prosím povinné polia",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const vehicle = await createVehicle({
        licensePlate: formData.licensePlate,
        name: formData.name,
        odometer: formData.odometer ? Number.parseInt(formData.odometer) : 0,
        fuelConsumption: formData.fuelConsumption ? Number.parseFloat(formData.fuelConsumption) : undefined,
        isActive: true,
      })

      toast({
        title: "Vozidlo pridané!",
        description: "1/3 základov hotových.",
      })

      onComplete(vehicle.id)
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať vozidlo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Car className="h-6 w-6" />
            Level: Moje prvé vozidlo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">
                ŠPZ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="licensePlate"
                placeholder="BA123AB"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Názov vozidla <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Octavia firemná"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Stav tachometra (km)</Label>
              <Input
                id="odometer"
                type="number"
                placeholder="50000"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelConsumption">Spotreba (l/100km)</Label>
              <Input
                id="fuelConsumption"
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.fuelConsumption}
                onChange={(e) => setFormData({ ...formData, fuelConsumption: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Ak nevieš aktuálny stav tachometra, môžeš ho doplniť neskôr. Teraz tam daj orientačný stav, aby výkazy
              sedeli od dnešného dňa.
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>2/6 krokov</span>
            </div>
            <Progress value={33.33} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} disabled={isLoading}>
              Späť
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || !formData.licensePlate || !formData.name}
            >
              {isLoading ? "Pridávam..." : "Pokračovať"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
