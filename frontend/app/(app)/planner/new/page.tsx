"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getVehicles } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { getPlaces } from "@/lib/api/places"
import { getTemplates } from "@/lib/api/templates"
import { createPlannedTrip } from "@/lib/api/planner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Circle, Square, MapPin, Plus, X, Home } from "lucide-react"
import Link from "next/link"
import type { PlannedTrip, RecurrenceType, Place, TripWaypoint } from "@/lib/types"

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
              <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">Miesto nenájdené</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onValueChange(searchValue)
                    setOpen(false)
                  }}
                >
                  Použiť adresu: &quot;{searchValue}&quot;
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {places.map((place) => (
                <CommandItem
                  key={place.id}
                  value={place.name}
                  onSelect={() => {
                    onValueChange(place.id)
                    setOpen(false)
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{place.name}</div>
                    {place.address && <div className="text-xs text-muted-foreground">{place.address}</div>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function NewPlannedTripPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("workdays")
  const [waypoints, setWaypoints] = useState<TripWaypoint[]>([])

  const [formData, setFormData] = useState({
    driverId: "",
    vehicleId: "",
    templateId: "",
    plannedDate: "",
    plannedTimeFrom: "08:00",
    plannedTimeTo: "17:00",
    fromPlaceId: "",
    toPlaceId: "",
    distanceKm: 0,
    type: "business" as const,
    description: "",
    allowOnHolidays: false,
    isOneWay: false,
    recurrenceEndDate: "",
    timeTolerance: 15,
  })

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
    queryFn: getTemplates,
  })

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

  const selectedDriver = drivers.find((d) => d.id === formData.driverId)
  const canChangeVehicle = !selectedDriver || selectedDriver.drivingPermission === "all_vehicles"
  const activeVehicles = vehicles.filter((v) => v.active !== false)

  const createMutation = useMutation({
    mutationFn: (data: Partial<PlannedTrip>) => createPlannedTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannedTrips"] })
      toast({
        title: "Úspech",
        description: "Plánovaná jazda bola vytvorená",
      })
      router.push("/planner")
    },
    onError: (error: any) => {
      toast({
        title: "Chyba",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isRecurring && formData.recurrenceEndDate) {
      const startDate = new Date(formData.plannedDate)
      const endDate = new Date(formData.recurrenceEndDate)

      if (endDate < startDate) {
        toast({
          title: "Chyba validácie",
          description: "Dátum konca opakovania musí byť po dátume začiatku jazdy",
          variant: "destructive",
        })
        return
      }
    }

    const data: Partial<PlannedTrip> = {
      vehicleId: formData.vehicleId,
      driverId: formData.driverId || undefined,
      templateId: formData.templateId || undefined,
      plannedDate: formData.plannedDate,
      plannedTimeFrom: formData.plannedTimeFrom,
      plannedTimeTo: formData.plannedTimeTo,
      fromPlaceId: formData.fromPlaceId,
      toPlaceId: formData.toPlaceId,
      distanceKm: formData.distanceKm,
      type: formData.type,
      description: formData.description,
      isRecurring,
      recurrencePattern: isRecurring
        ? {
            type: recurrenceType,
            startDate: formData.plannedDate,
            endDate: formData.recurrenceEndDate || undefined,
            timeTolerance: formData.timeTolerance,
          }
        : undefined,
      waypoints,
      isOneWay: formData.isOneWay,
      returnTrip: formData.isOneWay
        ? undefined
        : {
            enabled: true,
            afterBreakMinutes: 60,
            timeTolerance: 30,
          },
      allowOnHolidays: formData.allowOnHolidays,
    }

    createMutation.mutate(data)
  }

  const handleAddWaypoint = () => {
    setWaypoints([
      ...waypoints,
      {
        id: `waypoint-${Date.now()}`,
        placeId: "",
        placeName: "",
        order: waypoints.length,
        isFixed: true,
      },
    ])
  }

  const handleRemoveWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((w) => w.id !== id))
  }

  const handleUpdateWaypoint = (id: string, updates: Partial<TripWaypoint>) => {
    setWaypoints(waypoints.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const handlePlaceSelect = (placeId: string, isStart: boolean) => {
    const place = places.find((p) => p.id === placeId)

    if (isStart) {
      setFormData((prev) => ({ ...prev, fromPlaceId: placeId }))
    } else {
      setFormData((prev) => ({
        ...prev,
        toPlaceId: placeId,
        description: place?.tripPurposes?.[0] || prev.description,
      }))
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/planner">Plánovač</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Nová plánovaná jazda</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Naplánovať novú trasu</h1>
        <p className="text-muted-foreground mt-1">Vytvor plánovanú alebo pravidelnú jazdu</p>
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
                <Label htmlFor="plannedDate">Plánovaný dátum *</Label>
                <Input
                  id="plannedDate"
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Typ jazdy *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
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

              <div className="space-y-2">
                <Label htmlFor="timeFrom">Čas od *</Label>
                <Input
                  id="timeFrom"
                  type="time"
                  value={formData.plannedTimeFrom}
                  onChange={(e) => setFormData({ ...formData, plannedTimeFrom: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeTo">Čas do *</Label>
                <Input
                  id="timeTo"
                  type="time"
                  value={formData.plannedTimeTo}
                  onChange={(e) => setFormData({ ...formData, plannedTimeTo: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trasa jazdy</CardTitle>
            <CardDescription>Definujte začiatok, cieľ a medzizastávky</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Start location */}
              <div className="flex items-start gap-3">
                <div className="mt-3">
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Odkiaľ *</Label>
                  <PlaceCombobox
                    value={formData.fromPlaceId}
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

              {/* Destination */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {waypoints.length > 0 && <div className="h-6 w-px bg-border" />}
                  <div className="mt-3">
                    <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Kam *</Label>
                  <PlaceCombobox
                    value={formData.toPlaceId}
                    onValueChange={(value) => handlePlaceSelect(value, false)}
                    placeholder="Vyberte alebo zadajte miesto cieľa"
                    places={places}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddWaypoint}
                className="ml-9 bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Pridať zastávku
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Vzdialenosť (km) *</Label>
              <Input
                id="distance"
                type="number"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Účel cesty</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Zadajte účel cesty..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOneWay"
                  checked={formData.isOneWay}
                  onCheckedChange={(checked) => setFormData({ ...formData, isOneWay: checked as boolean })}
                />
                <Label htmlFor="isOneWay" className="font-normal cursor-pointer">
                  Jednosmerná jazda (bez návratu)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowHolidays"
                  checked={formData.allowOnHolidays}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowOnHolidays: checked as boolean })}
                />
                <Label htmlFor="allowHolidays" className="font-normal cursor-pointer">
                  Môže sa vykonať aj počas sviatkov
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opakovanie</CardTitle>
            <CardDescription>Nastav pravidelnú jazdu s opakovaniami</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="isRecurring" className="font-normal cursor-pointer">
                Označiť ako pravidelnú jazdu
              </Label>
            </div>

            {isRecurring && (
              <>
                <div className="space-y-3">
                  <Label>Typ opakovania</Label>
                  <RadioGroup value={recurrenceType} onValueChange={(value: any) => setRecurrenceType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="font-normal cursor-pointer">
                        Denne
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="font-normal cursor-pointer">
                        Týždenne
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="font-normal cursor-pointer">
                        Mesačne
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="workdays" id="workdays" />
                      <Label htmlFor="workdays" className="font-normal cursor-pointer">
                        Pracovné dni (Po-Pia)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Dátum konca opakovania (voliteľné)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.recurrenceEndDate}
                    onChange={(e) => setFormData({ ...formData, recurrenceEndDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tolerance">Časová tolerancia (minúty)</Label>
                  <Input
                    id="tolerance"
                    type="number"
                    value={formData.timeTolerance}
                    onChange={(e) => setFormData({ ...formData, timeTolerance: Number.parseInt(e.target.value) || 15 })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Systém môže mierne randomizovať čas odjazdu/príchodu v rámci ±{formData.timeTolerance} minút
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Zrušiť
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Vytvára sa..." : "Vytvoriť plánovanú jazdu"}
          </Button>
        </div>
      </form>
    </div>
  )
}
