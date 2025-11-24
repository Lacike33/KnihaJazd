"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getVehicles } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { getPlaces } from "@/lib/api/places"
import { createTrip } from "@/lib/api/trips"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, MapPin, Save, Circle, Square, Star, Map, Gauge } from "lucide-react"
import Link from "next/link"
import type { TripWaypoint, RouteVariant, RouteMode, Place, OdometerReading } from "@/lib/types"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { getOdometerReadings } from "@/lib/api/odometer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function PlaceCombobox({
  value,
  onValueChange,
  placeholder,
  places,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  places: Place[]
}) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const selectedPlace = places.find((p) => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal bg-transparent"
        >
          {selectedPlace ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {selectedPlace.name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Hľadať alebo zadať novú adresu..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-sm">
                <p className="text-muted-foreground mb-2">Miesto nenájdené</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    onValueChange(searchValue)
                    setOpen(false)
                  }}
                >
                  Použiť "{searchValue}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup heading="Vaše miesta">
              {places.map((place) => (
                <CommandItem
                  key={place.id}
                  value={place.id}
                  onSelect={() => {
                    onValueChange(place.id)
                    setSearchValue("")
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === place.id ? "opacity-100" : "opacity-0"}`} />
                  <div className="flex-1">
                    <div className="font-medium">{place.name}</div>
                    {place.address && <div className="text-xs text-muted-foreground">{place.address.city}</div>}
                  </div>
                  {place.defaultPurposeIndex !== undefined &&
                    place.tripPurposes &&
                    place.tripPurposes[place.defaultPurposeIndex] && (
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function NewTripPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  })

  const { data: places = [] } = useQuery({
    queryKey: ["places"],
    queryFn: getPlaces,
  })

  const activeVehicles = vehicles.filter((v) => v.active !== false)

  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    startTime: "",
    endTime: "",
    startPlaceId: "",
    endPlaceId: "",
    type: "business" as const,
    description: "",
    isOneWay: true,
    returnExactTime: "",
    returnAfterBreakMinutes: 30,
    returnTimeTolerance: 15,
    origin: "",
    destination: "",
    odometerMode: "select" as "select" | "manual",
    odometerReadingStartId: "",
    odometerReadingEndId: "",
    manualStartOdometer: "",
    manualEndOdometer: "",
  })

  const [availableOdometerReadings, setAvailableOdometerReadings] = useState<OdometerReading[]>([])

  useEffect(() => {
    if (formData.driverId) {
      const driver = drivers.find((d) => d.id === formData.driverId)
      if (driver?.defaultVehicleId) {
        const defaultVehicle = vehicles.find((v) => v.id === driver.defaultVehicleId && v.active !== false)
        if (defaultVehicle) {
          setFormData((prev) => ({ ...prev, vehicleId: driver.defaultVehicleId! }))
        }
      }
    }
  }, [formData.driverId, drivers, vehicles])

  useEffect(() => {
    if (formData.vehicleId && formData.startTime && formData.endTime) {
      getOdometerReadings(formData.vehicleId).then((readings) => {
        const startDate = new Date(formData.startTime)
        const endDate = new Date(formData.endTime)

        // Filter readings within the date range
        const filtered = readings.filter((r) => {
          const readingDate = new Date(r.date)
          return readingDate >= startDate && readingDate <= endDate
        })

        setAvailableOdometerReadings(filtered)
      })
    }
  }, [formData.vehicleId, formData.startTime, formData.endTime])

  const [routeMode, setRouteMode] = useState<RouteMode>("google_maps")
  const [fixedKm, setFixedKm] = useState("")
  const [kmTolerance, setKmTolerance] = useState("5")
  const [waypoints, setWaypoints] = useState<TripWaypoint[]>([])
  const [routeVariants, setRouteVariants] = useState<RouteVariant[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0)

  const selectedDriver = drivers.find((d) => d.id === formData.driverId)
  const canChangeVehicle = !selectedDriver || selectedDriver.drivingPermission === "all_vehicles"

  const handlePlaceSelect = (placeId: string, isStart: boolean) => {
    const place = places.find((p) => p.id === placeId)

    if (isStart) {
      setFormData((prev) => ({ ...prev, startPlaceId: placeId, origin: place?.name || placeId }))
    } else {
      setFormData((prev) => ({ ...prev, endPlaceId: placeId, destination: place?.name || placeId }))

      // Auto-fill purpose from destination place if it has default purpose
      if (place?.defaultPurposeIndex !== undefined && place.tripPurposes) {
        const defaultPurpose = place.tripPurposes[place.defaultPurposeIndex]
        if (defaultPurpose) {
          setFormData((prev) => ({ ...prev, description: defaultPurpose }))
          toast({
            title: "Účel cesty predvyplnený",
            description: `"${defaultPurpose}" bol automaticky nastavený pre toto miesto`,
          })
        }
      }
    }
  }

  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] })
      toast({
        title: "Jazda bola vytvorená",
        description: "Nová jazda bola úspešne pridaná do systému",
      })
      router.push("/trips")
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vytvoriť jazdu",
        variant: "destructive",
      })
    },
  })

  const handleAddWaypoint = () => {
    const newWaypoint: TripWaypoint = {
      id: `wp-${Date.now()}`,
      placeId: "",
      placeName: "",
      order: waypoints.length,
      isFixed: true,
    }
    setWaypoints([...waypoints, newWaypoint])
  }

  const handleRemoveWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id))
  }

  const handleUpdateWaypoint = (id: string, updates: Partial<TripWaypoint>) => {
    setWaypoints(waypoints.map((wp) => (wp.id === id ? { ...wp, ...updates } : wp)))
  }

  const handleLoadRoutes = () => {
    // Mock Google Maps API call to load route variants
    const mockVariants: RouteVariant[] = [
      {
        id: "route-1",
        name: "Najrýchlejšia trasa (cez diaľnicu)",
        distanceKm: 125.5,
        durationMinutes: 90,
        description: "Via D1",
        isDefault: true,
      },
      {
        id: "route-2",
        name: "Najkratšia trasa",
        distanceKm: 118.2,
        durationMinutes: 110,
        description: "Cez menšie mestá",
        isDefault: false,
      },
      {
        id: "route-3",
        name: "Bez mýta",
        distanceKm: 132.8,
        durationMinutes: 125,
        description: "Obchádza diaľnicu",
        isDefault: false,
      },
    ]
    setRouteVariants(mockVariants)
    setSelectedRouteIndex(0)
    toast({
      title: "Trasy načítané",
      description: `Našli sa ${mockVariants.length} alternatívne trasy`,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Form submit attempt, formData:", formData)
    console.log("[v0] Validation checks:", {
      driverId: !formData.driverId,
      vehicleId: !formData.vehicleId,
      startTime: !formData.startTime,
      endTime: !formData.endTime,
      startPlaceId: !formData.startPlaceId,
      endPlaceId: !formData.endPlaceId,
      odometerReadingStartId: formData.odometerMode === "select" && !formData.odometerReadingStartId,
      odometerReadingEndId: formData.odometerMode === "select" && !formData.odometerReadingEndId,
      manualStartOdometer: formData.odometerMode === "manual" && !formData.manualStartOdometer,
      manualEndOdometer: formData.odometerMode === "manual" && !formData.manualEndOdometer,
    })

    if (
      !formData.driverId ||
      !formData.vehicleId ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.startPlaceId ||
      !formData.endPlaceId ||
      !formData.manualStartOdometer ||
      !formData.manualEndOdometer
    ) {
      toast({
        title: "Chyba validácie",
        description: "Vyplňte prosím všetky povinné polia.",
        variant: "destructive",
      })
      return
    }

    const startOdo = Number.parseInt(formData.manualStartOdometer)
    const endOdo = Number.parseInt(formData.manualEndOdometer)
    if (endOdo < startOdo) {
      toast({
        title: "Chyba validácie",
        description: "Koncový stav tachometra musí byť väčší alebo rovný začiatočnému stavu.",
        variant: "destructive",
      })
      return
    }

    let calculatedKm = 0
    const startPlace = places.find((p) => p.id === formData.startPlaceId)
    const endPlace = places.find((p) => p.id === formData.endPlaceId)

    if (routeMode === "google_maps" && routeVariants.length > 0) {
      const selectedRoute = routeVariants[selectedRouteIndex]
      calculatedKm = selectedRoute.distanceKm
      if (kmTolerance) {
        const tolerance = Number.parseFloat(kmTolerance)
        const randomOffset = (Math.random() * 2 - 1) * tolerance
        calculatedKm = calculatedKm + randomOffset
      }
    } else if (routeMode === "fixed_km") {
      calculatedKm = Number.parseFloat(fixedKm)
      if (kmTolerance) {
        const tolerance = Number.parseFloat(kmTolerance)
        const randomOffset = (Math.random() * 2 - 1) * tolerance
        calculatedKm = calculatedKm + randomOffset
      }
    }

    const tripData = {
      ...formData,
      startLocation: startPlace?.name || formData.startPlaceId,
      endLocation: endPlace?.name || formData.endPlaceId,
      distanceKm: calculatedKm,
      source: "manual" as const,
      locked: false,
      waypoints: waypoints.length > 0 ? waypoints : undefined,
      routeMode,
      fixedKm: routeMode === "fixed_km" ? Number.parseFloat(fixedKm) : undefined,
      kmTolerance: kmTolerance ? Number.parseFloat(kmTolerance) : undefined,
      routeVariants: routeVariants.length > 0 ? routeVariants : undefined,
      selectedRouteIndex: routeVariants.length > 0 ? selectedRouteIndex : undefined,
      returnTrip: !formData.isOneWay
        ? {
            enabled: true,
            exactTime: formData.returnExactTime || undefined,
            afterBreakMinutes: formData.returnAfterBreakMinutes,
            timeTolerance: formData.returnTimeTolerance,
          }
        : undefined,
    }

    createMutation.mutate(tripData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Breadcrumb items={[{ label: "Jazdy", href: "/trips" }, { label: "Nová jazda" }]} />

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/trips">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pridať novú jazdu</h1>
            <p className="text-muted-foreground">Vytvoriť jazdu s pokročilými nastaveniami trasy</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Základné údaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="driverId">Vodič *</Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                    required
                  >
                    <SelectTrigger id="driverId">
                      <SelectValue placeholder="Vyberte vodiča" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleId">
                    Vozidlo * {!canChangeVehicle && <span className="text-xs text-muted-foreground">(predvolené)</span>}
                  </Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                    required
                    disabled={!canChangeVehicle}
                  >
                    <SelectTrigger id="vehicleId">
                      <SelectValue placeholder="Vyberte vozidlo" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNo} {vehicle.brand && `(${vehicle.brand} ${vehicle.model})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!canChangeVehicle && (
                    <p className="text-xs text-muted-foreground">Tento vodič môže jazdiť len na predvolenom vozidle</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Začiatok jazdy *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Koniec jazdy *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Typ jazdy *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Služobná</SelectItem>
                      <SelectItem value="private">Súkromná</SelectItem>
                      <SelectItem value="mixed">Zmiešaná</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Tachometer
              </CardTitle>
              <CardDescription>Zadajte stavy tachometra na začiatku a konci jazdy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={formData.odometerMode}
                onValueChange={(value) => setFormData({ ...formData, odometerMode: value as "select" | "manual" })}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select">Vybrať zo záznamov</TabsTrigger>
                  <TabsTrigger value="manual">Manuálne zadať</TabsTrigger>
                </TabsList>

                <TabsContent value="select" className="mt-4 space-y-4">
                  <div className="rounded-lg border border-muted bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      Môžete vybrať jeden alebo oba záznamy. Nevybrané stavy môžete zadať manuálne nižšie.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="odometerReadingStartId">Začiatočný záznam (voliteľné)</Label>
                      <Select
                        value={formData.odometerReadingStartId}
                        onValueChange={(value) => {
                          setFormData({ ...formData, odometerReadingStartId: value })
                          // Auto-fill manual field if record is selected
                          const reading = availableOdometerReadings.find((r) => r.id === value)
                          if (reading) {
                            setFormData((prev) => ({ ...prev, manualStartOdometer: reading.odometerKm.toString() }))
                          }
                        }}
                      >
                        <SelectTrigger id="odometerReadingStartId">
                          <SelectValue placeholder="Vybrať záznam (alebo zadať manuálne)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nevybrať (zadám manuálne)</SelectItem>
                          {availableOdometerReadings.length === 0 ? (
                            <SelectItem value="none" disabled>
                              Žiadne záznamy v tomto období
                            </SelectItem>
                          ) : (
                            availableOdometerReadings.map((reading) => (
                              <SelectItem key={reading.id} value={reading.id}>
                                {reading.odometerKm.toLocaleString()} km -{" "}
                                {format(new Date(reading.date), "dd.MM.yyyy HH:mm", { locale: sk })}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="odometerReadingEndId">Koncový záznam (voliteľné)</Label>
                      <Select
                        value={formData.odometerReadingEndId}
                        onValueChange={(value) => {
                          setFormData({ ...formData, odometerReadingEndId: value })
                          // Auto-fill manual field if record is selected
                          const reading = availableOdometerReadings.find((r) => r.id === value)
                          if (reading) {
                            setFormData((prev) => ({ ...prev, manualEndOdometer: reading.odometerKm.toString() }))
                          }
                        }}
                      >
                        <SelectTrigger id="odometerReadingEndId">
                          <SelectValue placeholder="Vybrať záznam (alebo zadať manuálne)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nevybrať (zadám manuálne)</SelectItem>
                          {availableOdometerReadings.length === 0 ? (
                            <SelectItem value="none" disabled>
                              Žiadne záznamy v tomto období
                            </SelectItem>
                          ) : (
                            availableOdometerReadings.map((reading) => (
                              <SelectItem key={reading.id} value={reading.id}>
                                {reading.odometerKm.toLocaleString()} km -{" "}
                                {format(new Date(reading.date), "dd.MM.yyyy HH:mm", { locale: sk })}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="manualStartOdometerSelect">Začiatočný stav (km) *</Label>
                      <Input
                        id="manualStartOdometerSelect"
                        type="number"
                        placeholder="napr. 12500"
                        value={formData.manualStartOdometer}
                        onChange={(e) => setFormData({ ...formData, manualStartOdometer: e.target.value })}
                        disabled={!!formData.odometerReadingStartId}
                        required
                      />
                      {formData.odometerReadingStartId && (
                        <p className="text-xs text-muted-foreground">Hodnota načítaná zo záznamu</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualEndOdometerSelect">Koncový stav (km) *</Label>
                      <Input
                        id="manualEndOdometerSelect"
                        type="number"
                        placeholder="napr. 12650"
                        value={formData.manualEndOdometer}
                        onChange={(e) => setFormData({ ...formData, manualEndOdometer: e.target.value })}
                        disabled={!!formData.odometerReadingEndId}
                        required
                      />
                      {formData.odometerReadingEndId && (
                        <p className="text-xs text-muted-foreground">Hodnota načítaná zo záznamu</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="manualStartOdometer">Začiatočný stav (km) *</Label>
                      <Input
                        id="manualStartOdometer"
                        type="number"
                        placeholder="napr. 12500"
                        value={formData.manualStartOdometer}
                        onChange={(e) => setFormData({ ...formData, manualStartOdometer: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualEndOdometer">Koncový stav (km) *</Label>
                      <Input
                        id="manualEndOdometer"
                        type="number"
                        placeholder="napr. 12650"
                        value={formData.manualEndOdometer}
                        onChange={(e) => setFormData({ ...formData, manualEndOdometer: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trasa jazdy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Route points */}
              <div className="space-y-3">
                {/* Start location */}
                <div className="flex items-start gap-3">
                  <div className="mt-3">
                    <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Odkiaľ *</Label>
                    <PlaceCombobox
                      value={formData.startPlaceId}
                      onValueChange={(value) => handlePlaceSelect(value, true)}
                      placeholder="Vyberte alebo zadajte miesto štartu"
                      places={places}
                    />
                  </div>
                </div>

                {/* Waypoints */}
                {waypoints.map((waypoint, index) => (
                  <div key={waypoint.id} className="flex items-start gap-3 pl-3">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-px bg-border" />
                      <Square className="h-3 w-3 text-muted-foreground" />
                      <div className="h-6 w-px bg-border" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Zastávka {index + 1}</Label>
                        <div className="flex items-center gap-2 ml-auto">
                          <Switch
                            checked={waypoint.isFixed}
                            onCheckedChange={(checked) => handleUpdateWaypoint(waypoint.id, { isFixed: checked })}
                          />
                          <Label className="text-xs text-muted-foreground">Fixná</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveWaypoint(waypoint.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <PlaceCombobox
                        value={waypoint.placeId}
                        onValueChange={(value) => {
                          const place = places.find((p) => p.id === value)
                          handleUpdateWaypoint(waypoint.id, {
                            placeId: value,
                            placeName: place?.name || value,
                          })
                        }}
                        placeholder="Vyberte alebo zadajte zastávku"
                        places={places}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 pl-3">
                  <div className="flex flex-col items-center">
                    {waypoints.length === 0 && <div className="h-6 w-px bg-border" />}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddWaypoint}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Pridať zastávku
                    </Button>
                    <div className="h-6 w-px bg-border" />
                  </div>
                </div>

                {/* End location */}
                <div className="flex items-start gap-3">
                  <div className="mt-3">
                    <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Kam *</Label>
                    <PlaceCombobox
                      value={formData.endPlaceId}
                      onValueChange={(value) => handlePlaceSelect(value, false)}
                      placeholder="Vyberte alebo zadajte cieľ"
                      places={places}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Náhľad trasy a km</h3>
                  <RadioGroup
                    value={routeMode}
                    onValueChange={(value: RouteMode) => setRouteMode(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="google_maps" id="mode-maps" />
                      <Label htmlFor="mode-maps" className="text-sm cursor-pointer">
                        Google Maps
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed_km" id="mode-fixed" />
                      <Label htmlFor="mode-fixed" className="text-sm cursor-pointer">
                        Fixné km
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {routeMode === "google_maps" && (
                  <div className="space-y-4">
                    {/* Map placeholder */}
                    <div className="relative h-64 bg-muted/20 rounded-lg border-2 border-dashed border-border overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <Map className="h-12 w-12 mb-2" />
                        <p className="text-sm font-medium">Náhľad mapy</p>
                        <p className="text-xs">
                          {formData.startPlaceId && formData.endPlaceId
                            ? "Trasa bude zobrazená tu"
                            : "Vyberte štart a cieľ"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLoadRoutes}
                        disabled={!formData.startPlaceId || !formData.endPlaceId}
                        className="flex-1 bg-transparent"
                      >
                        <Map className="mr-2 h-4 w-4" />
                        Načítať varianty trás
                      </Button>
                      {routeVariants.length > 0 && (
                        <div className="text-sm text-muted-foreground">Načítaných {routeVariants.length} tras</div>
                      )}
                    </div>

                    {routeVariants.length > 0 && (
                      <div className="space-y-2">
                        <Label>Vyberte trasu</Label>
                        <RadioGroup
                          value={selectedRouteIndex.toString()}
                          onValueChange={(value) => setSelectedRouteIndex(Number.parseInt(value))}
                          className="space-y-2"
                        >
                          {routeVariants.map((variant, index) => (
                            <div key={variant.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={index.toString()} id={`route-${index}`} />
                              <Label htmlFor={`route-${index}`} className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">{variant.name}</div>
                                    <div className="text-xs text-muted-foreground">{variant.description}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{variant.distanceKm.toFixed(1)} km</div>
                                    <div className="text-xs text-muted-foreground">{variant.durationMinutes} min</div>
                                  </div>
                                </div>
                              </Label>
                              {variant.isDefault && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                )}

                {routeMode === "fixed_km" && (
                  <div className="space-y-2">
                    <Label htmlFor="fixedKm">Počet kilometrov</Label>
                    <Input
                      id="fixedKm"
                      type="number"
                      step="0.1"
                      value={fixedKm}
                      onChange={(e) => setFixedKm(e.target.value)}
                      placeholder="Zadajte počet km"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="kmTolerance">Tolerancia km (±)</Label>
                  <Input
                    id="kmTolerance"
                    type="number"
                    step="0.1"
                    value={kmTolerance}
                    onChange={(e) => setKmTolerance(e.target.value)}
                    placeholder="5"
                  />
                  <p className="text-xs text-muted-foreground">Náhodná odchýlka od vypočítanej vzdialenosti</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Purpose - auto-filled from destination */}
          <Card>
            <CardHeader>
              <CardTitle>Účel cesty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Popis / Účel</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Účel cesty (automaticky predvyplnený z cieľa)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Účel sa automaticky predvyplní podľa zvoleného cieľového miesta
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Return trip - optional */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Návrat (voliteľné)</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!formData.isOneWay}
                    onCheckedChange={(checked) => setFormData({ ...formData, isOneWay: !checked })}
                  />
                  <Label className="text-sm text-muted-foreground">Obojsmerná jazda</Label>
                </div>
              </div>
            </CardHeader>
            {!formData.isOneWay && (
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="returnExactTime">Presný čas návratu</Label>
                      <Input
                        id="returnExactTime"
                        type="time"
                        value={formData.returnExactTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnExactTime: e.target.value,
                            returnAfterBreakMinutes: 0,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnAfterBreakMinutes">Alebo po prestávke (min)</Label>
                      <Input
                        id="returnAfterBreakMinutes"
                        type="number"
                        value={formData.returnAfterBreakMinutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnAfterBreakMinutes: Number.parseInt(e.target.value),
                            returnExactTime: "",
                          })
                        }
                        disabled={!!formData.returnExactTime}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnTimeTolerance">Časová tolerancia (±min)</Label>
                      <Input
                        id="returnTimeTolerance"
                        type="number"
                        value={formData.returnTimeTolerance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnTimeTolerance: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Nastavte presný čas návratu alebo po koľkých minútach od konca jazdy nastane návrat
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/trips")}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createMutation.isPending ? "Ukladám..." : "Uložiť jazdu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
