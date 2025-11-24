"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createRefueling } from "@/lib/api/refuelings"
import { getVehicle } from "@/lib/api/vehicles"
import { getDrivers } from "@/lib/api/drivers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function NewRefuelingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    vehicleId: params.id,
    driverId: "",
    date: new Date().toISOString(),
    liters: 0,
    pricePerLiter: 0,
    totalPrice: 0,
    fuelType: "diesel",
    odometerKm: 0,
    location: "",
    invoiceNumber: "",
    notes: "",
  })

  const { data: vehicle } = useQuery({
    queryKey: ["vehicles", params.id],
    queryFn: () => getVehicle(params.id),
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  })

  const createMutation = useMutation({
    mutationFn: createRefueling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refuelings"] })
      toast({ title: "Úspech", description: "Tankovanie bolo vytvorené" })
      router.push(`/vehicles/${params.id}/refuelings`)
    },
  })

  const handleSubmit = () => {
    createMutation.mutate(formData as any)
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: vehicle?.registrationNo || params.id, href: `/vehicles/${params.id}` },
          { label: "Tankovania", href: `/vehicles/${params.id}/refuelings` },
          { label: "Nové tankovanie" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/vehicles/${params.id}/refuelings`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Nové tankovanie</h1>
          <p className="text-muted-foreground">{vehicle?.registrationNo}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Údaje o tankovaní</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Vodič</Label>
            <select
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Vyberte vodiča</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Dátum a čas</Label>
            <Input
              type="datetime-local"
              value={formData.date.slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Litre</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.liters}
                onChange={(e) => {
                  const liters = Number.parseFloat(e.target.value) || 0
                  setFormData({
                    ...formData,
                    liters,
                    totalPrice: liters * formData.pricePerLiter,
                  })
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Cena za liter (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.pricePerLiter}
                onChange={(e) => {
                  const price = Number.parseFloat(e.target.value) || 0
                  setFormData({
                    ...formData,
                    pricePerLiter: price,
                    totalPrice: formData.liters * price,
                  })
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Celková cena (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.totalPrice}
              onChange={(e) => setFormData({ ...formData, totalPrice: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Typ paliva</Label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="diesel">Nafta</option>
              <option value="petrol">Benzín</option>
              <option value="electric">Elektrina</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Stav tachometra (km)</Label>
            <Input
              type="number"
              value={formData.odometerKm}
              onChange={(e) => setFormData({ ...formData, odometerKm: Number.parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Miesto</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Shell, Bratislava"
            />
          </div>

          <div className="grid gap-2">
            <Label>Číslo faktúry</Label>
            <Input
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Poznámky</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Uložiť tankovanie
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
