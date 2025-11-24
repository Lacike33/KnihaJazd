"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Camera, Edit3, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { getOdometerReading, deleteOdometerReading } from "@/lib/api/odometer"
import { getVehicle } from "@/lib/api/vehicles"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { MOCK_TRIPS } from "@/lib/mock-data"
import type { Trip } from "@/lib/types"

export default function OdometerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, hasRole } = useAuth()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const readingId = params.id as string

  const { data: reading, isLoading } = useQuery({
    queryKey: ["odometerReading", readingId],
    queryFn: () => getOdometerReading(readingId),
  })

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", reading?.vehicleId],
    queryFn: () => (reading ? getVehicle(reading.vehicleId) : null),
    enabled: !!reading,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteOdometerReading(readingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odometer-readings"] })
      toast({
        title: "Úspech",
        description: "Záznam bol odstránený",
      })
      router.push("/odometer")
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odstrániť záznam",
        variant: "destructive",
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const canDelete = () => {
    if (!user || !reading) return false
    // Admin and accountant can delete everything
    if (hasRole(["admin", "accountant"])) return true
    // Driver can only delete their own records
    if (hasRole("driver") && reading.recordedBy === user.id) return true
    return false
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "photo":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Camera className="h-3 w-3 mr-1" />
            Fotka
          </Badge>
        )
      case "manual":
        return (
          <Badge variant="secondary">
            <Edit3 className="h-3 w-3 mr-1" />
            Manuálne
          </Badge>
        )
      case "gps":
        return <Badge variant="outline">GPS</Badge>
      default:
        return <Badge variant="outline">{source}</Badge>
    }
  }

  const getConnectedTrips = (): Trip[] => {
    if (!reading) return []
    return MOCK_TRIPS.filter(
      (trip) =>
        trip.vehicleId === reading.vehicleId &&
        (trip.endOdometer === reading.odometerKm || trip.startOdometer === reading.odometerKm),
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Záznam nenájdený</h1>
          <Button asChild>
            <Link href="/odometer">Späť na prehľad</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: "Tachometer & Fotky", href: "/odometer" },
          { label: "Detail" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/odometer">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail stavu tachometra</h1>
            <p className="text-muted-foreground">{format(new Date(reading.date), "dd.MM.yyyy HH:mm")}</p>
          </div>
        </div>
        {canDelete() && (
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Odstrániť
          </Button>
        )}
      </div>

      {/* Photo */}
      {reading.photoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Fotka tachometra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={reading.photoUrl || "/placeholder.svg"}
                alt="Tachometer"
                className="h-full w-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Základné údaje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Vozidlo</Label>
              <p className="font-medium">
                {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registrationNo})` : "Načítavam..."}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Dátum a čas</Label>
              <p className="font-medium">{format(new Date(reading.date), "dd.MM.yyyy HH:mm")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Stav tachometra</Label>
              <p className="text-2xl font-bold">{reading.odometerKm.toLocaleString()} km</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Zdroj</Label>
              <div>{getSourceBadge(reading.source)}</div>
            </div>
            {reading.recordedBy && (
              <div>
                <Label className="text-muted-foreground">Zaznamenal</Label>
                <p className="font-medium">{reading.recordedBy}</p>
              </div>
            )}
          </div>

          {reading.notes && (
            <div>
              <Label className="text-muted-foreground">Poznámky</Label>
              <p className="font-medium">{reading.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* OCR Info */}
      {reading.photoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>OCR rozpoznávanie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rozpoznaná hodnota:</span>
                <span className="font-medium">{reading.odometerKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manuálne opravená:</span>
                <span className="font-medium">Nie</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Prepojené jazdy</CardTitle>
        </CardHeader>
        <CardContent>
          {getConnectedTrips().length > 0 ? (
            <div className="space-y-2">
              {getConnectedTrips().map((trip) => (
                <div key={trip.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {trip.startLocation} → {trip.endLocation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm")} · {trip.distanceKm} km
                      </p>
                    </div>
                    <Badge>{trip.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Žiadne prepojené jazdy</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nevratná. Záznam tachometra bude natrvalo odstránený.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Odstrániť
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
