"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDrivers, deleteDriver } from "@/lib/api/drivers";
import { getTrips } from "@/lib/api/trips";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DriverFormDialog } from "@/features/drivers/driver-form-dialog";
import { RoleBadge } from "@/features/drivers/role-badge";
import { Edit, Users, Trash2 } from "lucide-react";
import { RequireRole } from "@/features/login/components/require-role";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function DriversPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast({
        title: "Vodič bol zmazaný",
        description: "Vodič bol úspešne odstránený zo systému",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa zmazať vodiča",
        variant: "destructive",
      });
    },
  });

  const getDriverTripsCount = (driverId: string) => {
    return trips.filter((trip) => trip.driverId === driverId).length;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vodiči</h1>
          <p className="text-muted-foreground">Správa vodičov v systéme</p>
        </div>
        <RequireRole roles={["admin", "accountant"]}>
          <DriverFormDialog />
        </RequireRole>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam vodičov</CardTitle>
          <CardDescription>Prehľad všetkých vodičov vo vašej spoločnosti</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Načítavam vodičov...</div>
          ) : drivers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Zatiaľ nemáte žiadnych vodičov</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meno</TableHead>
                    <TableHead>Rola</TableHead>
                    <TableHead>ID používateľa</TableHead>
                    <TableHead className="text-right">Počet jázd</TableHead>
                    <TableHead className="text-right">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">
                        <Link href={`/drivers/${driver.id}`} className="flex items-center gap-2 hover:underline">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {driver.name}
                        </Link>
                      </TableCell>
                      <TableCell>{driver.role ? <RoleBadge role={driver.role} /> : <span className="text-muted-foreground text-sm">-</span>}</TableCell>
                      <TableCell className="font-mono text-xs">{driver.userId || "-"}</TableCell>
                      <TableCell className="text-right">{getDriverTripsCount(driver.id)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <RequireRole roles={["admin", "accountant"]}>
                            <DriverFormDialog
                              driver={driver}
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
                                  <AlertDialogTitle>Zmazať vodiča?</AlertDialogTitle>
                                  <AlertDialogDescription>Naozaj chcete zmazať vodiča {driver.name}? Táto akcia sa nedá vrátiť späť.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(driver.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Zmazať
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </RequireRole>
                        </div>
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
  );
}
