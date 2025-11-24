"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { User, Building2, MessageCircle } from "lucide-react"

interface UserTypeSetupProps {
  open: boolean
  onComplete: (data: { userType: string; vatMode: string }) => void
  onBack: () => void
}

export function UserTypeSetup({ open, onComplete, onBack }: UserTypeSetupProps) {
  const [userType, setUserType] = useState<string>("")
  const [vatMode, setVatMode] = useState<string>("full")

  const handleContinue = () => {
    if (userType) {
      onComplete({ userType, vatMode })
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ako appku používaš?</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Typ používateľa</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-all ${userType === "solo" ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setUserType("solo")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <User className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-semibold">SZČO / Jednoosobová firma</p>
                    <p className="text-sm text-muted-foreground">Jeden vodič, jedno alebo viac áut</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${userType === "company" ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setUserType("company")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-semibold">Malá firma</p>
                    <p className="text-sm text-muted-foreground">Viacero vodičov a vozidiel</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {userType && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label className="text-base font-medium">Režim DPH</Label>
              <RadioGroup value={vatMode} onValueChange={setVatMode} className="space-y-2">
                <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="full" id="vat-full" className="mt-1" />
                  <Label htmlFor="vat-full" className="cursor-pointer flex-1">
                    <p className="font-medium">100% DPH z auta</p>
                    <p className="text-sm text-muted-foreground">Vozidlo je použité len pre firemnú činnosť</p>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="mixed" id="vat-mixed" className="mt-1" />
                  <Label htmlFor="vat-mixed" className="cursor-pointer flex-1">
                    <p className="font-medium">Zmiešané používanie</p>
                    <p className="text-sm text-muted-foreground">Vozidlo sa používa aj na súkromné účely</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Zvolím za teba odporúčané nastavenia DPH, aby výkaz sedel s Finančnou správou. Toto vieš neskôr zmeniť v
              nastaveniach.
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>1/6 krokov</span>
            </div>
            <Progress value={16.67} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Späť
            </Button>
            <Button className="flex-1" onClick={handleContinue} disabled={!userType}>
              Pokračovať
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
