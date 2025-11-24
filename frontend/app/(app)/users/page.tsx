"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, createUser, deleteUser } from "@/lib/api/users"
import { getDrivers } from "@/lib/api/drivers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Trash2, Shield, User, Eye, Calculator } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { User as UserType } from "@/lib/types"

const roleIcons = {
  admin: Shield,
  driver: User,
  accountant: Calculator,
  viewer: Eye,
}

const roleLabels = {
  admin: "Administrátor",
  driver: "Vodič",
  accountant: "Účtovník",
  viewer: "Pozorovateľ",
}

const roleColors = {
  admin: "bg-red-100 text-red-800",
  driver: "bg-blue-100 text-blue-800",
  accountant: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800",
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createNewDriver, setCreateNewDriver] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "driver" as UserType["role"],
    driverId: "",
    driverFirstName: "",
    driverLastName: "",
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setCreateOpen(false)
      setFormData({ name: "", email: "", role: "driver", driverId: "", driverFirstName: "", driverLastName: "" })
      toast({
        title: "Úspech",
        description: "Používateľ bol vytvorený",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setDeleteId(null)
      toast({
        title: "Úspech",
        description: "Používateľ bol odstránený",
      })
    },
  })

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get drivers without user accounts for the dropdown
  const driversWithoutAccounts = drivers.filter((d) => !d.userId)

  const handleCreate = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Chyba",
        description: "Vyplňte všetky povinné polia",
        variant: "destructive",
      })
      return
    }

    if (formData.role === "driver" && createNewDriver && (!formData.driverFirstName || !formData.driverLastName)) {
      toast({
        title: "Chyba",
        description: "Vyplňte meno a priezvisko vodiča",
        variant: "destructive",
      })
      return
    }

    createMutation.mutate({
      email: formData.email,
      role: formData.role,
      driverId: formData.role === "driver" && formData.driverId ? formData.driverId : undefined,
      company: users[0]?.company,
      driverFirstName: createNewDriver ? formData.driverFirstName : undefined,
      driverLastName: createNewDriver ? formData.driverLastName : undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Načítavam...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Používatelia</h1>
          <p className="text-muted-foreground">Správa používateľských účtov</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Pridať používateľa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Hľadať podľa emailu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Prepojený vodič</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role]
                const linkedDriver = user.driverId ? drivers.find((d) => d.id === user.driverId) : null

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {linkedDriver ? (
                        <span className="text-sm text-muted-foreground">{linkedDriver.name}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(user.id)}
                        disabled={user.role === "admin"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pridať používateľa</DialogTitle>
            <DialogDescription>Vytvorte nový používateľský účet s prístupom do aplikácie</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rola *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserType["role"]) =>
                  setFormData({ ...formData, role: value, driverId: value !== "driver" ? "" : formData.driverId })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Vodič</SelectItem>
                  <SelectItem value="accountant">Účtovník</SelectItem>
                  <SelectItem value="viewer">Pozorovateľ</SelectItem>
                  <SelectItem value="admin">Administrátor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === "driver" && (
              <>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <Switch
                    id="create-new-driver"
                    checked={createNewDriver}
                    onCheckedChange={(checked) => {
                      setCreateNewDriver(checked)
                      if (checked) {
                        setFormData({ ...formData, driverId: "" })
                      }
                    }}
                  />
                  <Label htmlFor="create-new-driver" className="cursor-pointer">
                    Vytvoriť nového vodiča
                  </Label>
                </div>

                {createNewDriver ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="driverFirstName">Meno vodiča *</Label>
                      <Input
                        id="driverFirstName"
                        value={formData.driverFirstName}
                        onChange={(e) => setFormData({ ...formData, driverFirstName: e.target.value })}
                        placeholder="Peter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driverLastName">Priezvisko vodiča *</Label>
                      <Input
                        id="driverLastName"
                        value={formData.driverLastName}
                        onChange={(e) => setFormData({ ...formData, driverLastName: e.target.value })}
                        placeholder="Novák"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="driverId">Prepojený vodič (voliteľné)</Label>
                    <Select
                      value={formData.driverId}
                      onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte vodiča..." />
                      </SelectTrigger>
                      <SelectContent>
                        {driversWithoutAccounts.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Prepojte používateľa s existujúcim vodičom bez účtu</p>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              Vytvoriť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odstrániť používateľa?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nenávratná. Používateľský účet bude trvalo odstránený. Ak je prepojený s vodičom, prepojenie
              bude odstránené.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Odstrániť
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
