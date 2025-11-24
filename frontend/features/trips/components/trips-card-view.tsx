"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Trash2, MoreHorizontal, Copy, Car, User, MapPin, FileText, LockOpen, Calendar, Repeat } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { TripSourceBadge } from "@/features/trips/components/trip-source-badge";
import { TripTypeBadge } from "@/features/trips/components/trip-type-badge";
import type { Trip, Vehicle, Driver, VatReport } from "@/lib/types";
import { useState } from "react";
import { RequireRole } from "@/features/login/components/require-role";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TripsCardViewProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  vatReports: VatReport[];
  isLoading: boolean;
  selectedTripIds: string[];
  onToggleSelection: (tripId: string) => void;
  onSelectAll: () => void;
  onDelete: (tripId: string) => void;
  onDuplicate: (trip: Trip) => void;
  onAddToVatReport: (reportId?: string) => void;
}

export function TripsCardView({ trips, vehicles, drivers, vatReports, isLoading, selectedTripIds, onToggleSelection, onDelete, onDuplicate, onAddToVatReport }: TripsCardViewProps) {
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>();
  const [newReportName, setNewReportName] = useState("");

  const getVehicleRegistration = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle?.registrationNo || "N/A";
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "-";
    const driver = drivers.find((d) => d.id === driverId);
    return driver?.name || "N/A";
  };

  const getVatReport = (vatReportId?: string) => {
    if (!vatReportId) return null;
    return vatReports.find((r) => r.id === vatReportId);
  };

  const unlockedReports = vatReports.filter((r) => r.status !== "locked");

  const handleBulkSubmit = () => {
    onAddToVatReport(selectedReportId === "new" ? undefined : selectedReportId);
    setBulkDialogOpen(false);
    setSelectedReportId(undefined);
    setNewReportName("");
  };

  const selectedTrips = trips.filter((t) => selectedTripIds.includes(t.id));
  const hasLockedTrips = selectedTrips.some((t) => t.locked);
  const hasUnlockedTrips = selectedTrips.some((t) => !t.locked);
  const allLocked = selectedTrips.length > 0 && selectedTrips.every((t) => t.locked);

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-8">Načítavam jazdy...</div>;
  }

  if (trips.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Žiadne jazdy</div>;
  }

  return (
    <>
      {selectedTripIds.length > 0 && (
        <Card className="mb-4 border-primary">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">
                    Vybraté {selectedTripIds.length} {selectedTripIds.length === 1 ? "jazda" : "jazdy"}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Vyberte hromadnú akciu pre označené jazdy</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hasUnlockedTrips && (
                  <RequireRole roles={["admin", "accountant"]}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("[v0] Bulk lock trips:", selectedTripIds);
                      }}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Zamknúť
                    </Button>
                  </RequireRole>
                )}

                {hasLockedTrips && (
                  <RequireRole roles={["admin"]}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("[v0] Bulk unlock trips:", selectedTripIds);
                      }}
                    >
                      <LockOpen className="mr-2 h-4 w-4" />
                      Odomknúť
                    </Button>
                  </RequireRole>
                )}

                {hasUnlockedTrips && (
                  <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Pridať do uzávierky
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pridať jazdy do uzávierky</DialogTitle>
                        <DialogDescription>Vybrané jazdy budú uzamknuté a pridané do vybranej uzávierky</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Vybrať uzávierku</Label>
                          <Select value={selectedReportId} onValueChange={setSelectedReportId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Vybrať existujúcu alebo vytvoriť novú" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">+ Vytvoriť novú uzávierku</SelectItem>
                              {unlockedReports.map((report) => (
                                <SelectItem key={report.id} value={report.id}>
                                  {report.period}
                                  {report.vehicleId && ` - ${vehicles.find((v) => v.id === report.vehicleId)?.registrationNo || ""}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedReportId === "new" && (
                          <div className="space-y-2">
                            <Label>Názov novej uzávierky</Label>
                            <Input placeholder="napr. DPH 01/2025" value={newReportName} onChange={(e) => setNewReportName(e.target.value)} />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
                          Zrušiť
                        </Button>
                        <Button onClick={handleBulkSubmit} disabled={!selectedReportId}>
                          Pridať
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {hasUnlockedTrips && (
                  <RequireRole roles={["admin"]}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Vymazať
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Vymazať vybraté jazdy?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Naozaj chcete zmazať {selectedTripIds.length} {selectedTripIds.length === 1 ? "jazdu" : "jazdy"}? Táto akcia sa nedá vrátiť späť.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              console.log("[v0] Bulk delete trips:", selectedTripIds);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Vymazať
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </RequireRole>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <Card key={trip.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Checkbox checked={selectedTripIds.includes(trip.id)} onCheckedChange={() => onToggleSelection(trip.id)} disabled={trip.locked} className="mt-1" />
                  <div>
                    <Link href={`/trips/${trip.id}`}>
                      <CardTitle className="text-base hover:underline">{format(new Date(trip.startTime), "dd.MM.yyyy", { locale: sk })}</CardTitle>
                    </Link>
                    <CardDescription className="text-xs">
                      {format(new Date(trip.startTime), "HH:mm", { locale: sk })} - {format(new Date(trip.endTime), "HH:mm", { locale: sk })}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/trips/${trip.id}`}>Detail</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(trip)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplikovať
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(trip.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Zmazať
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getVehicleRegistration(trip.vehicleId)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{getDriverName(trip.driverId)}</span>
              </div>
              {trip.startLocation && trip.endLocation && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">
                    {trip.startLocation} → {trip.endLocation}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="text-lg font-bold">{trip.distanceKm?.toFixed(1) || "0.0"} km</div>
                <div className="flex gap-2">
                  <TripTypeBadge type={trip.type} />
                  <TripSourceBadge source={trip.source} />
                </div>
              </div>
              {trip.endOdometer && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>Tachometer (koniec):</span>
                  <span className="font-medium">{trip.endOdometer.toLocaleString()} km</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {trip.source === "planned" && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Plánovaná
                  </Badge>
                )}
                {trip.source === "recurring" && (
                  <Badge variant="outline" className="text-xs">
                    <Repeat className="h-3 w-3 mr-1" />
                    Opakovaná
                  </Badge>
                )}
                {trip.locked && (
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Lock className="h-3 w-3" />
                    <span>Uzamknuté</span>
                  </div>
                )}
                {trip.vatReportId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/reports/vat/${trip.vatReportId}`} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs" onClick={(e) => e.stopPropagation()}>
                          <FileText className="h-3 w-3" />
                          <span>V uzávierke</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {getVatReport(trip.vatReportId)?.period || "Uzávierka"} - {getVatReport(trip.vatReportId)?.vehicleId ? getVehicleRegistration(getVatReport(trip.vatReportId)!.vehicleId!) : "Všetky vozidlá"}
                        </p>
                        <p className="text-xs text-muted-foreground">Kliknite pre detail uzávierky</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
