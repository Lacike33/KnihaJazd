"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles, deleteVehicle } from "@/lib/api/vehicles";
import { getTrips } from "@/lib/api/trips";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VehicleFormDialog } from "@/features/vehicles/vehicle-form-dialog";
import { Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { RequireRole } from "@/features/login/components/require-role";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { VehicleUsageBadge } from "@/features/vehicles/vehicle-usage-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: "Vozidlo bolo zmazané",
        description: "Vozidlo bolo úspešne odstránené zo systému",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa zmazať vozidlo",
        variant: "destructive",
      });
    },
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) || vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive = activeFilter === "all" || (activeFilter === "active" && vehicle.active !== false) || (activeFilter === "inactive" && vehicle.active === false);

    return matchesSearch && matchesActive;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vozidlá</h1>
          <p className="text-muted-foreground">Správa vozidiel v systéme</p>
        </div>
        <RequireRole roles={["admin", "accountant"]}>
          <VehicleFormDialog trigger={<Button data-mission-target="add-vehicle-button">Pridať vozidlo</Button>} />
        </RequireRole>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam vozidiel</CardTitle>
          <CardDescription>Prehľad všetkých vozidiel vo vašej spoločnosti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Hľadať podľa EČV, značky alebo modelu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky vozidlá</SelectItem>
                <SelectItem value="active">Aktívne</SelectItem>
                <SelectItem value="inactive">Neaktívne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Načítavam vozidlá...</div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{searchTerm || activeFilter !== "all" ? "Žiadne vozidlá nenájdené" : "Zatiaľ nemáte žiadne vozidlá"}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EČV</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Typ / Využitie</TableHead>
                    <TableHead>Značka</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Rok</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead className="text-right">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => {
                    const vehicleTrips = trips.filter((trip) => trip.vehicleId === vehicle.id);
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">
                          <Link href={`/vehicles/${vehicle.id}`} className="hover:underline">
                            {vehicle.registrationNo}
                          </Link>
                        </TableCell>
                        <TableCell>{vehicle.active === false ? <Badge variant="secondary">Neaktívne</Badge> : <Badge variant="default">Aktívne</Badge>}</TableCell>
                        <TableCell>
                          <VehicleUsageBadge ownershipType={vehicle.ownershipType} trips={vehicleTrips} />
                        </TableCell>
                        <TableCell>{vehicle.brand || "-"}</TableCell>
                        <TableCell>{vehicle.model || "-"}</TableCell>
                        <TableCell>{vehicle.year || "-"}</TableCell>
                        <TableCell className="font-mono text-xs">{vehicle.vin || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <RequireRole roles={["admin", "accountant"]}>
                              <VehicleFormDialog
                                vehicle={vehicle}
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            </RequireRole>
                            <RequireRole roles={["admin"]}>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Zmazať vozidlo?</AlertDialogTitle>
                                    <AlertDialogDescription>Naozaj chcete zmazať vozidlo {vehicle.registrationNo}? Táto akcia sa nedá vrátiť späť.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteMutation.mutate(vehicle.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Zmazať
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </RequireRole>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
