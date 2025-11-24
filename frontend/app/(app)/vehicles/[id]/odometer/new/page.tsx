"use client"

import type React from "react"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"
import { createOdometerReading, performOCR } from "@/lib/api/odometer"
import { getVehicle } from "@/lib/api/vehicles"
import { useQuery } from "@tanstack/react-query"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useAuth } from "@/components/providers/auth-provider"

export default function NewOdometerReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    odometerKm: "",
    date: new Date().toISOString().slice(0, 16),
    source: "manual" as "manual" | "photo" | "gps",
    notes: "",
    photoUrl: "",
    recordedBy: user?.name || "",
  })

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", resolvedParams.id],
    queryFn: () => getVehicle(resolvedParams.id),
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

    if (!formData.odometerKm) {
      toast({
        title: "Chyba",
        description: "Zadajte stav tachometra",
        variant: "destructive",
      })
      return
    }

    try {
      await createOdometerReading({
        vehicleId: resolvedParams.id,
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

      router.push(`/vehicles/${resolvedParams.id}?tab=odometer`)
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať stav tachometra",
        variant: "destructive",
      })
    }
  }

  if (!vehicle) {
    return <div>Načítavam...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: vehicle.registrationNo, href: `/vehicles/${resolvedParams.id}` },
          { label: "Tachometer", href: `/vehicles/${resolvedParams.id}?tab=odometer` },
          { label: "Pridať stav" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/vehicles/${resolvedParams.id}?tab=odometer`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pridať stav tachometra</h1>
          <p className="text-muted-foreground">
            {vehicle.brand} {vehicle.model} - {vehicle.registrationNo}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="recordedBy">Zaznamenal</Label>
              <Input
                id="recordedBy"
                value={formData.recordedBy}
                onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
                placeholder="Meno osoby"
              />
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

        <div className="flex gap-2">
          <Button type="submit">Uložiť stav</Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/vehicles/${resolvedParams.id}?tab=odometer`}>Zrušiť</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
