"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getVehicles } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { getPlaces } from "@/lib/api/places"
import { getTripTemplates } from "@/lib/api/templates" // Fixed import name from getTemplates to getTripTemplates
import { previewGeneratedTrips, confirmGeneratedTrips } from "@/lib/api/trip-generation"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { TripGenerationParams, GeneratedTripPreview } from "@/lib/types"

export default function GenerateTripsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Form state
  const [params, setParams] = useState<TripGenerationParams>({
    vehicleId: "",
    dateFrom: "",
    dateTo: "",
    odoStart: 0,
    odoEnd: 0,
    kmSource: "tacho",
    tripType: "business",
    timeStart: "08:00",
    timeEnd: "18:00",
    minGapMinutes: 30,
    daysEnabled: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false,
    },
    ignoreWeekends: false,
    ignoreHolidays: false,
    placeIds: [],
    driverMode: "none",
    trailerEnabled: false,
    trailerThresholdKm: 100,
    phlMode: "none",
    phlKmDistribution: "even",
    clientFilters: {
      addAllClients: false,
      includeHolidays: false,
      includeAllDayTrips: true,
    },
    templateUsageMode: "templates_and_random",
    templateIds: [],
    useDefaultPurposesOnly: false,
  })

  const [preview, setPreview] = useState<{
    runId: string
    summary: any
    trips: GeneratedTripPreview[]
  } | null>(null)

  // Fetch data
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

  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: getTripTemplates, // Fixed import name from getTemplates to getTripTemplates
  })

  const handleGeneratePreview = async () => {
    setGenerating(true)
    try {
      const result = await previewGeneratedTrips(params)
      setPreview(result)
      setStep(4)
      toast({
        title: "Náhľad vygenerovaný",
        description: `Vygenerovaných ${result.summary.totalGeneratedTrips} jázd`,
      })
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleConfirm = async () => {
    if (!preview) return

    setConfirming(true)
    try {
      await confirmGeneratedTrips(preview.runId)
      toast({
        title: "Úspech",
        description: "Jazdy boli úspešne vytvorené",
      })
      router.push("/trips")
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setConfirming(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    if (params.placeIds.length === 0 && !params.clientFilters?.addAllClients) return true
    return (
      params.placeIds.includes(template.fromPlaceId) ||
      params.placeIds.includes(template.toPlaceId) ||
      template.waypoints?.some((w) => params.placeIds.includes(w.placeId))
    )
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Generovanie jázd
          </h1>
          <p className="text-muted-foreground mt-1">Automatické generovanie jázd podľa definovaných parametrov</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            1
          </div>
          <span className="text-sm font-medium">Základné údaje</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            2
          </div>
          <span className="text-sm font-medium">Výber klientov</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            3
          </div>
          <span className="text-sm font-medium">Šablóny & Nastavenia</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className={`flex items-center gap-2 ${step >= 4 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            4
          </div>
          <span className="text-sm font-medium">Náhľad & Potvrdenie</span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Základné údaje</CardTitle>
            <CardDescription>Vyber vodiča, vozidlo a zadaj obdobie pre generovanie jázd</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="driver">Vodič *</Label>
                <Select
                  value={params.driverId}
                  onValueChange={(value) => {
                    setParams({ ...params, driverId: value })
                    const driver = drivers.find((d) => d.id === value)
                    if (driver?.defaultVehicleId) {
                      const defaultVehicle = vehicles.find(
                        (v) => v.id === driver.defaultVehicleId && v.active !== false,
                      )
                      if (defaultVehicle) {
                        setParams((prev) => ({ ...prev, vehicleId: driver.defaultVehicleId! }))
                      }
                    }
                  }}
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Vyber vodiča" />
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
                <Label htmlFor="vehicle">
                  Vozidlo *
                  {params.driverId &&
                    drivers.find((d) => d.id === params.driverId)?.drivingPermission !== "all_vehicles" && (
                      <span className="text-xs text-muted-foreground ml-1">(predvolené)</span>
                    )}
                </Label>
                <Select
                  value={params.vehicleId}
                  onValueChange={(value) => setParams({ ...params, vehicleId: value })}
                  disabled={
                    params.driverId &&
                    drivers.find((d) => d.id === params.driverId)?.drivingPermission !== "all_vehicles"
                  }
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Vyber vozidlo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles
                      .filter((v) => v.active !== false)
                      .map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNo} - {vehicle.brand} {vehicle.model}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kmSource">Zdroj km *</Label>
                <Select
                  value={params.kmSource}
                  onValueChange={(value: any) => setParams({ ...params, kmSource: value })}
                >
                  <SelectTrigger id="kmSource">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tacho">Tachometer (presný km)</SelectItem>
                    <SelectItem value="phl">PHM náklady (orientačné)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFrom">Obdobie od *</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={params.dateFrom}
                  onChange={(e) => setParams({ ...params, dateFrom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo">Obdobie do *</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={params.dateTo}
                  onChange={(e) => setParams({ ...params, dateTo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odoStart">Stav tachometra začiatok (km) *</Label>
                <Input
                  id="odoStart"
                  type="number"
                  value={params.odoStart}
                  onChange={(e) => setParams({ ...params, odoStart: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odoEnd">Stav tachometra koniec (km) *</Label>
                <Input
                  id="odoEnd"
                  type="number"
                  value={params.odoEnd}
                  onChange={(e) => setParams({ ...params, odoEnd: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setStep(2)}
                disabled={!params.driverId || !params.vehicleId || !params.dateFrom || !params.dateTo}
              >
                Ďalej
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Výber klientov a miest</CardTitle>
            <CardDescription>Vyber miesta pre generovanie jázd a aplikuj filtre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addAllClients"
                checked={params.clientFilters?.addAllClients}
                onCheckedChange={(checked) =>
                  setParams({
                    ...params,
                    clientFilters: { ...params.clientFilters!, addAllClients: checked as boolean },
                    placeIds: checked ? places.map((p) => p.id) : [],
                  })
                }
              />
              <Label htmlFor="addAllClients" className="font-normal cursor-pointer">
                Pridať všetkých klientov naraz
              </Label>
            </div>

            {!params.clientFilters?.addAllClients && (
              <div className="space-y-3">
                <Label>Miesta pre generovanie *</Label>
                <div className="grid gap-2 max-h-64 overflow-y-auto p-2 border rounded-md">
                  {places.map((place) => (
                    <div key={place.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`place-${place.id}`}
                        checked={params.placeIds.includes(place.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setParams({ ...params, placeIds: [...params.placeIds, place.id] })
                          } else {
                            setParams({ ...params, placeIds: params.placeIds.filter((id) => id !== place.id) })
                          }
                        }}
                      />
                      <Label htmlFor={`place-${place.id}`} className="font-normal cursor-pointer flex-1">
                        {place.name} - {place.type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium">Rozšírené filtre</h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxDistance">Max. vzdialenosť (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    placeholder="Neobmedzene"
                    value={params.clientFilters?.maxDistanceKm || ""}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        clientFilters: {
                          ...params.clientFilters!,
                          maxDistanceKm: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxHours">Max. časová náročnosť (hod)</Label>
                  <Input
                    id="maxHours"
                    type="number"
                    placeholder="Neobmedzene"
                    value={params.clientFilters?.maxTravelHours || ""}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        clientFilters: {
                          ...params.clientFilters!,
                          maxTravelHours: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeHolidays"
                    checked={params.clientFilters?.includeHolidays}
                    onCheckedChange={(checked) =>
                      setParams({
                        ...params,
                        clientFilters: { ...params.clientFilters!, includeHolidays: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="includeHolidays" className="font-normal cursor-pointer">
                    Zahrnúť aj sviatky
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAllDay"
                    checked={params.clientFilters?.includeAllDayTrips}
                    onCheckedChange={(checked) =>
                      setParams({
                        ...params,
                        clientFilters: { ...params.clientFilters!, includeAllDayTrips: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="includeAllDay" className="font-normal cursor-pointer">
                    Zahrnúť celodenné jazdy
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Späť
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={params.placeIds.length === 0 && !params.clientFilters?.addAllClients}
              >
                Ďalej
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Výber šablón</CardTitle>
              <CardDescription>Definuj ako sa majú použiť šablóny jázd</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Režim generovania</Label>
                <RadioGroup
                  value={params.templateUsageMode}
                  onValueChange={(value: any) => setParams({ ...params, templateUsageMode: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="templates_only" id="templates_only" />
                    <Label htmlFor="templates_only" className="font-normal cursor-pointer">
                      Generovať len zo šablón - jazdy sa tvoria výlučne z dostupných šablón
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="templates_and_random" id="templates_and_random" />
                    <Label htmlFor="templates_and_random" className="font-normal cursor-pointer">
                      Šablóny ako doplnok - kombinácia šablón a náhodne generovaných jázd
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random_only" id="random_only" />
                    <Label htmlFor="random_only" className="font-normal cursor-pointer">
                      Len random účely / náhodné jazdy - šablóny sa nepoužijú
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {params.templateUsageMode !== "random_only" && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Dostupné šablóny pre vybrané miesta</Label>
                      <Badge variant="secondary">{filteredTemplates.length} šablón</Badge>
                    </div>
                    <div className="grid gap-2 max-h-64 overflow-y-auto p-2 border rounded-md">
                      {filteredTemplates.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          Žiadne šablóny pre vybrané miesta
                        </div>
                      ) : (
                        filteredTemplates.map((template) => (
                          <div key={template.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`template-${template.id}`}
                              checked={params.templateIds?.includes(template.id)}
                              onCheckedChange={(checked) => {
                                const currentIds = params.templateIds || []
                                if (checked) {
                                  setParams({ ...params, templateIds: [...currentIds, template.id] })
                                } else {
                                  setParams({ ...params, templateIds: currentIds.filter((id) => id !== template.id) })
                                }
                              }}
                            />
                            <Label htmlFor={`template-${template.id}`} className="font-normal cursor-pointer flex-1">
                              {template.name}
                              {template.isRecurring && <Badge className="ml-2">Pravidelná</Badge>}
                              {template.isAllDayTrip && (
                                <Badge className="ml-2" variant="secondary">
                                  Celodenná
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useDefaultPurposes"
                      checked={params.useDefaultPurposesOnly}
                      onCheckedChange={(checked) =>
                        setParams({ ...params, useDefaultPurposesOnly: checked as boolean })
                      }
                    />
                    <Label htmlFor="useDefaultPurposes" className="font-normal cursor-pointer">
                      Použiť len defaultné účely jázd z miest
                    </Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typ a čas jázd</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tripType">Typ jazdy</Label>
                  <Select
                    value={params.tripType}
                    onValueChange={(value: any) => setParams({ ...params, tripType: value })}
                  >
                    <SelectTrigger id="tripType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Služobná</SelectItem>
                      <SelectItem value="private">Súkromná</SelectItem>
                      <SelectItem value="mixed">Zmiešaná</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minGap">Min. rozostup (minúty)</Label>
                  <Input
                    id="minGap"
                    type="number"
                    value={params.minGapMinutes}
                    onChange={(e) => setParams({ ...params, minGapMinutes: Number.parseInt(e.target.value) || 30 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeStart">Čas od</Label>
                  <Input
                    id="timeStart"
                    type="time"
                    value={params.timeStart}
                    onChange={(e) => setParams({ ...params, timeStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeEnd">Čas do</Label>
                  <Input
                    id="timeEnd"
                    type="time"
                    value={params.timeEnd}
                    onChange={(e) => setParams({ ...params, timeEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Dni v týždni</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "mon", label: "Po" },
                    { key: "tue", label: "Ut" },
                    { key: "wed", label: "St" },
                    { key: "thu", label: "Št" },
                    { key: "fri", label: "Pi" },
                    { key: "sat", label: "So" },
                    { key: "sun", label: "Ne" },
                  ].map((day) => (
                    <div key={day.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.key}
                        checked={params.daysEnabled[day.key as keyof typeof params.daysEnabled]}
                        onCheckedChange={(checked) =>
                          setParams({
                            ...params,
                            daysEnabled: {
                              ...params.daysEnabled,
                              [day.key]: checked as boolean,
                            },
                          })
                        }
                      />
                      <Label htmlFor={day.key} className="font-normal cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vodiči</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driverMode">Pridelenie vodiča</Label>
                <Select
                  value={params.driverMode}
                  onValueChange={(value: any) => setParams({ ...params, driverMode: value })}
                >
                  <SelectTrigger id="driverMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Bez pridelenia</SelectItem>
                    <SelectItem value="fixed">Pevný vodič</SelectItem>
                    <SelectItem value="random">Náhodný výber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {params.driverMode === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="driver">Vodič</Label>
                  <Select
                    value={params.driverId || ""}
                    onValueChange={(value) => setParams({ ...params, driverId: value })}
                  >
                    <SelectTrigger id="driver">
                      <SelectValue placeholder="Vyber vodiča" />
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
              )}
            </CardContent>
          </Card>

          {params.kmSource === "phl" && (
            <Card>
              <CardHeader>
                <CardTitle>PHM nastavenia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phlMode">Režim PHM</Label>
                  <Select
                    value={params.phlMode}
                    onValueChange={(value: any) => setParams({ ...params, phlMode: value })}
                  >
                    <SelectTrigger id="phlMode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Bez PHM</SelectItem>
                      <SelectItem value="check_only">Iba kontrola</SelectItem>
                      <SelectItem value="full">Plné generovanie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {params.phlMode === "full" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phlDistribution">Rozloženie km</Label>
                      <Select
                        value={params.phlKmDistribution}
                        onValueChange={(value: any) => setParams({ ...params, phlKmDistribution: value })}
                      >
                        <SelectTrigger id="phlDistribution">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="even">Rovnomerne</SelectItem>
                          <SelectItem value="percent_limit">Percentuálny limit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {params.phlKmDistribution === "percent_limit" && (
                      <div className="space-y-2">
                        <Label htmlFor="phlMaxPercent">Max. % km na jazdu</Label>
                        <Input
                          id="phlMaxPercent"
                          type="number"
                          value={params.phlMaxPercentPerTrip || 20}
                          onChange={(e) =>
                            setParams({ ...params, phlMaxPercentPerTrip: Number.parseInt(e.target.value) || 20 })
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Späť
            </Button>
            <Button onClick={handleGeneratePreview} disabled={generating}>
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Vygenerovať náhľad
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && preview && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sumár generovania</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-sm text-muted-foreground">Celkom dní</div>
                  <div className="text-2xl font-bold">{preview.summary.totalDays}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Vygenerovaných jázd</div>
                  <div className="text-2xl font-bold">{preview.summary.totalGeneratedTrips}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Celkom km</div>
                  <div className="text-2xl font-bold">{preview.summary.totalKm}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zdroj km</div>
                  <div className="text-2xl font-bold">
                    {preview.summary.kmSource === "tacho" ? "Tachometer" : "PHM"}
                  </div>
                </div>
              </div>

              {preview.summary.warnings && preview.summary.warnings.length > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {preview.summary.warnings.map((warning: any, idx: number) => (
                        <div key={idx}>
                          {warning.message} ({warning.count}×)
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vygenerované jazdy</CardTitle>
              <CardDescription>{preview.trips.length} jázd na kontrolu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {preview.trips.map((trip, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{trip.placeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {trip.date} • {trip.timeFrom} - {trip.timeTo}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{trip.km} km</Badge>
                      {trip.flags.map((flag) => (
                        <Badge key={flag} variant="outline">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Späť
            </Button>
            <Button onClick={handleConfirm} disabled={confirming}>
              {confirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Potvrdiť a vytvoriť jazdy
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
