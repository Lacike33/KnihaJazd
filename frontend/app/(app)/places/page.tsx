"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, MapPin, Building2, Home, Trash2, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Place, PlaceType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { getPlaces, createPlace, deletePlace } from "@/lib/api/places" // Importing getPlaces, createPlace, and deletePlace
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

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

export default function PlacesPage() {
  const queryClient = useQueryClient()
  const { data: places = [] } = useQuery({
    queryKey: ["places"],
    queryFn: getPlaces,
  })

  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [open, setOpen] = useState(false)
  const [detailPlace, setDetailPlace] = useState<Place | null>(null)
  const [previewPlace, setPreviewPlace] = useState<Place | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    type: "client" as PlaceType,
    street: "",
    number: "",
    city: "",
    postalCode: "",
    country: "Slovensko",
    notes: "",
    gpsLat: "",
    gpsLng: "",
    isCompanyLocation: false,
    tripPurposes: [""] as string[],
    defaultPurposeIndex: 0,
  })

  const filteredPlaces = places
    .filter(
      (place) =>
        place.name.toLowerCase().includes(search.toLowerCase()) ||
        place.address?.city?.toLowerCase().includes(search.toLowerCase()) ||
        place.address?.street?.toLowerCase().includes(search.toLowerCase()) ||
        place.address?.postalCode?.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((place) => {
      if (selectedTag === "all") return true
      if (selectedTag === "sidlo") return place.type === "headquarters" || place.isCompanyLocation
      if (selectedTag === "klient") return place.type === "client"
      if (selectedTag === "prevadzka") return place.type === "own_place"
      if (selectedTag === "phm") {
        const hasPhm = place.tripPurposes?.some(
          (p) => p.toLowerCase().includes("phm") || p.toLowerCase().includes("tankovanie"),
        )
        const notesPhm = place.notes?.toLowerCase().includes("phm") || place.notes?.toLowerCase().includes("tankovanie")
        return place.type === "own_place" && (hasPhm || notesPhm)
      }
      return true
    })

  const createMutation = useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] })
      toast({
        title: "Miesto pridané",
        description: `${formData.name} bolo úspešne pridané.`,
      })
      setOpen(false)
      setFormData({
        name: "",
        type: "client",
        street: "",
        number: "",
        city: "",
        postalCode: "",
        country: "Slovensko",
        notes: "",
        gpsLat: "",
        gpsLng: "",
        isCompanyLocation: false,
        tripPurposes: [""] as string[],
        defaultPurposeIndex: 0,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] })
      toast({
        title: "Miesto zmazané",
        description: "Miesto bolo úspešne odstránené.",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      ...formData,
      address: {
        street: formData.street,
        number: formData.number,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      latitude: formData.gpsLat ? Number.parseFloat(formData.gpsLat) : undefined,
      longitude: formData.gpsLng ? Number.parseFloat(formData.gpsLng) : undefined,
      isCompanyLocation: formData.isCompanyLocation,
      tripPurposes: formData.tripPurposes.filter((p) => p.trim() !== ""),
      defaultPurposeIndex: formData.defaultPurposeIndex,
    })
  }

  const PlaceIcon = ({ type }: { type: PlaceType }) => {
    const Icon = placeTypeIcons[type]
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Klienti & Miesta</h1>
          <p className="text-muted-foreground">Spravujte často používané miesta a klientov</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Pridať miesto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nové miesto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Názov miesta *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="napr. Klient ABC s.r.o."
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Typ *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: PlaceType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Klient</SelectItem>
                    <SelectItem value="own_place">Prevádzka</SelectItem>
                    <SelectItem value="headquarters">Sídlo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Ulica *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Hlavná"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="number">Číslo *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">PSČ *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="811 01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="city">Mesto *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bratislava"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Štát *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Poznámka</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Dodatočné informácie"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="gpsLat">GPS šírka</Label>
                <Input
                  id="gpsLat"
                  value={formData.gpsLat}
                  onChange={(e) => setFormData({ ...formData, gpsLat: e.target.value })}
                  placeholder="napr. 48.1486"
                />
              </div>
              <div>
                <Label htmlFor="gpsLng">GPS dĺžka</Label>
                <Input
                  id="gpsLng"
                  value={formData.gpsLng}
                  onChange={(e) => setFormData({ ...formData, gpsLng: e.target.value })}
                  placeholder="napr. 17.1077"
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="isCompanyLocation"
                  type="checkbox"
                  checked={formData.isCompanyLocation}
                  onChange={(e) => setFormData({ ...formData, isCompanyLocation: e.target.checked })}
                  className="shrink-0"
                />
                <Label htmlFor="isCompanyLocation">Hlavné sídlo</Label>
              </div>
              <div>
                <Label>Účely cesty</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Pri automatickom generovaní jázd sa náhodne vyberie jeden z účelov
                </p>
                <div className="space-y-2">
                  {formData.tripPurposes.map((purpose, index) => (
                    <div key={index} className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.defaultPurposeIndex === index ? "default" : "ghost"}
                        size="icon"
                        className="shrink-0"
                        onClick={() => {
                          setFormData({ ...formData, defaultPurposeIndex: index })
                        }}
                        title="Označiť ako predvolený účel"
                      >
                        <X className={`h-4 w-4 ${formData.defaultPurposeIndex === index ? "fill-current" : ""}`} />
                      </Button>
                      <Input
                        value={purpose}
                        onChange={(e) => {
                          const newPurposes = [...formData.tripPurposes]
                          newPurposes[index] = e.target.value
                          setFormData({ ...formData, tripPurposes: newPurposes })
                        }}
                        placeholder={`Účel ${index + 1} (napr. Obchodné rokovanie)`}
                      />
                      {formData.tripPurposes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newPurposes = formData.tripPurposes.filter((_, i) => i !== index)
                            const newDefaultIndex =
                              formData.defaultPurposeIndex === index ? 0 : formData.defaultPurposeIndex
                            setFormData({
                              ...formData,
                              tripPurposes: newPurposes,
                              defaultPurposeIndex: newDefaultIndex,
                            })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ ...formData, tripPurposes: [...formData.tripPurposes, ""] })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať účel
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Vytvoriť miesto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Tabs value={selectedTag} onValueChange={setSelectedTag} className="mb-3">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Všetky</TabsTrigger>
            <TabsTrigger value="sidlo">Sídlo</TabsTrigger>
            <TabsTrigger value="klient">Klient</TabsTrigger>
            <TabsTrigger value="prevadzka">Prevádzka</TabsTrigger>
            <TabsTrigger value="phm">PHM</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Hľadať miesto alebo adresu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <PlaceIcon type={place.type} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{place.name}</h3>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary">{placeTypeLabels[place.type]}</Badge>
                    {place.isCompanyLocation && (
                      <Badge variant="default" className="bg-blue-600">
                        Hlavné sídlo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewPlace(place)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            {place.address && (
              <p className="text-sm text-muted-foreground mb-2">
                <MapPin className="inline h-3 w-3 mr-1" />
                {`${place.address.street} ${place.address.number}, ${place.address.postalCode} ${place.address.city}`}
              </p>
            )}
            {place.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{place.notes}</p>}
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => {
                  window.location.href = `/places/${place.id}`
                }}
              >
                Detail
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Naozaj chcete zmazať ${place.name}?`)) {
                    deleteMutation.mutate(place.id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!previewPlace} onOpenChange={() => setPreviewPlace(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewPlace && <PlaceIcon type={previewPlace.type} />}
              {previewPlace?.name}
            </DialogTitle>
          </DialogHeader>
          {previewPlace && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="secondary">{placeTypeLabels[previewPlace.type]}</Badge>
                {previewPlace.isCompanyLocation && (
                  <Badge variant="default" className="bg-blue-600">
                    Hlavné sídlo
                  </Badge>
                )}
              </div>

              {previewPlace.address && (
                <div>
                  <Label>Adresa</Label>
                  <p className="text-sm text-foreground mt-1">
                    {previewPlace.address.street} {previewPlace.address.number}
                  </p>
                  <p className="text-sm text-foreground">
                    {previewPlace.address.postalCode} {previewPlace.address.city}
                  </p>
                  <p className="text-sm text-muted-foreground">{previewPlace.address.country}</p>
                </div>
              )}

              {previewPlace.latitude && previewPlace.longitude && (
                <div>
                  <Label>GPS súradnice</Label>
                  <p className="text-sm text-foreground mt-1">
                    {previewPlace.latitude}, {previewPlace.longitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${previewPlace.latitude},${previewPlace.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Otvoriť v Google Maps
                  </a>
                </div>
              )}

              {previewPlace.tripPurposes && previewPlace.tripPurposes.length > 0 && (
                <div>
                  <Label>Účely cesty</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewPlace.tripPurposes.map((purpose, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {index === previewPlace.defaultPurposeIndex && (
                          <X className="h-3 w-3 fill-current text-yellow-500" />
                        )}
                        {purpose}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewPlace.notes && (
                <div>
                  <Label>Poznámka</Label>
                  <p className="text-sm text-muted-foreground mt-1">{previewPlace.notes}</p>
                </div>
              )}

              <Button
                onClick={() => {
                  setPreviewPlace(null)
                  window.location.href = `/places/${previewPlace.id}`
                }}
                className="w-full"
              >
                Otvoriť detail miesta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredPlaces.length === 0 && (
        <Card className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne miesta</h3>
          <p className="text-muted-foreground mb-4">
            {search ? "Nenašli sa žiadne výsledky pre vaše vyhľadávanie." : "Začnite pridaním nového miesta."}
          </p>
        </Card>
      )}
    </div>
  )
}
