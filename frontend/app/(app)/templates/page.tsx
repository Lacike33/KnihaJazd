"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Car, MapPin, Clock, ToggleLeft, ToggleRight, Trash2, Calendar, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { TripTemplate, TripType } from "@/lib/types"
import { MOCK_VEHICLES, MOCK_PLACES } from "@/lib/mock-data"
import { getTripTemplates, createTripTemplate, deleteTripTemplate } from "@/lib/api/templates"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const queryClient = useQueryClient()
  const { data: templates = [] } = useQuery({
    queryKey: ["trip-templates"],
    queryFn: getTripTemplates,
  })

  const router = useRouter()

  const [detailTemplate, setDetailTemplate] = useState<TripTemplate | null>(null)
  const [search, setSearch] = useState("")

  const { toast } = useToast()

  const [formData, setFormData] = useState({
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
    isRecurring: false,
    isAllDayTrip: false,
    isOneWay: true,
    returnTrip: { enabled: false },
    waypoints: [],
    allowOnHolidays: false,
  })

  const filteredTemplates = templates.filter((template) => template.name.toLowerCase().includes(search.toLowerCase()))

  const createMutation = useMutation({
    mutationFn: createTripTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-templates"] })
      toast({
        title: "Šablóna vytvorená",
        description: `${formData.name} bola úspešne vytvorená.`,
      })
      router.push("/templates")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTripTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-templates"] })
      toast({
        title: "Šablóna zmazaná",
        description: "Šablóna bola úspešne odstránená.",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
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
      isRecurring: formData.isRecurring,
      isAllDayTrip: formData.isAllDayTrip,
      isOneWay: formData.isOneWay,
      returnTrip: formData.isOneWay ? undefined : formData.returnTrip,
      waypoints: formData.waypoints,
      allowOnHolidays: formData.allowOnHolidays,
    })
  }

  const getPlaceName = (placeId: string) => {
    return MOCK_PLACES.find((p) => p.id === placeId)?.name || "Neznáme"
  }

  const getVehicleName = (vehicleId?: string) => {
    if (!vehicleId || vehicleId === "all") return "Všetky vozidlá"
    const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registrationNo})` : "Neznáme"
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Šablóny jázd</h1>
          <p className="text-muted-foreground">Vytvorte šablóny pre automatické rozpoznávanie jázd</p>
        </div>
        <Button onClick={() => router.push("/templates/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Pridať šablónu
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Hľadať šablónu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
            <Link href={`/templates/${template.id}`} className="block cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    {template.enabledForMobileAuto ? (
                      <Badge variant="default" className="text-xs">
                        <ToggleRight className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <ToggleLeft className="h-3 w-3 mr-1" />
                        Manuálne
                      </Badge>
                    )}
                    {template.isRecurring && (
                      <Badge variant="default" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Pravidelná
                      </Badge>
                    )}
                    {template.isAllDayTrip && (
                      <Badge variant="secondary" className="text-xs">
                        Celodenná
                      </Badge>
                    )}
                    {template.allowOnHolidays && (
                      <Badge variant="outline" className="text-xs">
                        <Sun className="h-3 w-3 mr-1" />
                        Aj sviatky
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      Priorita: {template.priority}
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {getPlaceName(template.fromPlaceId)} → {getPlaceName(template.toPlaceId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>
                        {template.distanceKm} km (±{template.kmTolerance || 5} km)
                      </span>
                      {template.timeFilterEnabled && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.timeFilterStart}–{template.timeFilterEnd}
                        </span>
                      )}
                      {template.workdaysOnly && (
                        <Badge variant="secondary" className="text-xs">
                          Pracovné dni
                        </Badge>
                      )}
                      {!template.workdaysOnly && (
                        <Badge variant="outline" className="text-xs">
                          Bez sviatkov
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>{getVehicleName(template.vehicleId)}</span>
                    </div>
                    {template.defaultDescription && (
                      <p className="text-xs mt-1 italic">{template.defaultDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm("Naozaj chcete zmazať túto šablónu?")) {
                    deleteMutation.mutate(template.id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne šablóny</h3>
          <p className="text-muted-foreground mb-4">
            {search ? "Nenašli sa žiadne výsledky pre vaše vyhľadávanie." : "Vytvorte svoju prvú šablónu jazdy."}
          </p>
        </Card>
      )}

      <Dialog open={!!detailTemplate} onOpenChange={(open) => !open && setDetailTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailTemplate?.name}</DialogTitle>
          </DialogHeader>
          {detailTemplate && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Trasa</p>
                <p className="text-sm text-muted-foreground">
                  {getPlaceName(detailTemplate.fromPlaceId)} → {getPlaceName(detailTemplate.toPlaceId)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Vzdialenosť</p>
                <p className="text-sm text-muted-foreground">
                  {detailTemplate.distanceKm} km (±{detailTemplate.kmTolerance || 5} km)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Vozidlo</p>
                <p className="text-sm text-muted-foreground">{getVehicleName(detailTemplate.vehicleId)}</p>
              </div>
              {detailTemplate.defaultDescription && (
                <div>
                  <p className="text-sm font-medium">Predvolený účel</p>
                  <p className="text-sm text-muted-foreground">{detailTemplate.defaultDescription}</p>
                </div>
              )}
              <Button asChild className="w-full">
                <Link href={`/templates/${detailTemplate.id}`}>Otvoriť detail</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
