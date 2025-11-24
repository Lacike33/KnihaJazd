"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { MapPin, Building2, Home, ArrowLeft, Pencil, Plus, X, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getPlaces, updatePlace } from "@/lib/api/places"
import { getTrips } from "@/lib/api/trips"
import { MOCK_TRIP_TEMPLATES } from "@/lib/mock-data"
import type { PlaceType } from "@/lib/types"
import { format } from "date-fns"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"

const placeTypeLabels: Record<PlaceType, string> = {
  client: "Klient",
  own_place: "Vlastné miesto",
  headquarters: "Sídlo",
}

const placeTypeIcons: Record<PlaceType, any> = {
  client: Building2,
  own_place: MapPin,
  headquarters: Home,
}

export default function PlaceDetailPage() {
  const params = useParams()
  const placeId = params.id as string
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()

  const [isEditingPurposes, setIsEditingPurposes] = useState(false)
  const [editedPurposes, setEditedPurposes] = useState<string[]>([])
  const [editedDefaultIndex, setEditedDefaultIndex] = useState<number | undefined>(undefined)
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false)
  const [editedBasicInfo, setEditedBasicInfo] = useState({
    name: "",
    type: "client" as PlaceType,
    street: "",
    number: "",
    city: "",
    postalCode: "",
    country: "",
    notes: "",
    isCompanyLocation: false,
  })

  const { data: places = [], isLoading: placesLoading } = useQuery({
    queryKey: ["places"],
    queryFn: getPlaces,
  })

  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips({}),
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updatePlace(placeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] })
      setIsEditingPurposes(false)
      setIsEditingBasicInfo(false)
      toast({
        title: "Úspech",
        description: "Miesto bolo aktualizované.",
      })
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať miesto.",
        variant: "destructive",
      })
    },
  })

  const place = places.find((p) => p.id === placeId)

  const handleStartEdit = () => {
    setEditedPurposes(place?.tripPurposes || [])
    setEditedDefaultIndex(place?.defaultPurposeIndex)
    setIsEditingPurposes(true)
  }

  const handleCancelEdit = () => {
    setIsEditingPurposes(false)
    setEditedPurposes([])
    setEditedDefaultIndex(undefined)
  }

  const handleSaveEdit = () => {
    updateMutation.mutate({
      tripPurposes: editedPurposes.filter((p) => p.trim() !== ""),
      defaultPurposeIndex: editedDefaultIndex,
    })
  }

  const handleAddPurpose = () => {
    setEditedPurposes([...editedPurposes, ""])
  }

  const handleRemovePurpose = (index: number) => {
    setEditedPurposes(editedPurposes.filter((_, i) => i !== index))
  }

  const handlePurposeChange = (index: number, value: string) => {
    const updated = [...editedPurposes]
    updated[index] = value
    setEditedPurposes(updated)
  }

  const handleToggleDefault = (index: number) => {
    setEditedDefaultIndex(editedDefaultIndex === index ? undefined : index)
  }

  const handleStartEditBasicInfo = () => {
    setEditedBasicInfo({
      name: place?.name || "",
      type: place?.type || "client",
      street: place?.address?.street || "",
      number: place?.address?.number || "",
      city: place?.address?.city || "",
      postalCode: place?.address?.postalCode || "",
      country: place?.address?.country || "Slovensko",
      notes: place?.notes || "",
      isCompanyLocation: place?.isCompanyLocation || false,
    })
    setIsEditingBasicInfo(true)
  }

  const handleCancelEditBasicInfo = () => {
    setIsEditingBasicInfo(false)
  }

  const handleSaveBasicInfo = () => {
    updateMutation.mutate({
      name: editedBasicInfo.name,
      type: editedBasicInfo.type,
      address: {
        street: editedBasicInfo.street,
        number: editedBasicInfo.number,
        city: editedBasicInfo.city,
        postalCode: editedBasicInfo.postalCode,
        country: editedBasicInfo.country,
      },
      notes: editedBasicInfo.notes,
      isCompanyLocation: editedBasicInfo.isCompanyLocation,
    })
  }

  const PlaceIcon = placeTypeIcons[place?.type]

  if (placesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Načítavam...</p>
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/places">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium">Miesto nebolo nájdené</p>
            <p className="text-sm text-muted-foreground mt-2">Miesto s ID "{placeId}" neexistuje.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Breadcrumb items={[{ label: "Klienti & Miesta", href: "/places" }, { label: place?.name || "Detail" }]} />

      <div className="mb-6">
        <Link href="/places">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na zoznam
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <PlaceIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{place.name}</h1>
          <Badge variant="secondary" className="mt-2">
            {placeTypeLabels[place.type]}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informácie</TabsTrigger>
          <TabsTrigger value="trips">
            Jazdy (
            {trips.filter((trip) => trip.startLocation === place?.name || trip.endLocation === place?.name).length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            Šablóny (
            {
              MOCK_TRIP_TEMPLATES.filter(
                (template) => template.fromPlaceId === placeId || template.toPlaceId === placeId,
              ).length
            }
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Základné informácie</CardTitle>
                {user?.role === "admin" && !isEditingBasicInfo && (
                  <Button variant="ghost" size="sm" onClick={handleStartEditBasicInfo}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Upraviť
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingBasicInfo ? (
                <>
                  <div>
                    <Label>Názov</Label>
                    <p className="text-sm text-foreground mt-1">{place.name}</p>
                  </div>

                  <div>
                    <Label>Typ</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{placeTypeLabels[place.type]}</Badge>
                    </div>
                  </div>

                  {place.address && (
                    <>
                      <div>
                        <Label>Adresa</Label>
                        <p className="text-sm text-foreground mt-1">
                          {place.address.street} {place.address.number}
                        </p>
                        <p className="text-sm text-foreground">
                          {place.address.postalCode} {place.address.city}
                        </p>
                        <p className="text-sm text-muted-foreground">{place.address.country}</p>
                      </div>
                    </>
                  )}

                  {place.latitude && place.longitude && (
                    <div>
                      <Label>GPS súradnice</Label>
                      <p className="text-sm text-foreground mt-1">
                        {place.latitude}, {place.longitude}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Otvoriť v Google Maps
                      </a>
                    </div>
                  )}

                  {place.notes && (
                    <div>
                      <Label>Poznámka</Label>
                      <p className="text-sm text-muted-foreground mt-1">{place.notes}</p>
                    </div>
                  )}

                  {place.isCompanyLocation && (
                    <div>
                      <Badge variant="outline">Firemná lokácia</Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Názov *</Label>
                    <Input
                      id="edit-name"
                      value={editedBasicInfo.name}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-type">Typ *</Label>
                    <Select
                      value={editedBasicInfo.type}
                      onValueChange={(value: PlaceType) => setEditedBasicInfo({ ...editedBasicInfo, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Klient</SelectItem>
                        <SelectItem value="own_place">Vlastné miesto</SelectItem>
                        <SelectItem value="headquarters">Sídlo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-street">Ulica</Label>
                      <Input
                        id="edit-street"
                        value={editedBasicInfo.street}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, street: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-number">Číslo</Label>
                      <Input
                        id="edit-number"
                        value={editedBasicInfo.number}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-postal">PSČ</Label>
                      <Input
                        id="edit-postal"
                        value={editedBasicInfo.postalCode}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, postalCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-city">Mesto</Label>
                      <Input
                        id="edit-city"
                        value={editedBasicInfo.city}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-country">Krajina</Label>
                    <Input
                      id="edit-country"
                      value={editedBasicInfo.country}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, country: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-notes">Poznámka</Label>
                    <Textarea
                      id="edit-notes"
                      value={editedBasicInfo.notes}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-company-location"
                      checked={editedBasicInfo.isCompanyLocation}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, isCompanyLocation: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="edit-company-location">Firemná lokácia</Label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveBasicInfo} disabled={updateMutation.isPending}>
                      Uložiť
                    </Button>
                    <Button variant="outline" onClick={handleCancelEditBasicInfo}>
                      Zrušiť
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Účely cesty</Label>
                  {!isEditingPurposes && (
                    <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Upraviť
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Pri automatickom generovaní jázd sa používa predvolený účel (označený hviezdičkou), alebo sa náhodne
                  vyberie jeden z týchto účelov
                </p>

                {!isEditingPurposes ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {place?.tripPurposes && place.tripPurposes.length > 0 ? (
                      place.tripPurposes.map((purpose, index) => (
                        <Badge
                          key={index}
                          variant={place.defaultPurposeIndex === index ? "default" : "outline"}
                          className="text-sm"
                        >
                          {place.defaultPurposeIndex === index && <Star className="h-3 w-3 mr-1 fill-current" />}
                          {purpose}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Žiadne účely cesty</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editedPurposes.map((purpose, index) => (
                      <div key={index} className="flex gap-2">
                        <Button
                          variant={editedDefaultIndex === index ? "default" : "outline"}
                          size="icon"
                          onClick={() => handleToggleDefault(index)}
                          title="Označiť ako predvolený účel"
                        >
                          <Star className={`h-4 w-4 ${editedDefaultIndex === index ? "fill-current" : ""}`} />
                        </Button>
                        <Input
                          value={purpose}
                          onChange={(e) => handlePurposeChange(index, e.target.value)}
                          placeholder="Napríklad: Schôdzka s klientom"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemovePurpose(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddPurpose} className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Pridať účel
                    </Button>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                        Uložiť
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Zrušiť
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {place.latitude && place.longitude && (
            <Card>
              <CardHeader>
                <CardTitle>Mapa</CardTitle>
                <CardDescription>Poloha miesta na mape</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[400px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                  <div className="relative z-10 text-center space-y-2">
                    <MapPin className="h-12 w-12 mx-auto text-primary" />
                    <p className="text-sm font-medium">Mapa (placeholder)</p>
                    <p className="text-xs text-muted-foreground">
                      GPS: {place.latitude}, {place.longitude}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2"
                    >
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Otvoriť v Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jazdy spojené s týmto miestom</CardTitle>
              <CardDescription>Zoznam jázd, kde bolo toto miesto začiatkom alebo koncom cesty</CardDescription>
            </CardHeader>
            <CardContent>
              {trips.filter((trip) => trip.startLocation === place?.name || trip.endLocation === place?.name).length ===
              0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Žiadne jazdy spojené s týmto miestom.</p>
              ) : (
                <div className="space-y-2">
                  {trips
                    .filter((trip) => trip.startLocation === place?.name || trip.endLocation === place?.name)
                    .map((trip) => (
                      <Link key={trip.id} href={`/trips/${trip.id}`}>
                        <Card className="p-4 hover:bg-accent cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {trip.startLocation || "Neznáme"} → {trip.endLocation || "Neznáme"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{trip.distanceKm?.toFixed(1) || "0.0"} km</p>
                              <Badge variant={trip.type === "business" ? "default" : "secondary"}>{trip.type}</Badge>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Šablóny používajúce toto miesto</CardTitle>
              <CardDescription>Prednastavené trasy s týmto miestom</CardDescription>
            </CardHeader>
            <CardContent>
              {MOCK_TRIP_TEMPLATES.filter(
                (template) => template.fromPlaceId === placeId || template.toPlaceId === placeId,
              ).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Žiadne šablóny pre toto miesto.</p>
              ) : (
                <div className="space-y-2">
                  {MOCK_TRIP_TEMPLATES.filter(
                    (template) => template.fromPlaceId === placeId || template.toPlaceId === placeId,
                  ).map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.distanceKm} km · Priorita: {template.priority}
                          </p>
                        </div>
                        <Badge variant={template.enabledForMobileAuto ? "default" : "secondary"}>
                          {template.enabledForMobileAuto ? "Auto" : "Manuálne"}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
