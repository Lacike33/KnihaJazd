"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGpsDevices, deleteGpsDevice } from "@/lib/api/gps-devices";
import { getVehicles } from "@/lib/api/vehicles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GpsDeviceFormDialog } from "@/features/gps/gps-device-form-dialog";
import { Edit, Satellite, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { RequireRole } from "@/features/login/components/require-role";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function GpsDevicesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ["gps-devices"],
    queryFn: getGpsDevices,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const getVehicleInfo = (vehicleId?: string) => {
    if (!vehicleId) return "-";
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.registrationNo}` : "N/A";
  };

  const deleteMutation = useMutation({
    mutationFn: deleteGpsDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gps-devices"] });
      toast({
        title: "GPS zariadenie bolo zmazané",
        description: "GPS zariadenie bolo úspešne odstránené zo systému",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa zmazať GPS zariadenie",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GPS zariadenia</h1>
          <p className="text-muted-foreground">Správa GPS zariadení a priradenie k vozidlám</p>
        </div>
        <RequireRole roles={["admin", "accountant"]}>
          <GpsDeviceFormDialog />
        </RequireRole>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam GPS zariadení</CardTitle>
          <CardDescription>Prehľad všetkých GPS zariadení v systéme</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Načítavam GPS zariadenia...</div>
          ) : devices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Zatiaľ nemáte žiadne GPS zariadenia</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sériové číslo</TableHead>
                    <TableHead>Priradené vozidlo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vytvorené</TableHead>
                    <TableHead className="text-right">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Satellite className="h-4 w-4 text-muted-foreground" />
                          {device.serialNumber}
                        </div>
                      </TableCell>
                      <TableCell>{getVehicleInfo(device.vehicleId)}</TableCell>
                      <TableCell>
                        {device.isActive ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Aktívne
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Neaktívne</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{device.createdAt ? format(new Date(device.createdAt), "dd.MM.yyyy", { locale: sk }) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <RequireRole roles={["admin", "accountant"]}>
                            <GpsDeviceFormDialog
                              device={device}
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
                                  <AlertDialogTitle>Zmazať GPS zariadenie?</AlertDialogTitle>
                                  <AlertDialogDescription>Naozaj chcete zmazať GPS zariadenie {device.serialNumber}? Táto akcia sa nedá vrátiť späť.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(device.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
