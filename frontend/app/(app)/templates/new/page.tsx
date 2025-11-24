"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"
import { createTripTemplate } from "@/lib/api/templates"
import { toast } from "@/hooks/use-toast"

export default function NewTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isRegular: false,
    isAllDay: false,
    isOneWay: false,
    startTime: "08:00",
    endTime: "17:00",
    waypoints: [] as string[],
    excludedHolidays: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const template = await createTripTemplate({
        name: formData.name,
        description: formData.description || undefined,
        isRegular: formData.isRegular,
        isAllDay: formData.isAllDay,
        isOneWay: formData.isOneWay,
        startTime: formData.startTime,
        endTime: formData.endTime,
        waypoints: formData.waypoints.length > 0 ? formData.waypoints : undefined,
        excludedHolidays: formData.excludedHolidays.length > 0 ? formData.excludedHolidays : undefined,
      })

      toast({
        title: "Šablóna vytvorená",
        description: "Šablóna trasy bola úspešne vytvorená.",
      })

      router.push(`/templates/${template.id}`)
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vytvoriť šablónu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addWaypoint = () => {
    setFormData((prev) => ({
      ...prev,
      waypoints: [...prev.waypoints, ""],
    }))
  }

  const removeWaypoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== index),
    }))
  }

  const updateWaypoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      waypoints: prev.waypoints.map((w, i) => (i === index ? value : w)),
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Breadcrumb
        items={[{ label: "Domov", href: "/" }, { label: "Šablóny", href: "/templates" }, { label: "Nová šablóna" }]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nová šablóna trasy</h1>
        <p className="text-muted-foreground">Vytvorte novú šablónu pre opakujúce sa trasy</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Základné informácie</CardTitle>
            <CardDescription>Zadajte základné údaje o šablóne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Názov šablóny *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Napr. Cesta do práce"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Voliteľný popis šablóny"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nastavenia trasy</CardTitle>
            <CardDescription>Definujte parametre trasy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRegular"
                checked={formData.isRegular}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRegular: checked as boolean }))}
              />
              <Label htmlFor="isRegular">Pravidelná trasa</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAllDay"
                checked={formData.isAllDay}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAllDay: checked as boolean }))}
              />
              <Label htmlFor="isAllDay">Celodennná</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOneWay"
                checked={formData.isOneWay}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isOneWay: checked as boolean }))}
              />
              <Label htmlFor="isOneWay">Jednosmerná (iba tam)</Label>
            </div>

            {!formData.isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Čas začiatku</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Čas konca</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Zastávky</CardTitle>
            <CardDescription>Pridajte voliteľné zastávky na trase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.waypoints.map((waypoint, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={waypoint}
                  onChange={(e) => updateWaypoint(index, e.target.value)}
                  placeholder={`Zastávka ${index + 1}`}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeWaypoint(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addWaypoint}>
              <Plus className="h-4 w-4 mr-2" />
              Pridať zastávku
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Zrušiť
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Vytváranie..." : "Vytvoriť šablónu"}
          </Button>
        </div>
      </form>
    </div>
  )
}
