"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { getTripTemplate, updateTripTemplate, deleteTripTemplate } from "@/lib/api/templates"
import { TripRouteConfig } from "@/components/trips/trip-route-config"
import { MOCK_VEHICLES, MOCK_PLACES } from "@/lib/mock-data"
import type { TripType } from "@/lib/types"
import Link from "next/link"

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TemplateDetailContent id={id} />
}

function TemplateDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isNew = id === "new"

  const { data: template, isLoading } = useQuery({
    queryKey: ["trip-template", id],
    queryFn: () => getTripTemplate(id),
    enabled: !isNew,
  })

  const [formData, setFormData] = React.useState({
    name: "",
    vehicleId: "all",
    fromPlaceId: "",
    toPlaceId: "",
    distanceKm: "",
    defaultType: "business" as TripType,
    defaultDescription: "",
    enabledForMobileAuto: true,
    priority: "5",
    kmTolerance: "5",
    timeFilterEnabled: false,
    timeFilterStart: "08:00",
    timeFilterEnd: "17:00",
    workdaysOnly: false,
    excludeHolidays: false,
    isRecurring: false,
    isAllDayTrip: false,
    isOneWay: true,
    returnTrip: { enabled: false },
    waypoints: [],
    allowOnHolidays: false,
  })

  React.useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        vehicleId: template.vehicleId || "all",
        fromPlaceId: template.fromPlaceId,
        toPlaceId: template.toPlaceId,
        distanceKm: template.distanceKm.toString(),
        defaultType: template.defaultType,
        defaultDescription: template.defaultDescription || "",
        enabledForMobileAuto: template.enabledForMobileAuto,
        priority: template.priority.toString(),
        kmTolerance: (template.kmTolerance || 5).toString(),
        timeFilterEnabled: template.timeFilterEnabled || false,
        timeFilterStart: template.timeFilterStart || "08:00",
        timeFilterEnd: template.timeFilterEnd || "17:00",
        workdaysOnly: template.workdaysOnly || false,
        excludeHolidays: template.excludeHolidays || false,
        isRecurring: template.isRecurring || false,
        isAllDayTrip: template.isAllDayTrip || false,
        isOneWay: template.isOneWay ?? true,
        returnTrip: template.returnTrip || { enabled: false },
        waypoints: template.waypoints || [],
        allowOnHolidays: template.allowOnHolidays || false,
      })
    }
  }, [template])

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateTripTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-template", id] })
      queryClient.invalidateQueries({ queryKey: ["trip-templates"] })
      toast({
        title: "Šablóna uložená",
        description: "Zmeny boli úspešne uložené.",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTripTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-templates"] })
      toast({
        title: "Šablóna zmazaná",
        description: "Šablóna bola úspešne odstránená.",
      })
      router.push("/templates")
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      name: formData.name,
      vehicleId: formData.vehicleId === "all" ? undefined : formData.vehicleId,
      fromPlaceId: formData.fromPlaceId,
      toPlaceId: formData.toPlaceId,
      distanceKm: Number.parseFloat(formData.distanceKm),
      defaultType: formData.defaultType,
      defaultDescription: formData.defaultDescription,
      enabledForMobileAuto: formData.enabledForMobileAuto,
      priority: Number.parseInt(formData.priority),
      kmTolerance: Number.parseFloat(formData.kmTolerance),
      timeFilterEnabled: formData.timeFilterEnabled,
      timeFilterStart: formData.timeFilterEnabled ? formData.timeFilterStart : undefined,
      timeFilterEnd: formData.timeFilterEnabled ? formData.timeFilterEnd : undefined,
      workdaysOnly: formData.workdaysOnly,
      excludeHolidays: formData.excludeHolidays,
      isRecurring: formData.isRecurring,
      isAllDayTrip: formData.isAllDayTrip,
      isOneWay: formData.isOneWay,
      returnTrip: formData.isOneWay ? undefined : formData.returnTrip,
      waypoints: formData.waypoints,
      allowOnHolidays: formData.allowOnHolidays,
    })
  }

  const handleDelete = () => {
    if (confirm("Naozaj chcete zmazať túto šablónu?")) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return <div className="p-6">Načítavam...</div>
  }

  if (!isNew && !template) {
    return (
      <div className="p-6">
        <p>Šablóna nebola nájdená.</p>
        <Button onClick={() => router.push("/templates")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Späť na zoznam
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/templates">Šablóny</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{isNew ? "Nová šablóna" : formData.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isNew ? "Nová šablóna" : "Detail šablóny"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Vytvorte novú šablónu pre automatické rozpoznávanie jázd" : "Upravte nastavenia šablóny"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Späť
          </Button>
          {!isNew && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Zmazať
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Uložiť
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Základné údaje</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name">Názov šablóny *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="napr. Domov → Firma"
              />
            </div>
            <div>
              <Label htmlFor="vehicleId">Vozidlo</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
              >
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
            <div>
              <Label htmlFor="priority">Priorita</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="fromPlaceId">Miesto od *</Label>
              <Select
                value={formData.fromPlaceId}
                onValueChange={(value) => setFormData({ ...formData, fromPlaceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte miesto" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PLACES.map((place) => (
                    <SelectItem key={place.id} value={place.id}>
                      {place.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="toPlaceId">Miesto kam *</Label>
              <Select
                value={formData.toPlaceId}
                onValueChange={(value) => setFormData({ ...formData, toPlaceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte miesto" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PLACES.map((place) => (
                    <SelectItem key={place.id} value={place.id}>
                      {place.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="distanceKm">Vzdialenosť (km) *</Label>
              <Input
                id="distanceKm"
                type="number"
                step="0.1"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="kmTolerance">Tolerancia km (±)</Label>
              <Input
                id="kmTolerance"
                type="number"
                value={formData.kmTolerance}
                onChange={(e) => setFormData({ ...formData, kmTolerance: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="defaultType">Predvolený typ jazdy</Label>
              <Select
                value={formData.defaultType}
                onValueChange={(value: TripType) => setFormData({ ...formData, defaultType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Služobná</SelectItem>
                  <SelectItem value="private">Súkromná</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="defaultDescription">Predvolený účel</Label>
              <Textarea
                id="defaultDescription"
                value={formData.defaultDescription}
                onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
                placeholder="Predvolený text účelu jazdy"
                rows={2}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Typ šablóny</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isRecurring">Pravidelná jazda</Label>
                <p className="text-sm text-muted-foreground">Automaticky sa zaradí medzi plánované a trvalé jazdy</p>
              </div>
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isAllDayTrip">Celodenná jazda</Label>
                <p className="text-sm text-muted-foreground">Blokuje vozidlo/vodiča na celý deň</p>
              </div>
              <Switch
                id="isAllDayTrip"
                checked={formData.isAllDayTrip}
                onCheckedChange={(checked) => setFormData({ ...formData, isAllDayTrip: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowOnHolidays">Môže sa vykonať počas sviatkov</Label>
                <p className="text-sm text-muted-foreground">Šablóna bude dostupná aj v dni pracovného pokoja</p>
              </div>
              <Switch
                id="allowOnHolidays"
                checked={formData.allowOnHolidays}
                onCheckedChange={(checked) => setFormData({ ...formData, allowOnHolidays: checked })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Konfigurácia trasy</h2>
          <TripRouteConfig
            isOneWay={formData.isOneWay}
            onOneWayChange={(value) => setFormData({ ...formData, isOneWay: value })}
            returnTrip={formData.returnTrip}
            onReturnTripChange={(value) => setFormData({ ...formData, returnTrip: value })}
            waypoints={formData.waypoints}
            onWaypointsChange={(value) => setFormData({ ...formData, waypoints: value })}
            places={MOCK_PLACES}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nastavenia pre automatiku</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabledForMobileAuto">Povoliť pre mobilné auto-generovanie</Label>
              <Switch
                id="enabledForMobileAuto"
                checked={formData.enabledForMobileAuto}
                onCheckedChange={(checked) => setFormData({ ...formData, enabledForMobileAuto: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="timeFilterEnabled">Časový filter</Label>
              <Switch
                id="timeFilterEnabled"
                checked={formData.timeFilterEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, timeFilterEnabled: checked })}
              />
            </div>
            {formData.timeFilterEnabled && (
              <div className="grid gap-4 md:grid-cols-2 pl-4">
                <div>
                  <Label htmlFor="timeFilterStart">Čas od</Label>
                  <Input
                    id="timeFilterStart"
                    type="time"
                    value={formData.timeFilterStart}
                    onChange={(e) => setFormData({ ...formData, timeFilterStart: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeFilterEnd">Čas do</Label>
                  <Input
                    id="timeFilterEnd"
                    type="time"
                    value={formData.timeFilterEnd}
                    onChange={(e) => setFormData({ ...formData, timeFilterEnd: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label htmlFor="workdaysOnly">Iba pracovné dni</Label>
              <Switch
                id="workdaysOnly"
                checked={formData.workdaysOnly}
                onCheckedChange={(checked) => setFormData({ ...formData, workdaysOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="excludeHolidays">Vylúčiť sviatky</Label>
              <Switch
                id="excludeHolidays"
                checked={formData.excludeHolidays}
                onCheckedChange={(checked) => setFormData({ ...formData, excludeHolidays: checked })}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
