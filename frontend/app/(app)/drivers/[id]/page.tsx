"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getDrivers } from "@/lib/api/drivers"
import { getTrips } from "@/lib/api/trips"
import { getVehicles } from "@/lib/api/vehicles"
import { updateDriver } from "@/lib/api/drivers"
import { MOCK_REFUELINGS, MOCK_MAINTENANCE_RECORDS, MOCK_ODOMETER_READINGS } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleBadge } from "@/components/drivers/role-badge"
import { TripTypeBadge } from "@/components/trips/trip-type-badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Car, Fuel, Wrench, Camera, MapPin, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { DrivingPermission } from "@/lib/types"

export default function DriverDetailPage() {
  const params = useParams()
  const driverId = params.id as string
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [editingPermissions, setEditingPermissions] = useState(false)
  const [permissionsData, setPermissionsData] = useState({
    defaultVehicleId: "",
    drivingPermission: "all_vehicles" as DrivingPermission,
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  })

  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips(),
  })

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setEditingPermissions(false)
      toast({
        title: "Oprávnenia upravené",
        description: "Nastavenia vodiča boli úspešne aktualizované",
      })
    },
  })

  const driver = drivers.find((d) => d.id === driverId)
  const driverTrips = trips
    .filter((t) => t.driverId === driverId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  const recentTrips = driverTrips.slice(0, 5)

  // Get driver's recent activities
  const driverRefuelings = MOCK_REFUELINGS.filter((r) => r.driverId === driverId)
  const driverMaintenances = MOCK_MAINTENANCE_RECORDS.filter((m) => {
    const vehicle = driverTrips.find((t) => t.vehicleId === m.vehicleId)
    return vehicle !== undefined
  })
  const driverOdometerReadings = MOCK_ODOMETER_READINGS.filter((o) => {
    const vehicle = driverTrips.find((t) => t.vehicleId === o.vehicleId)
    return vehicle !== undefined && o.recordedBy === driver?.name
  })

  // Combine all activities and sort by date
  const allActivities = [
    ...driverTrips.map((t) => ({
      type: "trip" as const,
      date: t.startTime,
      description: `Jazda z ${t.startLocation || "neznáme"} do ${t.endLocation || "neznáme"}`,
      details: `${t.distanceKm?.toFixed(1) || "0.0"} km`,
      icon: Car,
    })),
    ...driverRefuelings.map((r) => ({
      type: "refueling" as const,
      date: r.date,
      description: `Tankovanie ${r.fuelType}`,
      details: `${r.liters.toFixed(1)} L za ${r.totalPrice.toFixed(2)} €`,
      icon: Fuel,
    })),
    ...driverMaintenances.map((m) => ({
      type: "maintenance" as const,
      date: m.date,
      description: m.description,
      details: `${m.cost.toFixed(2)} €`,
      icon: Wrench,
    })),
    ...driverOdometerReadings.map((o) => ({
      type: "odometer" as const,
      date: o.date,
      description: "Fotka tachometra",
      details: `${o.odometerKm} km`,
      icon: Camera,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const recentActivities = allActivities.slice(0, 10)

  // Calculate stats
  const totalKm = driverTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0)
  const businessTrips = driverTrips.filter((t) => t.type === "business").length
  const privateTrips = driverTrips.filter((t) => t.type === "private").length

  // Active vehicles only
  const activeVehicles = vehicles.filter((v) => v.active !== false)

  const handleEditPermissions = () => {
    setPermissionsData({
      defaultVehicleId: driver?.defaultVehicleId || "none",
      drivingPermission: driver?.drivingPermission || "all_vehicles",
    })
    setEditingPermissions(true)
  }

  const handleSavePermissions = () => {
    updateMutation.mutate({
      id: driverId,
      data: permissionsData,
    })
  }

  if (!driver) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Vodič nenájdený</p>
          <Button asChild className="mt-4">
            <Link href="/drivers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={[{ label: "Vodiči", href: "/drivers" }, { label: driver?.name || "Detail" }]} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/drivers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{driver.name}</h1>
          <p className="text-muted-foreground">Detail vodiča</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkovo km</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKm.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Z {driverTrips.length} jázd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Služobné jazdy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessTrips}</div>
            <p className="text-xs text-muted-foreground">
              {((businessTrips / driverTrips.length) * 100 || 0).toFixed(0)}% z celku
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Súkromné jazdy</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateTrips}</div>
            <p className="text-xs text-muted-foreground">
              {((privateTrips / driverTrips.length) * 100 || 0).toFixed(0)}% z celku
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informácie</TabsTrigger>
          <TabsTrigger value="trips">Jazdy</TabsTrigger>
          <TabsTrigger value="activity">Aktivita</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Osobné údaje</CardTitle>
              <CardDescription>Základné informácie o vodičovi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Meno</p>
                    <p className="text-sm text-muted-foreground">{driver.name}</p>
                  </div>
                </div>

                {driver.userId && (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {driver.userId === "2" ? "vodic@knihajazd.sk" : "Neznámy"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">Rola v systéme</p>
                        <div className="mt-1">{driver.role && <RoleBadge role={driver.role} />}</div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">Status účtu</p>
                    <div className="mt-1">
                      {driver.userId ? (
                        <Badge variant="default">Má používateľský účet</Badge>
                      ) : (
                        <Badge variant="secondary">Bez účtu</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Oprávnenia na jazdu</CardTitle>
                <CardDescription>Defaultné vozidlo a rozsah oprávnení</CardDescription>
              </div>
              {!editingPermissions && (
                <Button variant="outline" size="sm" onClick={handleEditPermissions}>
                  <Edit className="h-4 w-4 mr-2" />
                  Upraviť
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {editingPermissions ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="defaultVehicle">Defaultné vozidlo</Label>
                    <Select
                      value={permissionsData.defaultVehicleId}
                      onValueChange={(value) => setPermissionsData({ ...permissionsData, defaultVehicleId: value })}
                    >
                      <SelectTrigger id="defaultVehicle">
                        <SelectValue placeholder="Vyberte vozidlo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Žiadne</SelectItem>
                        {activeVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNo} ({vehicle.brand} {vehicle.model})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drivingPermission">Rozsah oprávnenia jazdiť</Label>
                    <Select
                      value={permissionsData.drivingPermission}
                      onValueChange={(value) =>
                        setPermissionsData({ ...permissionsData, drivingPermission: value as DrivingPermission })
                      }
                    >
                      <SelectTrigger id="drivingPermission">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="only_default">Len defaultné vozidlo</SelectItem>
                        <SelectItem value="all_vehicles">Môže jazdiť na všetkých vozidlách</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSavePermissions} disabled={updateMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      Uložiť
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPermissions(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Zrušiť
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Defaultné vozidlo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {driver.defaultVehicleId
                        ? (() => {
                            const vehicle = vehicles.find((v) => v.id === driver.defaultVehicleId)
                            return vehicle
                              ? `${vehicle.registrationNo} (${vehicle.brand} ${vehicle.model})`
                              : "Neznáme vozidlo"
                          })()
                        : "Nie je nastavené"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rozsah oprávnenia</p>
                    <div className="mt-1">
                      {driver.drivingPermission === "only_default" ? (
                        <Badge variant="secondary">Len defaultné vozidlo</Badge>
                      ) : (
                        <Badge variant="default">Všetky vozidlá</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trips Tab */}
        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posledné jazdy</CardTitle>
              <CardDescription>Najnovších 5 jázd vodiča</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTrips.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Vodič nemá žiadne jazdy</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Trasa</TableHead>
                        <TableHead className="text-right">Km</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell>{format(new Date(trip.startTime), "dd.MM.yyyy HH:mm", { locale: sk })}</TableCell>
                          <TableCell>
                            <TripTypeBadge type={trip.type} />
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {trip.startLocation || "?"} → {trip.endLocation || "?"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{trip.distanceKm?.toFixed(1) || "0.0"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {driverTrips.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href={`/trips?driverId=${driverId}`}>Zobraziť všetky jazdy ({driverTrips.length})</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posledná aktivita</CardTitle>
              <CardDescription>História aktivít vodiča v systéme</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadna aktivita</div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="rounded-full bg-muted p-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.date), "dd.MM.yyyy HH:mm", { locale: sk })}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type === "trip" && "Jazda"}
                          {activity.type === "refueling" && "Tankovanie"}
                          {activity.type === "maintenance" && "Servis"}
                          {activity.type === "odometer" && "Fotka"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
