"use client"

import type React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getVehicle, updateVehicle } from "@/lib/api/vehicles"
import { getTrips } from "@/lib/api/trips"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Car, Upload, FileText, Shield, Camera, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { TripSourceBadge } from "@/components/trips/trip-source-badge"
import { TripTypeBadge } from "@/components/trips/trip-type-badge"
import { VehicleFormDialog } from "@/components/vehicles/vehicle-form-dialog"
import { RequireRole } from "@/components/auth/require-role"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import {
  MOCK_ODOMETER_READINGS,
  MOCK_REFUELINGS,
  MOCK_MAINTENANCE_RECORDS,
  MOCK_SCHEDULED_MAINTENANCE,
  MOCK_VEHICLE_DOCUMENTS,
} from "@/lib/mock-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicles", params.id],
    queryFn: () => getVehicle(params.id),
  })

  const { data: trips = [] } = useQuery({
    queryKey: ["trips", "vehicle", params.id],
    queryFn: () => getTrips({ vehicle_id: params.id }),
    enabled: !!vehicle,
  })

  const [activeTab, setActiveTab] = useState("info")
  const [isEditingTechnical, setIsEditingTechnical] = useState(false)
  const [technicalData, setTechnicalData] = useState<any>({})
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (vehicle?.fuelConsumption) {
      setTechnicalData({
        fuelType: vehicle.fuelConsumption.fuelType,
        averageConsumption: vehicle.fuelConsumption.averageConsumption,
        cityConsumption: vehicle.fuelConsumption.cityConsumption || 0,
        highwayConsumption: vehicle.fuelConsumption.highwayConsumption || 0,
        combinedConsumption: vehicle.fuelConsumption.combinedConsumption || 0,
      })
    }
  }, [vehicle])

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", params.id] })
      setIsEditingTechnical(false)
      toast({
        title: "Úspech",
        description: "Zmeny boli uložené",
      })
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť zmeny",
        variant: "destructive",
      })
    },
  })

  const handleSaveTechnicalData = () => {
    updateVehicleMutation.mutate({
      id: params.id,
      data: {
        fuelConsumption: {
          fuelType: technicalData.fuelType,
          averageConsumption: technicalData.averageConsumption,
          cityConsumption: technicalData.cityConsumption,
          highwayConsumption: technicalData.highwayConsumption,
          combinedConsumption: technicalData.combinedConsumption,
        },
      },
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real app, upload to server/blob storage
    // For now, create a local URL
    const imageUrl = URL.createObjectURL(file)

    setIsUploadingImage(true)
    updateVehicleMutation.mutate(
      {
        id: params.id,
        data: { imageUrl },
      },
      {
        onSettled: () => setIsUploadingImage(false),
      },
    )
  }

  if (isLoading) return <div className="p-6">Načítavam...</div>
  if (!vehicle) return <div className="p-6">Vozidlo nebolo nájdené</div>

  const totalKm = trips.reduce((sum, trip) => sum + (trip.distanceKm || 0), 0)

  const odometerReadings = MOCK_ODOMETER_READINGS.filter((r) => r.vehicleId === params.id)
  const refuelings = MOCK_REFUELINGS.filter((r) => r.vehicleId === params.id)
  const maintenanceRecords = MOCK_MAINTENANCE_RECORDS.filter((m) => m.vehicleId === params.id)
  const scheduledMaintenance = MOCK_SCHEDULED_MAINTENANCE.filter((m) => m.vehicleId === params.id)
  const vehicleDocuments = MOCK_VEHICLE_DOCUMENTS.filter((d) => d.vehicleId === params.id)

  const chartData = odometerReadings.map((reading) => ({
    date: format(new Date(reading.date), "dd.MM", { locale: sk }),
    km: reading.odometerKm,
  }))

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={[{ label: "Vozidlá", href: "/vehicles" }, { label: vehicle.registrationNo }]} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/vehicles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{vehicle.registrationNo}</h1>
            {vehicle.active === false ? (
              <Badge variant="secondary">Neaktívne</Badge>
            ) : (
              <Badge variant="default">Aktívne</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {vehicle.brand} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
          </p>
        </div>
        <RequireRole roles={["admin", "accountant"]}>
          <VehicleFormDialog vehicle={vehicle} trigger={<Button>Upraviť</Button>} />
        </RequireRole>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počet jázd</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové km</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKm.toFixed(0)} km</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počiatočný stav</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicle.odoInitialKm?.toFixed(0) || 0} km</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informácie</TabsTrigger>
          <TabsTrigger value="trips">Jazdy</TabsTrigger>
          <TabsTrigger value="technical">Technické údaje</TabsTrigger>
          <TabsTrigger value="insurance">Poistenie</TabsTrigger>
          <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          <TabsTrigger value="odometer">Tachometer</TabsTrigger>
          <TabsTrigger value="refuelings">Tankovania</TabsTrigger>
          <TabsTrigger value="maintenance">Servisná prevádzka</TabsTrigger>
          <TabsTrigger value="automation">Nastavenia automatizácie</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fotografia vozidla</CardTitle>
                <RequireRole roles={["admin", "accountant"]}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {vehicle.imageUrl ? "Zmeniť fotku" : "Nahrať fotku"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </RequireRole>
              </div>
            </CardHeader>
            <CardContent>
              {vehicle.imageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={vehicle.imageUrl || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50">
                  <Camera className="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Žiadna fotografia vozidla</p>
                  <RequireRole roles={["admin", "accountant"]}>
                    <Button variant="link" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2">
                      Nahrať fotku
                    </Button>
                  </RequireRole>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailné informácie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">EČV</div>
                <div className="font-medium">{vehicle.registrationNo}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">VIN</div>
                <div className="font-mono text-sm">{vehicle.vin || "-"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Značka</div>
                  <div className="font-medium">{vehicle.brand || "-"}</div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Model</div>
                  <div className="font-medium">{vehicle.model || "-"}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Rok výroby</div>
                <div className="font-medium">{vehicle.year || "-"}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Dátum začatia evidencie</div>
                <div className="font-medium">
                  {vehicle.registrationDate
                    ? format(new Date(vehicle.registrationDate), "dd.MM.yyyy", { locale: sk })
                    : "-"}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Režim DPH</div>
                <div>
                  {vehicle.vatRegime === "100_business" && (
                    <Badge variant="default" className="bg-green-600">
                      100% business - Prísna evidencia
                    </Badge>
                  )}
                  {vehicle.vatRegime === "50_mixed" && <Badge variant="secondary">50% mix - Zmiešané použitie</Badge>}
                  {!vehicle.vatRegime && "-"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>História jázd</CardTitle>
              <CardDescription>Všetky jazdy tohto vozidla</CardDescription>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne jazdy</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Trasa</TableHead>
                        <TableHead className="text-right">Km</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Zdroj</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell>
                            <Link href={`/trips/${trip.id}`} className="hover:underline">
                              {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm", { locale: sk })}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {trip.startLocation && trip.endLocation
                              ? `${trip.startLocation} → ${trip.endLocation}`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {trip.distanceKm?.toFixed(1) || "0.0"}
                          </TableCell>
                          <TableCell>
                            <TripTypeBadge type={trip.type} />
                          </TableCell>
                          <TableCell>
                            <TripSourceBadge source={trip.source} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technické údaje a spotreba</CardTitle>
              <CardDescription>Parametre spotreby paliva pre toto vozidlo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditingTechnical ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fuelType">Typ paliva</Label>
                    <select
                      id="fuelType"
                      value={technicalData.fuelType}
                      onChange={(e) =>
                        setTechnicalData({
                          ...technicalData,
                          fuelType: e.target.value as any,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="petrol">Benzín</option>
                      <option value="diesel">Nafta</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Elektrické</option>
                      <option value="other">Iné</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="averageConsumption">
                        Priemerná spotreba ({technicalData.fuelType === "electric" ? "kWh/100km" : "l/100km"})
                      </Label>
                      <Input
                        id="averageConsumption"
                        type="number"
                        step="0.1"
                        value={technicalData.averageConsumption}
                        onChange={(e) =>
                          setTechnicalData({
                            ...technicalData,
                            averageConsumption: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cityConsumption">
                        Mesto ({technicalData.fuelType === "electric" ? "kWh/100km" : "l/100km"})
                      </Label>
                      <Input
                        id="cityConsumption"
                        type="number"
                        step="0.1"
                        value={technicalData.cityConsumption}
                        onChange={(e) =>
                          setTechnicalData({
                            ...technicalData,
                            cityConsumption: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="highwayConsumption">
                        Mimo mesta ({technicalData.fuelType === "electric" ? "kWh/100km" : "l/100km"})
                      </Label>
                      <Input
                        id="highwayConsumption"
                        type="number"
                        step="0.1"
                        value={technicalData.highwayConsumption}
                        onChange={(e) =>
                          setTechnicalData({
                            ...technicalData,
                            highwayConsumption: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="combinedConsumption">
                        Kombinovaná ({technicalData.fuelType === "electric" ? "kWh/100km" : "l/100km"})
                      </Label>
                      <Input
                        id="combinedConsumption"
                        type="number"
                        step="0.1"
                        value={technicalData.combinedConsumption}
                        onChange={(e) =>
                          setTechnicalData({
                            ...technicalData,
                            combinedConsumption: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveTechnicalData}>
                      <Save className="h-4 w-4 mr-2" />
                      Uložiť
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingTechnical(false)}>
                      Zrušiť
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {vehicle.fuelConsumption ? (
                    <>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Typ paliva</div>
                        <div className="font-medium">
                          {vehicle.fuelConsumption.fuelType === "petrol" && "Benzín"}
                          {vehicle.fuelConsumption.fuelType === "diesel" && "Nafta"}
                          {vehicle.fuelConsumption.fuelType === "hybrid" && "Hybrid"}
                          {vehicle.fuelConsumption.fuelType === "electric" && "Elektrické"}
                          {vehicle.fuelConsumption.fuelType === "other" && "Iné"}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-2">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Priemerná spotreba</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {vehicle.fuelConsumption.averageConsumption.toFixed(1)}{" "}
                              {vehicle.fuelConsumption.fuelType === "electric" ? "kWh/100km" : "l/100km"}
                            </div>
                          </CardContent>
                        </Card>

                        <div className="space-y-3">
                          {vehicle.fuelConsumption.cityConsumption && (
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <div className="text-sm text-muted-foreground">Mesto</div>
                              <div className="font-medium">
                                {vehicle.fuelConsumption.cityConsumption.toFixed(1)}{" "}
                                {vehicle.fuelConsumption.fuelType === "electric" ? "kWh/100km" : "l/100km"}
                              </div>
                            </div>
                          )}
                          {vehicle.fuelConsumption.highwayConsumption && (
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <div className="text-sm text-muted-foreground">Mimo mesta</div>
                              <div className="font-medium">
                                {vehicle.fuelConsumption.highwayConsumption.toFixed(1)}{" "}
                                {vehicle.fuelConsumption.fuelType === "electric" ? "kWh/100km" : "l/100km"}
                              </div>
                            </div>
                          )}
                          {vehicle.fuelConsumption.combinedConsumption && (
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <div className="text-sm text-muted-foreground">Kombinovaná</div>
                              <div className="font-medium">
                                {vehicle.fuelConsumption.combinedConsumption.toFixed(1)}{" "}
                                {vehicle.fuelConsumption.fuelType === "electric" ? "kWh/100km" : "l/100km"}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg bg-muted p-4">
                        <div className="text-sm text-muted-foreground">
                          Tieto údaje sa používajú pri výpočte odhadovanej spotreby na jazdu a kontrolných reportoch
                          (reálna vs. katalógová spotreba).
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Technické údaje o spotrebe nie sú zadané
                    </div>
                  )}

                  <RequireRole roles={["admin", "accountant"]}>
                    <Button variant="outline" onClick={() => setIsEditingTechnical(true)}>
                      Upraviť technické údaje
                    </Button>
                  </RequireRole>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Poistenie vozidla</CardTitle>
                <CardDescription>Informácie o poistení a poistných zmluvách</CardDescription>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
              {vehicle.insurance ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Druh poistenia</div>
                      <div className="font-medium">
                        {vehicle.insurance.type === "liability" && "Povinné zmluvné poistenie (PZP)"}
                        {vehicle.insurance.type === "comprehensive" && "Havarijné poistenie"}
                        {vehicle.insurance.type === "other" && "Iné"}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Číslo poistnej zmluvy</div>
                      <div className="font-mono text-sm">{vehicle.insurance.policyNumber}</div>
                    </div>

                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Poisťovňa</div>
                      <div className="font-medium">{vehicle.insurance.insuranceCompany}</div>
                    </div>

                    {vehicle.insurance.cost && (
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Ročná cena</div>
                        <div className="font-medium">€{vehicle.insurance.cost.toFixed(2)}</div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-2 border-green-200 dark:border-green-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Platnosť od</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">
                          {format(new Date(vehicle.insurance.validFrom), "dd.MM.yyyy", { locale: sk })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 dark:border-orange-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Platnosť do</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">
                          {format(new Date(vehicle.insurance.validTo), "dd.MM.yyyy", { locale: sk })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {vehicle.insurance.reminderDays && (
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900 dark:text-blue-100">Upozornenie</div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Systém začne upozorňovať {vehicle.insurance.reminderDays} dní pred koncom platnosti poistky
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {vehicle.insurance.notes && (
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Poznámky</div>
                      <div className="rounded-lg bg-muted p-3 text-sm">{vehicle.insurance.notes}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">Informácie o poistení nie sú zadané</div>
              )}

              <RequireRole roles={["admin", "accountant"]}>
                <Button variant="outline">Upraviť poistenie</Button>
              </RequireRole>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dokumenty vozidla</CardTitle>
                <CardDescription>Nahrané dokumenty, zmluvy a protokoly</CardDescription>
              </div>
              <RequireRole roles={["admin", "accountant"]}>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Nahrať dokument
                </Button>
              </RequireRole>
            </CardHeader>
            <CardContent>
              {vehicleDocuments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Žiadne dokumenty</p>
                  <p className="text-sm mt-2">Nahrajte technický preukaz, poistné zmluvy alebo servisné protokoly</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicleDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            <Badge variant="outline" className="mr-2">
                              {doc.type === "registration" && "Technický preukaz"}
                              {doc.type === "insurance" && "Poistenie"}
                              {doc.type === "lease" && "Leasing"}
                              {doc.type === "service" && "Servis"}
                              {doc.type === "other" && "Iné"}
                            </Badge>
                            {format(new Date(doc.uploadedAt), "dd.MM.yyyy", { locale: sk })} • {doc.uploadedBy}
                          </div>
                          {doc.notes && <div className="text-xs text-muted-foreground mt-1">{doc.notes}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Stiahnuť
                        </Button>
                        <RequireRole roles={["admin"]}>
                          <Button variant="ghost" size="sm">
                            Zmazať
                          </Button>
                        </RequireRole>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="odometer" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Stavy tachometra</h3>
            <Button asChild>
              <Link href={`/vehicles/${params.id}/odometer/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať stav
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Graf km / mesiac</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="km" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posledné stavy tachometra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {odometerReadings
                    .slice(-5)
                    .reverse()
                    .map((reading) => (
                      <div key={reading.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">{reading.odometerKm.toLocaleString()} km</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(reading.date), "dd.MM.yyyy HH:mm", { locale: sk })}
                          </div>
                        </div>
                        <Badge variant={reading.source === "photo" ? "default" : "secondary"}>
                          {reading.source === "manual" && "Manuálne"}
                          {reading.source === "gps" && "GPS"}
                          {reading.source === "photo" && "Fotka"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fotky tachometra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {odometerReadings
                  .filter((r) => r.photoUrl)
                  .map((reading) => (
                    <div key={reading.id} className="space-y-2">
                      <img
                        src={reading.photoUrl || "/placeholder.svg"}
                        alt="Tachometer"
                        className="rounded-lg border w-full object-cover h-48"
                      />
                      <div className="text-sm">
                        <div className="font-medium">{reading.odometerKm.toLocaleString()} km</div>
                        <div className="text-muted-foreground">
                          {format(new Date(reading.date), "dd.MM.yyyy HH:mm", { locale: sk })}
                        </div>
                        {reading.recordedBy && (
                          <div className="text-xs text-muted-foreground">Fotil: {reading.recordedBy}</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refuelings">
          <Card>
            <CardHeader>
              <CardTitle>História tankovania</CardTitle>
              <CardDescription>Všetky tankovania pre toto vozidlo</CardDescription>
            </CardHeader>
            <CardContent>
              {refuelings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne tankovania</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Miesto</TableHead>
                        <TableHead className="text-right">Litre</TableHead>
                        <TableHead className="text-right">Cena/L</TableHead>
                        <TableHead className="text-right">Spolu</TableHead>
                        <TableHead className="text-right">Km</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refuelings.map((refuel) => (
                        <TableRow key={refuel.id}>
                          <TableCell>{format(new Date(refuel.date), "dd.MM.yyyy HH:mm", { locale: sk })}</TableCell>
                          <TableCell>{refuel.location || "-"}</TableCell>
                          <TableCell className="text-right">{refuel.liters.toFixed(2)} L</TableCell>
                          <TableCell className="text-right">€{refuel.pricePerLiter.toFixed(3)}</TableCell>
                          <TableCell className="text-right font-medium">€{refuel.totalPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{refuel.odometerKm.toLocaleString()} km</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plánované servisné úkony</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledMaintenance.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne plánované úkony</div>
              ) : (
                <div className="space-y-3">
                  {scheduledMaintenance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex-1">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Termín: {format(new Date(item.dueDate), "dd.MM.yyyy", { locale: sk })}
                          {item.dueOdometerKm && ` • ${item.dueOdometerKm.toLocaleString()} km`}
                        </div>
                      </div>
                      <Badge
                        variant={
                          item.status === "pending"
                            ? "default"
                            : item.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {item.status === "pending" && "Čaká"}
                        {item.status === "completed" && "Hotovo"}
                        {item.status === "overdue" && "Po termíne"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>História servisu a opráv</CardTitle>
            </CardHeader>
            <CardContent>
              {maintenanceRecords.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne záznamy</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead className="text-right">Km</TableHead>
                        <TableHead className="text-right">Cena</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.date), "dd.MM.yyyy", { locale: sk })}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {record.type === "service" && "Servis"}
                              {record.type === "inspection" && "Kontrola"}
                              {record.type === "repair" && "Oprava"}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell className="text-right">{record.odometerKm.toLocaleString()} km</TableCell>
                          <TableCell className="text-right font-medium">€{record.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Nastavenia automatizácie</CardTitle>
              <CardDescription>Konfigurácia automatického importu a spracovania jázd</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Povoliť mobilný import</div>
                  <div className="text-sm text-muted-foreground">
                    Umožňuje automatické spracovanie fotografií tachometra
                  </div>
                </div>
                <Badge variant={vehicle.autoImportEnabled ? "default" : "secondary"}>
                  {vehicle.autoImportEnabled ? "Povolené" : "Zakázané"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Povoliť použitie šablón</div>
                  <div className="text-sm text-muted-foreground">Automatické priraďovanie predvolených účelov jázd</div>
                </div>
                <Badge variant={vehicle.templateUsageEnabled ? "default" : "secondary"}>
                  {vehicle.templateUsageEnabled ? "Povolené" : "Zakázané"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Tolerancia rozdielu km pri automatickom párovaní</div>
                <div className="text-sm text-muted-foreground">
                  Maximálny povolený rozdiel kilometrov medzi GPS údajmi a tachometrom
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{vehicle.kmMatchingTolerance || 0} km</div>
                  <Badge variant="outline">Tolerancia</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
