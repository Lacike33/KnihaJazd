"use client"

import type React from "react"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createDriver, updateDriver } from "@/lib/api/drivers"
import type { Driver } from "@/lib/types"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DriverFormDialogProps {
  driver?: Driver
  trigger?: React.ReactNode
}

export function DriverFormDialog({ driver, trigger }: DriverFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [createUserAccount, setCreateUserAccount] = useState(false)

  const [formData, setFormData] = useState({
    name: driver?.name || "",
    userId: driver?.userId || "",
    email: "",
    password: "",
    role: "driver" as "driver" | "accountant" | "viewer",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        name: formData.name,
        userId: formData.userId || undefined,
        ...(createUserAccount && {
          createUser: true,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      }

      if (driver) {
        await updateDriver(driver.id, data)
        toast({ title: "Vodič aktualizovaný" })
      } else {
        await createDriver(data)
        toast({
          title: "Vodič vytvorený",
          description: createUserAccount ? "Vodičovi bol odoslaný registračný email" : undefined,
        })
      }

      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Chyba",
        description: error instanceof Error ? error.message : "Nepodarilo sa uložiť vodiča",
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
            Pridať vodiča
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{driver ? "Upraviť vodiča" : "Nový vodič"}</DialogTitle>
          <DialogDescription>{driver ? "Upravte údaje vodiča" : "Vytvorte nového vodiča v systéme"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Meno a priezvisko *</Label>
            <Input
              id="name"
              placeholder="Ján Novák"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {!driver && (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="create-account">Vytvoriť používateľský účet</Label>
                <p className="text-xs text-muted-foreground">Vodič dostane email s prístupovými údajmi</p>
              </div>
              <Switch id="create-account" checked={createUserAccount} onCheckedChange={setCreateUserAccount} />
            </div>
          )}

          {createUserAccount && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jan.novak@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Heslo *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimálne 6 znakov"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Používateľská rola *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "driver" | "accountant" | "viewer") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Vodič - svoje jazdy a priradené vozidlo</SelectItem>
                    <SelectItem value="accountant">Účtovník - čítanie všetkých jázd, exporty</SelectItem>
                    <SelectItem value="viewer">Pozorovateľ - iba čítanie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {!createUserAccount && (
            <div className="space-y-2">
              <Label htmlFor="userId">ID používateľa (voliteľné)</Label>
              <Input
                id="userId"
                placeholder="ID používateľa v systéme"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Ak je vodič prepojený s používateľským účtom, zadajte jeho ID.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ukladám..." : driver ? "Uložiť" : "Vytvoriť"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
