"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, X, GripVertical } from "lucide-react"
import type { TemplateWaypoint, TemplateReturnTrip, Place } from "@/lib/types"

interface TripRouteConfigProps {
  isOneWay: boolean
  onOneWayChange: (value: boolean) => void
  returnTrip?: TemplateReturnTrip
  onReturnTripChange: (value: TemplateReturnTrip) => void
  waypoints: TemplateWaypoint[]
  onWaypointsChange: (value: TemplateWaypoint[]) => void
  places: Place[]
}

export function TripRouteConfig({
  isOneWay,
  onOneWayChange,
  returnTrip = { enabled: false },
  onReturnTripChange,
  waypoints,
  onWaypointsChange,
  places,
}: TripRouteConfigProps) {
  const [newWaypointPlaceId, setNewWaypointPlaceId] = useState("")

  const addWaypoint = () => {
    if (!newWaypointPlaceId) return
    const place = places.find((p) => p.id === newWaypointPlaceId)
    if (!place) return

    const newWaypoint: TemplateWaypoint = {
      id: `waypoint-${Date.now()}`,
      placeId: newWaypointPlaceId,
      placeName: place.name,
      order: waypoints.length,
      isFixed: true,
    }
    onWaypointsChange([...waypoints, newWaypoint])
    setNewWaypointPlaceId("")
  }

  const removeWaypoint = (id: string) => {
    onWaypointsChange(waypoints.filter((w) => w.id !== id))
  }

  const toggleWaypointFixed = (id: string) => {
    onWaypointsChange(waypoints.map((w) => (w.id === id ? { ...w, isFixed: !w.isFixed } : w)))
  }

  return (
    <div className="space-y-4">
      {/* One-way/Round-trip configuration */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isOneWay" className="text-base font-semibold">
                Jednosmerná jazda
              </Label>
              <p className="text-sm text-muted-foreground">Ak nie je jednosmerná, konfigurovať možnosť návratu</p>
            </div>
            <Switch id="isOneWay" checked={isOneWay} onCheckedChange={onOneWayChange} />
          </div>

          {!isOneWay && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="returnEnabled">Pridať návrat</Label>
                <Switch
                  id="returnEnabled"
                  checked={returnTrip.enabled}
                  onCheckedChange={(checked) => onReturnTripChange({ ...returnTrip, enabled: checked })}
                />
              </div>

              {returnTrip.enabled && (
                <div className="space-y-4 pl-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="returnExactTime">Presný čas návratu (HH:mm)</Label>
                      <Input
                        id="returnExactTime"
                        type="time"
                        value={returnTrip.exactTime || ""}
                        onChange={(e) =>
                          onReturnTripChange({
                            ...returnTrip,
                            exactTime: e.target.value,
                            afterBreakMinutes: undefined,
                          })
                        }
                        placeholder="napr. 17:00"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Alebo nechajte prázdne a použite prestávku</p>
                    </div>

                    <div>
                      <Label htmlFor="afterBreakMinutes">Po prestávke (minúty)</Label>
                      <Input
                        id="afterBreakMinutes"
                        type="number"
                        min="0"
                        value={returnTrip.afterBreakMinutes || ""}
                        onChange={(e) =>
                          onReturnTripChange({
                            ...returnTrip,
                            afterBreakMinutes: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            exactTime: undefined,
                          })
                        }
                        placeholder="napr. 30"
                        disabled={!!returnTrip.exactTime}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Návrat po X minútach prestávky</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeTolerance">Časová tolerancia (minúty)</Label>
                    <Input
                      id="timeTolerance"
                      type="number"
                      min="0"
                      value={returnTrip.timeTolerance || ""}
                      onChange={(e) =>
                        onReturnTripChange({
                          ...returnTrip,
                          timeTolerance: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="napr. 15"
                    />
                    <p className="text-xs text-muted-foreground mt-1">O koľko môže byť reálny čas odchýlený</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Waypoints configuration */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Medzizastávky</Label>
            <p className="text-sm text-muted-foreground">Pridajte zastávky medzi štartom a cieľom</p>
          </div>

          {waypoints.length > 0 && (
            <div className="space-y-2">
              {waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {index + 1}. {waypoint.placeName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {waypoint.isFixed ? "Fixná zastávka" : "Náhodná zastávka"}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => toggleWaypointFixed(waypoint.id)}>
                    {waypoint.isFixed ? "Fixná" : "Náhodná"}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeWaypoint(waypoint.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Select value={newWaypointPlaceId} onValueChange={setNewWaypointPlaceId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Vyberte miesto" />
              </SelectTrigger>
              <SelectContent>
                {places.map((place) => (
                  <SelectItem key={place.id} value={place.id}>
                    {place.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addWaypoint} disabled={!newWaypointPlaceId}>
              <Plus className="h-4 w-4 mr-2" />
              Pridať zastávku
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
