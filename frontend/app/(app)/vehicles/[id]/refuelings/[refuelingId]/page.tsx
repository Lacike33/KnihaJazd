"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRefueling, updateRefueling, deleteRefueling } from "@/lib/api/refuelings"
import { getVehicle } from "@/lib/api/vehicles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function RefuelingDetailPage({
  params,
}: {
  params: { id: string; refuelingId: string }
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const { data: vehicle } = useQuery({
    queryKey: ["vehicles", params.id],
    queryFn: () => getVehicle(params.id),
  })

  const { data: refueling, isLoading } = useQuery({
    queryKey: ["refuelings", params.refuelingId],
    queryFn: () => getRefueling(params.refuelingId),
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateRefueling(params.refuelingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refuelings"] })
      setIsEditing(false)
      toast({ title: "Úspech", description: "Tankovanie bolo aktualizované" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRefueling(params.refuelingId),
    onSuccess: () => {
      toast({ title: "Úspech", description: "Tankovanie bolo vymazané" })
      router.push(`/vehicles/${params.id}/refuelings`)
    },
  })

  if (isLoading) return <div className="p-6">Načítavam...</div>
  if (!refueling) return <div className="p-6">Tankovanie nenájdené</div>

  const handleEdit = () => {
    setFormData(refueling)
    setIsEditing(true)
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: vehicle?.registrationNo || params.id, href: `/vehicles/${params.id}` },
          { label: "Tankovania", href: `/vehicles/${params.id}/refuelings` },
          { label: "Detail" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/vehicles/${params.id}/refuelings`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Detail tankovania</h1>
          <p className="text-muted-foreground">{format(new Date(refueling.date), "dd.MM.yyyy HH:mm")}</p>
        </div>
        {!isEditing && (
          <>
            <Button onClick={handleEdit}>Upraviť</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vymazať
            </Button>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informácie o tankovaní</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid gap-2">
                <Label>Dátum a čas</Label>
                <Input
                  type="datetime-local"
                  value={formData.date ? format(new Date(formData.date), "yyyy-MM-dd'T'HH:mm") : ""}
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
                    onChange={(e) => setFormData({ ...formData, liters: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cena za liter (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.pricePerLiter}
                    onChange={(e) => setFormData({ ...formData, pricePerLiter: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Celková cena (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Stav tachometra (km)</Label>
                <Input
                  type="number"
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Miesto</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Číslo faktúry</Label>
                <Input
                  value={formData.invoiceNumber || ""}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Poznámky</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Uložiť
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Zrušiť
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Litre</div>
                <div className="font-medium">{refueling.liters.toFixed(2)} L</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Cena za liter</div>
                  <div className="font-medium">€{refueling.pricePerLiter.toFixed(2)}</div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Celková cena</div>
                  <div className="font-medium">€{refueling.totalPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Typ paliva</div>
                <div className="font-medium">{refueling.fuelType}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Stav tachometra</div>
                <div className="font-medium">{refueling.odometerKm.toLocaleString()} km</div>
              </div>
              {refueling.location && (
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Miesto</div>
                  <div className="font-medium">{refueling.location}</div>
                </div>
              )}
              {refueling.invoiceNumber && (
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Číslo faktúry</div>
                  <div className="font-medium">{refueling.invoiceNumber}</div>
                </div>
              )}
              {refueling.notes && (
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Poznámky</div>
                  <div className="font-medium">{refueling.notes}</div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
