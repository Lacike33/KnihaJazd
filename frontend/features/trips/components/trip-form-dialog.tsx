"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import type { Vehicle, Driver, Place } from "@/lib/types"
import { MOCK_PLACES, MOCK_COMPANY_SETTINGS } from "@/lib/mock-data"

interface TripFormDialogProps {
  vehicles: Vehicle[]
  drivers: Driver[]
  onSubmit: (data: any) => void
}

export function TripFormDialog({ vehicles, drivers, onSubmit }: TripFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [places] = useState<Place[]>(MOCK_PLACES)
  const [selectedDriverId, setSelectedDriverId] = useState("")
  const [selectedVehicleId, setSelectedVehicleId] = useState("")
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    startTime: "",
    endTime: "",
    startLocation: "",
    endLocation: "",
    distanceKm: "",
    type: "business",
    description: "",
  })

  const activeVehicles = vehicles.filter((v) => v.active !== false)

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId)

  const availableVehicles =
    selectedDriver?.drivingPermission === "only_default" && selectedDriver.defaultVehicleId
      ? activeVehicles.filter((v) => v.id === selectedDriver.defaultVehicleId)
      : activeVehicles

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverId(driverId)
    const driver = drivers.find((d) => d.id === driverId)

    if (driver?.defaultVehicleId && !formData.vehicleId) {
      setFormData({ ...formData, driverId, vehicleId: driver.defaultVehicleId })
      setSelectedVehicleId(driver.defaultVehicleId)
    } else {
      setFormData({ ...formData, driverId })
    }
  }

  const handleLocationChange = (location: string, field: "startLocation" | "endLocation") => {
    const place = places.find((p) => p.name === location)
    const newData = { ...formData, [field]: location }

    if (
      MOCK_COMPANY_SETTINGS.autofillDefaultTripPurpose &&
      place?.tripPurposes &&
      place.defaultPurposeIndex !== undefined &&
      place.tripPurposes[place.defaultPurposeIndex] &&
      !formData.description
    ) {
      newData.description = place.tripPurposes[place.defaultPurposeIndex]
    }

    setFormData(newData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      distanceKm: Number.parseFloat(formData.distanceKm),
      source: "manual",
      locked: false,
    })
    setOpen(false)
    setFormData({
      vehicleId: "",
      driverId: "",
      startTime: "",
      endTime: "",
      startLocation: "",
      endLocation: "",
      distanceKm: "",
      type: "business",
      description: "",
    })
    setSelectedDriverId("")
    setSelectedVehicleId("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Pridať jazdu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pridať novú jazdu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vozidlo *</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => {
                  setFormData({ ...formData, vehicleId: value })
                  setSelectedVehicleId(value)
                }}
                required
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Vyberte vozidlo" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNo} {vehicle.brand && `(${vehicle.brand} ${vehicle.model})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDriver?.drivingPermission === "only_default" &&
                selectedDriver.defaultVehicleId &&
                availableVehicles.length === 1 && (
                  <p className="text-xs text-amber-600">Tento vodič môže jazdiť len na defaultnom vozidle</p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverId">Vodič</Label>
              <Select value={formData.driverId} onValueChange={handleDriverChange}>
                <SelectTrigger id="driverId">
                  <SelectValue placeholder="Vyberte vodiča" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Bez vodiča</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="startLocation">Miesto začiatku</Label>
              <select
                id="startLocation"
                value={formData.startLocation}
                onChange={(e) => handleLocationChange(e.target.value, "startLocation")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Vybrať miesto alebo zadať vlastné</option>
                {places.map((place) => (
                  <option key={place.id} value={place.name}>
                    {place.name}
                    {place.defaultPurposeIndex !== undefined && " ⭐"}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Alebo zadajte vlastné miesto..."
                value={formData.startLocation}
                onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endLocation">Miesto konca</Label>
              <select
                id="endLocation"
                value={formData.endLocation}
                onChange={(e) => handleLocationChange(e.target.value, "endLocation")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Vybrať miesto alebo zadať vlastné</option>
                {places.map((place) => (
                  <option key={place.id} value={place.name}>
                    {place.name}
                    {place.defaultPurposeIndex !== undefined && " ⭐"}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Alebo zadajte vlastné miesto..."
                value={formData.endLocation}
                onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distanceKm">Prejdené km *</Label>
              <Input
                id="distanceKm"
                type="number"
                step="0.1"
                min="0"
                placeholder="napr. 125.5"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Typ jazdy *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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

          <div className="space-y-2">
            <Label htmlFor="description">Popis / účel cesty</Label>
            <Textarea
              id="description"
              placeholder="napr. Stretnutie s klientom, dovoz tovaru..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit">Uložiť jazdu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
