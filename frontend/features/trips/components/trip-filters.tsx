"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Vehicle, Driver } from "@/lib/types"
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"

export interface TripFilters {
  vehicleId?: string
  driverId?: string
  type?: string
  source?: string
  from?: string
  to?: string
}

interface TripFiltersProps {
  filters: TripFilters
  onFiltersChange: (filters: TripFilters) => void
  vehicles: Vehicle[]
  drivers: Driver[]
}

type DatePreset = "today" | "month" | "year" | "custom"

export function TripFiltersComponent({ filters, onFiltersChange, vehicles, drivers }: TripFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [datePreset, setDatePreset] = useState<DatePreset>("month")

  const applyDatePreset = (preset: DatePreset) => {
    setDatePreset(preset)
    const now = new Date()

    switch (preset) {
      case "today":
        setLocalFilters({
          ...localFilters,
          from: startOfDay(now).toISOString().split("T")[0],
          to: endOfDay(now).toISOString().split("T")[0],
        })
        break
      case "month":
        setLocalFilters({
          ...localFilters,
          from: startOfMonth(now).toISOString().split("T")[0],
          to: endOfMonth(now).toISOString().split("T")[0],
        })
        break
      case "year":
        setLocalFilters({
          ...localFilters,
          from: startOfYear(now).toISOString().split("T")[0],
          to: endOfYear(now).toISOString().split("T")[0],
        })
        break
      case "custom":
        // Keep existing dates or clear them
        break
    }
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleReset = () => {
    const emptyFilters: TripFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    setDatePreset("month")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Label className="mb-2 block">Časové obdobie</Label>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant={datePreset === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => applyDatePreset("today")}
            >
              Dnes
            </Button>
            <Button
              type="button"
              variant={datePreset === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => applyDatePreset("month")}
            >
              Tento mesiac
            </Button>
            <Button
              type="button"
              variant={datePreset === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => applyDatePreset("year")}
            >
              Tento rok
            </Button>
            <Button
              type="button"
              variant={datePreset === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => applyDatePreset("custom")}
            >
              Vlastné
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Vozidlo</Label>
            <Select
              value={localFilters.vehicleId || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, vehicleId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Všetky vozidlá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky vozidlá</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.registrationNo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vodič</Label>
            <Select
              value={localFilters.driverId || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, driverId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Všetci vodiči" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetci vodiči</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Typ jazdy</Label>
            <Select
              value={localFilters.type || "all"}
              onValueChange={(value) => setLocalFilters({ ...localFilters, type: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Všetky typy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky typy</SelectItem>
                <SelectItem value="business">Služobná</SelectItem>
                <SelectItem value="private">Súkromná</SelectItem>
                <SelectItem value="mixed">Zmiešaná</SelectItem>
                <SelectItem value="unknown">Neznáma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Zdroj</Label>
            <Select
              value={localFilters.source || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, source: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Všetky zdroje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky zdroje</SelectItem>
                <SelectItem value="gps_auto">GPS automaticky</SelectItem>
                <SelectItem value="gps_corrected">GPS + úprava</SelectItem>
                <SelectItem value="manual">Manuálne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {datePreset === "custom" && (
            <>
              <div className="space-y-2">
                <Label>Od dátumu</Label>
                <Input
                  type="date"
                  value={localFilters.from || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, from: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Do dátumu</Label>
                <Input
                  type="date"
                  value={localFilters.to || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, to: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleApply}>
            <Search className="mr-2 h-4 w-4" />
            Aplikovať filtre
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Vymazať filtre
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
