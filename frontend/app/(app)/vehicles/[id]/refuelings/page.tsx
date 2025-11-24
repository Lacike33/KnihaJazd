"use client"

import { useQuery } from "@tanstack/react-query"
import { getRefuelings } from "@/lib/api/refuelings"
import { getVehicle } from "@/lib/api/vehicles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function VehicleRefuelingsPage({ params }: { params: { id: string } }) {
  const { data: vehicle } = useQuery({
    queryKey: ["vehicles", params.id],
    queryFn: () => getVehicle(params.id),
  })

  const { data: refuelings = [], isLoading } = useQuery({
    queryKey: ["refuelings", params.id],
    queryFn: () => getRefuelings(params.id),
  })

  if (isLoading) return <div className="p-6">Načítavam...</div>

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: "Vozidlá", href: "/vehicles" },
          { label: vehicle?.registrationNo || params.id, href: `/vehicles/${params.id}` },
          { label: "Tankovania" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tankovania</h1>
          <p className="text-muted-foreground">{vehicle?.registrationNo}</p>
        </div>
        <Button asChild>
          <Link href={`/vehicles/${params.id}/refuelings/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať tankovanie
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>História tankovaní</CardTitle>
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
                    <TableHead>Litre</TableHead>
                    <TableHead>Cena/L</TableHead>
                    <TableHead>Celkom</TableHead>
                    <TableHead>Tachometer</TableHead>
                    <TableHead>Miesto</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refuelings.map((refueling) => (
                    <TableRow key={refueling.id}>
                      <TableCell>{format(new Date(refueling.date), "dd.MM.yyyy HH:mm", { locale: sk })}</TableCell>
                      <TableCell>{refueling.liters.toFixed(2)} L</TableCell>
                      <TableCell>€{refueling.pricePerLiter.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">€{refueling.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{refueling.odometerKm.toLocaleString()} km</TableCell>
                      <TableCell className="max-w-xs truncate">{refueling.location || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/vehicles/${params.id}/refuelings/${refueling.id}`}>Detail</Link>
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
