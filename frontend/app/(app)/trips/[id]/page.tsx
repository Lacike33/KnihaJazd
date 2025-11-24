"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getTrip, updateTrip, lockTrip, unlockTrip } from "@/lib/api/trips"
import { getVehicles } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TripSourceBadge } from "@/components/trips/trip-source-badge"
import { ArrowLeft, Lock, Save, AlertCircle, MapPin, Camera, Clock, ImageIcon, Unlock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { MOCK_TRIP_CHANGE_LOGS } from "@/lib/mock-data"

export default function TripDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { hasRole } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: "business" as const,
    driverId: "defaultDriverId",
    description: "",
  })

  const { data: trip, isLoading: tripLoading } = useQuery({
    queryKey: ["trips", params.id],
    queryFn: () => getTrip(params.id as string),
  })

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  })

  if (tripLoading) {
    return <div className="flex h-full items-center justify-center">Načítavam...</div>
  }

  if (!trip) {
    return <div className="flex h-full items-center justify-center">Jazda nenájdená</div>
  }

  const vehicle = vehicles.find((v) => v.id === trip.vehicleId)
  const driver = drivers.find((d) => d.id === trip.driverId)
  const canEdit = !trip.locked && (hasRole(["admin", "accountant"]) || hasRole("driver"))
  const canLock = !trip.locked && hasRole(["admin", "accountant"])
  const canUnlock = trip.locked && hasRole("admin")

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: "Jazdy", href: "/trips" },
          { label: trip ? `Jazda ${format(new Date(trip.startTime), "dd.MM.yyyy")}` : "Detail" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trips">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Detail jazdy</h1>
          <p className="text-muted-foreground">
            {format(new Date(trip.startTime), "dd. MMMM yyyy, HH:mm", { locale: sk })}
          </p>
        </div>
      </div>

      {trip.locked && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Uzamknutá jazda</AlertTitle>
          <AlertDescription>
            Táto jazda je uzamknutá a nie je možné ju upravovať.
            {canUnlock && " Ako admin môžete jazdu odomknúť."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Prehľad</TabsTrigger>
          <TabsTrigger value="evidence">Tachometer & dôkazy</TabsTrigger>
          <TabsTrigger value="history">História zmien</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Základné informácie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Vozidlo</div>
                      <div className="font-medium">
                        {vehicle?.registrationNo || "N/A"} {vehicle?.brand && `- ${vehicle.brand} ${vehicle.model}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Vodič</div>
                      <div className="font-medium">{driver?.name || "Nepridelený"}</div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Začiatok</div>
                      <div className="font-medium">
                        {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm", { locale: sk })}
                      </div>
                      {trip.startLocation && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {trip.startLocation}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Koniec</div>
                      <div className="font-medium">
                        {format(new Date(trip.endTime), "dd.MM.yyyy HH:mm", { locale: sk })}
                      </div>
                      {trip.endLocation && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {trip.endLocation}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Vzdialenosť</div>
                      <div className="text-2xl font-bold">{trip.distanceKm?.toFixed(1) || "0.0"} km</div>
                    </div>
                    {trip.startOdometer && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tachometer začiatok</div>
                        <div className="font-medium">{trip.startOdometer.toLocaleString()} km</div>
                      </div>
                    )}
                    {trip.endOdometer && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tachometer koniec</div>
                        <div className="font-medium">{trip.endOdometer.toLocaleString()} km</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Úprava jazdy</CardTitle>
                  <CardDescription>
                    {canEdit ? "Upravte účel a typ jazdy" : "Jazda je uzamknutá alebo nemáte oprávnenie na úpravu"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Typ jazdy</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={!canEdit}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="font-normal cursor-pointer">
                          Služobná
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="font-normal cursor-pointer">
                          Súkromná
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <Label htmlFor="mixed" className="font-normal cursor-pointer">
                          Zmiešaná
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver">Vodič</Label>
                    <Select
                      value={formData.driverId}
                      onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="driver">
                        <SelectValue placeholder="Vyberte vodiča" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defaultDriverId">Bez vodiča</SelectItem>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Účel jazdy</Label>
                    <Textarea
                      id="description"
                      placeholder="Napríklad: Návšteva klienta v Bratislave"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={!canEdit}
                      rows={3}
                    />
                  </div>

                  {canEdit && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={() => handleSave(trip, formData, toast, queryClient)} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Ukladám..." : "Uložiť zmeny"}
                      </Button>
                      {canLock && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={loading}>
                              <Lock className="mr-2 h-4 w-4" />
                              Uzamknúť
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Uzamknúť jazdu?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Po uzamknutí už nebude možné jazdu upravovať. Túto akciu môže vrátiť späť len
                                administrátor.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleLock(trip, toast, queryClient)}>
                                Uzamknúť
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}

                  {canUnlock && (
                    <div className="flex gap-3 pt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" disabled={loading}>
                            <Unlock className="mr-2 h-4 w-4" />
                            Odomknúť jazdu
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Odomknúť jazdu?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Po odomknutí bude možné jazdu znova upravovať. Túto akciu by ste mali vykonať len v
                              prípade potreby opravy údajov.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUnlock(trip, toast, queryClient)}>
                              Odomknúť
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zdroj jazdy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <TripSourceBadge source={trip.source} />
                  </div>
                  {trip.templateName && (
                    <Alert>
                      <ImageIcon className="h-4 w-4" />
                      <AlertDescription className="text-sm">{trip.templateName}</AlertDescription>
                    </Alert>
                  )}
                  {trip.source === "gps_corrected" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Jazda bola pôvodne vygenerovaná z GPS a neskôr ručne upravená používateľom.
                      </AlertDescription>
                    </Alert>
                  )}
                  {trip.source === "gps_auto" && (
                    <p className="text-sm text-muted-foreground">
                      Jazda bola automaticky vytvorená z GPS údajov bez manuálnej úpravy.
                    </p>
                  )}
                  {trip.source === "manual" && (
                    <p className="text-sm text-muted-foreground">Jazda bola vytvorená manuálne používateľom.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    <MapPin className="h-12 w-12 mb-2 opacity-20" />
                    <span>Mapa trasy bude zobrazená tu</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fotka tachometra</CardTitle>
              <CardDescription>Dôkaz o stave tachometra na konci jazdy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trip.odometerPhotoUrl ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border">
                    <img src={trip.odometerPhotoUrl || "/placeholder.svg"} alt="Tachometer" className="w-full h-auto" />
                  </div>
                  <div className="grid gap-3 text-sm">
                    {trip.odometerPhotoTakenBy && (
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fotil:</span>
                        <span className="font-medium">{trip.odometerPhotoTakenBy}</span>
                      </div>
                    )}
                    {trip.odometerPhotoTakenAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Kedy:</span>
                        <span className="font-medium">
                          {format(new Date(trip.odometerPhotoTakenAt), "dd.MM.yyyy HH:mm", { locale: sk })}
                        </span>
                      </div>
                    )}
                  </div>
                  {trip.ocrOriginalValue && trip.ocrCorrectedValue && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>OCR kontrola</AlertTitle>
                      <AlertDescription className="space-y-1">
                        <div>
                          Pôvodná OCR hodnota: <strong>{trip.ocrOriginalValue.toLocaleString()} km</strong>
                        </div>
                        <div>
                          Manuálne opravená hodnota: <strong>{trip.ocrCorrectedValue.toLocaleString()} km</strong>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center text-sm text-muted-foreground p-6">
                  <Camera className="h-12 w-12 mb-3 opacity-20" />
                  <p>K tejto jazde nie je priložená fotka tachometra</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>História zmien</CardTitle>
              <CardDescription>Zoznam všetkých úprav vykonaných na tejto jazde</CardDescription>
            </CardHeader>
            <CardContent>
              {MOCK_TRIP_CHANGE_LOGS.filter((log) => log.tripId === params.id).length > 0 ? (
                <div className="space-y-4">
                  {MOCK_TRIP_CHANGE_LOGS.filter((log) => log.tripId === params.id).map((log) => (
                    <div key={log.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{log.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.changedAt), "dd.MM.yyyy HH:mm", { locale: sk })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                        {log.oldValue && log.newValue && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="line-through">{log.oldValue}</span>
                            {" → "}
                            <span className="font-medium">{log.newValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Zatiaľ neboli vykonané žiadne zmeny</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const handleSave = async (trip: any, formData: any, toast: any, queryClient: any) => {
  const setLoading = trip.setLoading
  setLoading(true)

  try {
    await updateTrip(trip.id, {
      type: formData.type as any,
      driverId: formData.driverId || undefined,
      description: formData.description || undefined,
    })

    toast({ title: "Jazda aktualizovaná" })
    queryClient.invalidateQueries({ queryKey: ["trips", trip.params.id] })
    queryClient.invalidateQueries({ queryKey: ["trips"] })
  } catch (error) {
    toast({
      title: "Chyba",
      description: error instanceof Error ? error.message : "Nepodarilo sa uložiť zmeny",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}

const handleLock = async (trip: any, toast: any, queryClient: any) => {
  const setLoading = trip.setLoading
  const params = trip.params
  setLoading(true)

  try {
    await lockTrip(trip.id)
    toast({ title: "Jazda uzamknutá" })
    queryClient.invalidateQueries({ queryKey: ["trips", params.id] })
    queryClient.invalidateQueries({ queryKey: ["trips"] })
  } catch (error) {
    toast({
      title: "Chyba",
      description: error instanceof Error ? error.message : "Nepodarilo sa uzamknúť jazdu",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}

const handleUnlock = async (trip: any, toast: any, queryClient: any) => {
  const setLoading = trip.setLoading
  const params = trip.params
  setLoading(true)

  try {
    await unlockTrip(trip.id)
    toast({ title: "Jazda odomknutá" })
    queryClient.invalidateQueries({ queryKey: ["trips", params.id] })
    queryClient.invalidateQueries({ queryKey: ["trips"] })
  } catch (error) {
    toast({
      title: "Chyba",
      description: error instanceof Error ? error.message : "Nepodarilo sa odomknúť jazdu",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}
