"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Camera, Loader2, AlertCircle } from "lucide-react"
import { createOdometerReading, performOCR, getLatestOdometerReading } from "@/lib/api/odometer"
import { getVehicles } from "@/lib/api/vehicles"
import { getUsers } from "@/lib/api/users"
import { useQuery } from "@tanstack/react-query"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useAuth } from "@/components/providers/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getOdometerReadings } from "@/lib/api/odometer"

export default function NewOdometerReadingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationError, setValidationError] = useState("")

  const [formData, setFormData] = useState({
    vehicleId: "",
    odometerKm: "",
    ocrKm: "", // OCR rozpoznaný stav
    date: new Date().toISOString().slice(0, 16),
    source: "manual" as "manual" | "photo" | "gps",
    notes: "",
    photoUrl: "",
    recordedBy: user?.id || "",
    action: "photo_only" as "photo_only" | "manual_trip" | "auto_generate_trips",
  })

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const { data: latestReading } = useQuery({
    queryKey: ["latestOdometerReading", formData.vehicleId],
    queryFn: () => (formData.vehicleId ? getLatestOdometerReading(formData.vehicleId) : null),
    enabled: !!formData.vehicleId,
  })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setIsProcessing(true)

    try {
      // Simulate photo upload
      const photoUrl = URL.createObjectURL(file)

      // Perform OCR
      toast({
        title: "Spracovávam fotku...",
        description: "OCR prebieha, prosím čakajte.",
      })

      const ocrResult = await performOCR(photoUrl)

      setFormData((prev) => ({
        ...prev,
        photoUrl,
        ocrKm: ocrResult.odometerKm.toString(),
        odometerKm: ocrResult.odometerKm.toString(),
        source: "photo",
      }))

      toast({
        title: "OCR úspešné!",
        description: `Rozpoznaný stav: ${ocrResult.odometerKm.toLocaleString()} km`,
      })
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa spracovať fotku",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (!formData.vehicleId) {
      setValidationError("Vyberte vozidlo")
      return
    }

    if (!formData.odometerKm) {
      setValidationError("Zadajte stav tachometra")
      return
    }

    if (latestReading && Number.parseInt(formData.odometerKm) < latestReading.odometerKm) {
      setValidationError(
        `Stav tachometra nesmie byť menší ako predchádzajúci záznam (${latestReading.odometerKm.toLocaleString()} km)`,
      )
      return
    }

    try {
      const newReading = await createOdometerReading({
        vehicleId: formData.vehicleId,
        odometerKm: Number.parseInt(formData.odometerKm),
        date: formData.date,
        source: formData.source,
        notes: formData.notes,
        photoUrl: formData.photoUrl || undefined,
        recordedBy: formData.recordedBy,
      })

      toast({
        title: "Úspech",
        description: "Stav tachometra bol pridaný",
      })

      if (formData.action === "manual_trip") {
        // Get previous reading for pre-filling
        const allReadings = await getOdometerReadings(formData.vehicleId)
        const sortedReadings = allReadings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const previousReading = sortedReadings[1] // Second one (first is the one we just created)

        // Redirect to add-trip with pre-filled data
        const params = new URLSearchParams({
          vehicleId: formData.vehicleId,
          startOdometer: previousReading ? previousReading.odometerKm.toString() : "0",
          endOdometer: formData.odometerKm,
          date: formData.date,
        })
        router.push(`/add-trip?${params.toString()}`)
      } else if (formData.action === "auto_generate_trips") {
        // Get previous reading for date range
        const allReadings = await getOdometerReadings(formData.vehicleId)
        const sortedReadings = allReadings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const previousReading = sortedReadings[1]

        // Redirect to generate-trips with pre-filled data
        const params = new URLSearchParams({
          vehicleId: formData.vehicleId,
          dateFrom: previousReading ? new Date(previousReading.date).toISOString().slice(0, 10) : "",
          dateTo: new Date(formData.date).toISOString().slice(0, 10),
        })
        router.push(`/generate-trips?${params.toString()}`)
      } else {
        // Default: go to odometer overview
        router.push("/odometer")
      }
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať stav tachometra",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: "Tachometer & Fotky", href: "/odometer" },
          { label: "Pridať stav" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/odometer">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pridať stav tachometra</h1>
          <p className="text-muted-foreground">Nahrajte fotku alebo zadajte stav manuálne</p>
        </div>
      </div>

      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vozidlo</CardTitle>
            <CardDescription>Vyberte vozidlo pre ktoré pridávate stav</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="vehicle">Vozidlo *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Vyberte vozidlo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.registrationNo} - {v.brand} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {latestReading && (
              <p className="text-sm text-muted-foreground mt-2">
                Posledný záznam: {latestReading.odometerKm.toLocaleString()} km
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fotka tachometra</CardTitle>
            <CardDescription>Nahrajte fotku tachometra pre automatické rozpoznanie stavu pomocou OCR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {isUploading ? "Spracovávam..." : "Nahrať fotku"}
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploading}
              />
            </div>

            {formData.photoUrl && (
              <div className="space-y-2">
                <img
                  src={formData.photoUrl || "/placeholder.svg"}
                  alt="Tachometer"
                  className="rounded-lg border max-w-md"
                />
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rozpoznávam čísla pomocou OCR...
                  </div>
                )}
              </div>
            )}

            {formData.ocrKm && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">OCR rozpoznaný stav:</p>
                <p className="text-2xl font-bold">{Number.parseInt(formData.ocrKm).toLocaleString()} km</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Údaje o stave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="odometerKm">Stav tachometra (km) *</Label>
                <Input
                  id="odometerKm"
                  type="number"
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Dátum a čas *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordedBy">Zaznamenal *</Label>
              <Select
                value={formData.recordedBy}
                onValueChange={(value) => setFormData({ ...formData, recordedBy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte používateľa" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Poznámky</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Voliteľné poznámky..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ďalšie akcie</CardTitle>
            <CardDescription>Čo sa má stať po uložení stavu tachometra?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.action}
              onValueChange={(value: typeof formData.action) => setFormData({ ...formData, action: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo_only" id="photo_only" />
                <Label htmlFor="photo_only" className="font-normal cursor-pointer">
                  Len uložiť fotku a stav
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual_trip" id="manual_trip" />
                <Label htmlFor="manual_trip" className="font-normal cursor-pointer">
                  Pridať jazdu manuálne
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto_generate_trips" id="auto_generate_trips" />
                <Label htmlFor="auto_generate_trips" className="font-normal cursor-pointer">
                  Automaticky vygenerovať jazdy od posledného záznamu
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">Uložiť stav</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/odometer">Zrušiť</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
