"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createGpsDevice, updateGpsDevice } from "@/lib/api/gps-devices"
import { getVehicles } from "@/lib/api/vehicles"
import type { GpsDevice } from "@/lib/types"
import { Plus } from "lucide-react"

interface GpsDeviceFormDialogProps {
  device?: GpsDevice
  trigger?: React.ReactNode
}

export function GpsDeviceFormDialog({ device, trigger }: GpsDeviceFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  })

  const [formData, setFormData] = useState({
    serialNumber: device?.serialNumber || "",
    vehicleId: device?.vehicleId || "none",
    isActive: device?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        serialNumber: formData.serialNumber,
        vehicleId: formData.vehicleId === "none" ? undefined : formData.vehicleId,
        isActive: formData.isActive,
      }

      if (device) {
        await updateGpsDevice(device.id, data)
        toast({ title: "GPS zariadenie aktualizované" })
      } else {
        await createGpsDevice(data)
        toast({ title: "GPS zariadenie vytvorené" })
      }

      queryClient.invalidateQueries({ queryKey: ["gps-devices"] })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Chyba",
        description: error instanceof Error ? error.message : "Nepodarilo sa uložiť GPS zariadenie",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Pridať GPS zariadenie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{device ? "Upraviť GPS zariadenie" : "Nové GPS zariadenie"}</DialogTitle>
          <DialogDescription>
            {device ? "Upravte údaje GPS zariadenia" : "Vytvorte nové GPS zariadenie v systéme"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Sériové číslo *</Label>
            <Input
              id="serialNumber"
              placeholder="GPS-12345"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Priradené vozidlo</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Vyberte vozidlo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Žiadne vozidlo</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.registrationNo} - {vehicle.brand} {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Aktívne zariadenie</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ukladám..." : device ? "Uložiť" : "Vytvoriť"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
