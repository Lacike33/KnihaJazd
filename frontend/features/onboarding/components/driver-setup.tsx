"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, UserCircle } from "lucide-react"
import { createDriver } from "@/lib/api/drivers"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface DriverSetupProps {
  open: boolean
  vehicleId: string
  onComplete: () => void
  onBack: () => void
}

export function DriverSetup({ open, vehicleId, onComplete, onBack }: DriverSetupProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    isMainDriver: true,
    canDriveAllVehicles: true,
  })

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Chyba",
        description: "Vyplň prosím meno a priezvisko",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createDriver({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user?.email || "",
        defaultVehicleId: vehicleId,
        canDriveAllVehicles: formData.canDriveAllVehicles,
        isActive: true,
      })

      toast({
        title: "Vodič pridaný!",
        description: "2/3 základov hotových.",
      })

      onComplete()
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať vodiča",
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
            <UserCircle className="h-6 w-6" />
            Kto bude jazdiť?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Meno <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Ján"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Priezvisko <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Novák"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg border">
              <Checkbox
                id="mainDriver"
                checked={formData.isMainDriver}
                onCheckedChange={(checked) => setFormData({ ...formData, isMainDriver: checked as boolean })}
              />
              <div className="flex-1">
                <Label htmlFor="mainDriver" className="cursor-pointer font-medium">
                  Toto je hlavný vodič
                </Label>
                <p className="text-sm text-muted-foreground">Bude predvyplnený pri vytváraní nových jázd</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg border">
              <Checkbox
                id="allVehicles"
                checked={formData.canDriveAllVehicles}
                onCheckedChange={(checked) => setFormData({ ...formData, canDriveAllVehicles: checked as boolean })}
              />
              <div className="flex-1">
                <Label htmlFor="allVehicles" className="cursor-pointer font-medium">
                  Môže jazdiť na všetkých vozidlách
                </Label>
                <p className="text-sm text-muted-foreground">Ak viac vozidiel, vodič bude mať prístup ku všetkým</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Default vodič a default vozidlo ti ušetria kliky - každú novú jazdu vyplním za teba týmito údajmi.
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>3/6 krokov</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} disabled={isLoading}>
              Späť
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || !formData.firstName || !formData.lastName}
            >
              {isLoading ? "Pridávam..." : "Pokračovať"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
