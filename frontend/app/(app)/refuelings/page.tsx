"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Fuel } from "lucide-react"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { MOCK_REFUELINGS, MOCK_VEHICLES, MOCK_DRIVERS } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export default function RefuelingsPage() {
  const [search, setSearch] = useState("")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")
  const [driverFilter, setDriverFilter] = useState<string>("all")

  const filteredRefuelings = MOCK_REFUELINGS.filter((refuel) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === refuel.vehicleId)
    const driver = MOCK_DRIVERS.find((d) => d.id === refuel.driverId)

    const matchesSearch =
      vehicle?.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      refuel.location?.toLowerCase().includes(search.toLowerCase()) ||
      refuel.invoiceNumber?.toLowerCase().includes(search.toLowerCase())

    const matchesVehicle = vehicleFilter === "all" || refuel.vehicleId === vehicleFilter
    const matchesDriver = driverFilter === "all" || refuel.driverId === driverFilter

    return matchesSearch && matchesVehicle && matchesDriver
  })

  const totalFuel = filteredRefuelings.reduce((sum, r) => sum + r.liters, 0)
  const totalCost = filteredRefuelings.reduce((sum, r) => sum + r.totalPrice, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tankovania</h1>
          <p className="text-muted-foreground">Prehľad tankovania pre všetky vozidlá</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Pridať tankovanie
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počet tankovania</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRefuelings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové litre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuel.toFixed(2)} L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové náklady</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrovanie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Hľadať podľa EČV, miesta, faktúry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Všetky vozidlá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky vozidlá</SelectItem>
                {MOCK_VEHICLES.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.registrationNo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={driverFilter} onValueChange={setDriverFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Všetci vodiči" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetci vodiči</SelectItem>
                {MOCK_DRIVERS.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>História tankovania</CardTitle>
          <CardDescription>{filteredRefuelings.length} záznamov</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRefuelings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Žiadne tankovania</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dátum</TableHead>
                    <TableHead>Vozidlo</TableHead>
                    <TableHead>Vodič</TableHead>
                    <TableHead>Miesto</TableHead>
                    <TableHead className="text-right">Litre</TableHead>
                    <TableHead className="text-right">Cena/L</TableHead>
                    <TableHead className="text-right">Spolu</TableHead>
                    <TableHead className="text-right">Km</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefuelings.map((refuel) => {
                    const vehicle = MOCK_VEHICLES.find((v) => v.id === refuel.vehicleId)
                    const driver = MOCK_DRIVERS.find((d) => d.id === refuel.driverId)
                    return (
                      <TableRow key={refuel.id}>
                        <TableCell>{format(new Date(refuel.date), "dd.MM.yyyy HH:mm", { locale: sk })}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vehicle?.registrationNo}</Badge>
                        </TableCell>
                        <TableCell>{driver?.name || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{refuel.location || "-"}</TableCell>
                        <TableCell className="text-right">{refuel.liters.toFixed(2)} L</TableCell>
                        <TableCell className="text-right">€{refuel.pricePerLiter.toFixed(3)}</TableCell>
                        <TableCell className="text-right font-medium">€{refuel.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{refuel.odometerKm.toLocaleString()} km</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
