"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Wrench, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { MOCK_MAINTENANCE_RECORDS, MOCK_SCHEDULED_MAINTENANCE, MOCK_VEHICLES } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MaintenancePage() {
  const [search, setSearch] = useState("")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")

  const filteredRecords = MOCK_MAINTENANCE_RECORDS.filter((record) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === record.vehicleId)

    const matchesSearch =
      vehicle?.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      record.description.toLowerCase().includes(search.toLowerCase()) ||
      record.serviceProvider?.toLowerCase().includes(search.toLowerCase())

    const matchesVehicle = vehicleFilter === "all" || record.vehicleId === vehicleFilter

    return matchesSearch && matchesVehicle
  })

  const filteredScheduled = MOCK_SCHEDULED_MAINTENANCE.filter((item) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === item.vehicleId)
    const matchesSearch =
      vehicle?.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesVehicle = vehicleFilter === "all" || item.vehicleId === vehicleFilter
    return matchesSearch && matchesVehicle
  })

  const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost, 0)
  const pendingTasks = filteredScheduled.filter((s) => s.status === "pending").length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servisná prevádzka</h1>
          <p className="text-muted-foreground">Správa servisných úkonov a plánovanej údržby</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Plánovať servis
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Pridať záznam
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové náklady</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počet záznamov</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRecords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Čakajúce úkony</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
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
                placeholder="Hľadať podľa EČV, popisu, servisu..."
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
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Plánované úkony</TabsTrigger>
          <TabsTrigger value="history">História servisu</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Plánované servisné úkony</CardTitle>
              <CardDescription>{filteredScheduled.length} úkonov</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredScheduled.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne plánované úkony</div>
              ) : (
                <div className="space-y-3">
                  {filteredScheduled.map((item) => {
                    const vehicle = MOCK_VEHICLES.find((v) => v.id === item.vehicleId)
                    return (
                      <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{vehicle?.registrationNo}</Badge>
                            <div className="font-medium">{item.description}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Termín: {format(new Date(item.dueDate), "dd.MM.yyyy", { locale: sk })}
                            {item.dueOdometerKm && ` • ${item.dueOdometerKm.toLocaleString()} km`}
                            {item.reminderDays && ` • Pripomienka ${item.reminderDays} dní vopred`}
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
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>História servisu a opráv</CardTitle>
              <CardDescription>{filteredRecords.length} záznamov</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Žiadne záznamy</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Vozidlo</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead>Servis</TableHead>
                        <TableHead className="text-right">Km</TableHead>
                        <TableHead className="text-right">Cena</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => {
                        const vehicle = MOCK_VEHICLES.find((v) => v.id === record.vehicleId)
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{format(new Date(record.date), "dd.MM.yyyy", { locale: sk })}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{vehicle?.registrationNo}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {record.type === "service" && "Servis"}
                                {record.type === "inspection" && "Kontrola"}
                                {record.type === "repair" && "Oprava"}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.serviceProvider || "-"}
                            </TableCell>
                            <TableCell className="text-right">{record.odometerKm.toLocaleString()} km</TableCell>
                            <TableCell className="text-right font-medium">€{record.cost.toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
