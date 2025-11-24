"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Camera, Edit3, ImageIcon, Eye, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { MOCK_VEHICLES, MOCK_ODOMETER_READINGS, MOCK_TRIPS } from "@/lib/mock-data"
import type { OdometerReading, Trip } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function OdometerPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [selectedReading, setSelectedReading] = useState<OdometerReading | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const router = useRouter()

  // Fetch odometer readings
  const { data: readings = [] } = useQuery({
    queryKey: ["odometer-readings", selectedVehicle, dateFrom, dateTo],
    queryFn: async () => {
      // Filter mock data
      let filtered = [...MOCK_ODOMETER_READINGS]

      if (selectedVehicle !== "all") {
        filtered = filtered.filter((r) => r.vehicleId === selectedVehicle)
      }

      if (dateFrom) {
        filtered = filtered.filter((r) => new Date(r.date) >= new Date(dateFrom))
      }

      if (dateTo) {
        filtered = filtered.filter((r) => new Date(r.date) <= new Date(dateTo))
      }

      return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
  })

  const handleViewDetail = (reading: OdometerReading) => {
    router.push(`/odometer/${reading.id}`)
  }

  const handleQuickPreview = (reading: OdometerReading) => {
    setSelectedReading(reading)
    setShowPreviewDialog(true)
  }

  const getVehicleName = (vehicleId: string) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registrationNo})` : "Neznáme"
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

  // Find trips connected to this reading
  const getConnectedTrips = (reading: OdometerReading): Trip[] => {
    return MOCK_TRIPS.filter(
      (trip) =>
        trip.vehicleId === reading.vehicleId &&
        (trip.endOdometer === reading.odometerKm || trip.startOdometer === reading.odometerKm),
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={[{ label: "Vozidlá", href: "/vehicles" }, { label: "Tachometer & Fotky" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tachometer & Fotky</h1>
          <p className="text-muted-foreground">Prehľad všetkých stavov tachometra</p>
        </div>
        <Button asChild>
          <Link href="/odometer/new">
            <Camera className="mr-2 h-4 w-4" />
            Pridať stav
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Vozidlo</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Všetky vozidlá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky vozidlá</SelectItem>
                  {MOCK_VEHICLES.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.registrationNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dátum od</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Dátum do</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVehicle("all")
                setDateFrom("")
                setDateTo("")
              }}
            >
              Vymazať filtre
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stavy tachometra ({readings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dátum / Čas</TableHead>
                <TableHead>Vozidlo</TableHead>
                <TableHead>Stav tachometra</TableHead>
                <TableHead>Zdroj</TableHead>
                <TableHead>Fotka</TableHead>
                <TableHead>Zaznamenal</TableHead>
                <TableHead>Akcia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Žiadne záznamy
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>{format(new Date(reading.date), "dd.MM.yyyy HH:mm")}</TableCell>
                    <TableCell>{getVehicleName(reading.vehicleId)}</TableCell>
                    <TableCell className="font-semibold">{reading.odometerKm.toLocaleString()} km</TableCell>
                    <TableCell>{getSourceBadge(reading.source)}</TableCell>
                    <TableCell>
                      {reading.photoUrl ? (
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{reading.recordedBy || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleQuickPreview(reading)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(reading)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {/* Removed as navigation is now handled by router.push */}

      {/* Modal for quick preview */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rýchly náhľad - Stav tachometra</DialogTitle>
            <DialogDescription>
              Detail záznamu tachometra pre {selectedReading && getVehicleName(selectedReading.vehicleId)}
            </DialogDescription>
          </DialogHeader>

          {selectedReading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Dátum a čas</Label>
                  <p className="font-medium">{format(new Date(selectedReading.date), "dd.MM.yyyy HH:mm")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vozidlo</Label>
                  <p className="font-medium">{getVehicleName(selectedReading.vehicleId)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stav tachometra</Label>
                  <p className="text-2xl font-bold">{selectedReading.odometerKm.toLocaleString()} km</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Zdroj</Label>
                  <div className="mt-1">{getSourceBadge(selectedReading.source)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Zaznamenal</Label>
                  <p className="font-medium">{selectedReading.recordedBy || "-"}</p>
                </div>
                {selectedReading.notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Poznámky</Label>
                    <p className="font-medium">{selectedReading.notes}</p>
                  </div>
                )}
              </div>

              {selectedReading.photoUrl && (
                <div>
                  <Label className="text-muted-foreground">Fotka tachometra</Label>
                  <div className="mt-2 rounded-lg border overflow-hidden">
                    <img
                      src={selectedReading.photoUrl || "/placeholder.svg"}
                      alt="Tachometer"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {getConnectedTrips(selectedReading).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Prepojené jazdy</Label>
                  <div className="mt-2 space-y-2">
                    {getConnectedTrips(selectedReading).map((trip) => (
                      <Link
                        key={trip.id}
                        href={`/trips/${trip.id}`}
                        className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {trip.startLocation} → {trip.endLocation}
                            </p>
                            <p className="text-sm text-muted-foreground">{format(new Date(trip.date), "dd.MM.yyyy")}</p>
                          </div>
                          <Badge>{trip.distance} km</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                  Zavrieť
                </Button>
                <Button onClick={() => handleViewDetail(selectedReading)}>Otvoriť detail</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
