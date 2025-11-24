"use client"

import { useQuery } from "@tanstack/react-query"
import { getMaintenanceRecords } from "@/lib/api/maintenance"
import { getVehicle } from "@/lib/api/vehicles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"

export default function VehicleMaintenancePage({ params }: { params: { id: string } }) {
  const { data: vehicle } = useQuery({
    queryKey: ["vehicles", params.id],
    queryFn: () => getVehicle(params.id),
  })

  const { data: maintenanceRecords = [], isLoading } = useQuery({
    queryKey: ["maintenance", params.id],
    queryFn: () => getMaintenanceRecords(params.id),
  })

  if (isLoading) return <div className="p-6">Načítavam...</div>

  const typeLabels = {
    repair: "Oprava",
    inspection: "Kontrola",
    service: "Servis",
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: vehicle?.registrationNo || params.id, href: `/vehicles/${params.id}` },
          { label: "Servisná prevádzka" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servisná prevádzka</h1>
          <p className="text-muted-foreground">{vehicle?.registrationNo}</p>
        </div>
        <Button asChild>
          <Link href={`/vehicles/${params.id}/maintenance/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať záznam
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>História servisu a opráv</CardTitle>
          <CardDescription>Všetky servisné záznamy pre toto vozidlo</CardDescription>
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
                    <TableHead>Tachometer</TableHead>
                    <TableHead className="text-right">Cena</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "dd.MM.yyyy", { locale: sk })}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{typeLabels[record.type]}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                      <TableCell>{record.odometerKm.toLocaleString()} km</TableCell>
                      <TableCell className="text-right font-medium">€{record.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/vehicles/${params.id}/maintenance/${record.id}`}>Detail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
