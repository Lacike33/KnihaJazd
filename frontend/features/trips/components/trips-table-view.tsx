"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TripSourceBadge } from "@/features/trips/components/trip-source-badge";
import { TripTypeBadge } from "@/features/trips/components/trip-type-badge";
import { Lock, Trash2, MoreHorizontal, Copy, FileText, LockOpen, Calendar, Repeat } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { RequireRole } from "@/features/login/components/require-role"
import type { Trip, Vehicle, Driver, VatReport } from "@/lib/types"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TripsTableViewProps {
  trips: Trip[]
  vehicles: Vehicle[]
  drivers: Driver[]
  vatReports: VatReport[]
  isLoading: boolean
  selectedTripIds: string[]
  onToggleSelection: (tripId: string) => void
  onSelectAll: () => void
  onDelete: (tripId: string) => void
  onDuplicate: (trip: Trip) => void
  onAddToVatReport: (reportId?: string) => void
}

export function TripsTableView({
  trips,
  vehicles,
  drivers,
  vatReports,
  isLoading,
  selectedTripIds,
  onToggleSelection,
  onSelectAll,
  onDelete,
  onDuplicate,
  onAddToVatReport,
}: TripsTableViewProps) {
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string>()
  const [newReportName, setNewReportName] = useState("")

  const getVehicleRegistration = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    return vehicle?.registrationNo || "N/A"
  }

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "-"
    const driver = drivers.find((d) => d.id === driverId)
    return driver?.name || "N/A"
  }

  const getVatReport = (vatReportId?: string) => {
    if (!vatReportId) return null
    return vatReports.find((r) => r.id === vatReportId)
  }

  const unlockedReports = vatReports.filter((r) => r.status !== "locked")

  const handleBulkSubmit = () => {
    onAddToVatReport(selectedReportId === "new" ? undefined : selectedReportId)
    setBulkDialogOpen(false)
    setSelectedReportId(undefined)
    setNewReportName("")
  }

  const selectedTrips = trips.filter((t) => selectedTripIds.includes(t.id))
  const hasLockedTrips = selectedTrips.some((t) => t.locked)
  const hasUnlockedTrips = selectedTrips.some((t) => !t.locked)
  const allLocked = selectedTrips.length > 0 && selectedTrips.every((t) => t.locked)

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
              <div className="flex items-center gap-2">
                {hasUnlockedTrips && (
                  <RequireRole roles={["admin", "accountant"]}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Bulk lock action will be handled by parent component
                        console.log("[v0] Bulk lock trips:", selectedTripIds)
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
                      onClick={() => {
                        // Bulk unlock action will be handled by parent component
                        console.log("[v0] Bulk unlock trips:", selectedTripIds)
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
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Pridať do uzávierky
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pridať jazdy do uzávierky</DialogTitle>
                        <DialogDescription>
                          Vybrané jazdy budú uzamknuté a pridané do vybranej uzávierky
                        </DialogDescription>
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
                                  {report.vehicleId &&
                                    ` - ${vehicles.find((v) => v.id === report.vehicleId)?.registrationNo || ""}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedReportId === "new" && (
                          <div className="space-y-2">
                            <Label>Názov novej uzávierky</Label>
                            <Input
                              placeholder="napr. DPH 01/2025"
                              value={newReportName}
                              onChange={(e) => setNewReportName(e.target.value)}
                            />
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
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Vymazať
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Vymazať vybraté jazdy?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Naozaj chcete zmazať {selectedTripIds.length}{" "}
                            {selectedTripIds.length === 1 ? "jazdu" : "jazdy"}? Táto akcia sa nedá vrátiť späť.
                            {allLocked && " Niektoré jazdy sú uzamknuté a nemôžu byť zmazané."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // Bulk delete action will be handled by parent component
                              console.log("[v0] Bulk delete trips:", selectedTripIds)
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

      <Card>
        <CardHeader>
          <CardTitle>Jazdy</CardTitle>
          <CardDescription>
            Celkovo {trips.length} {trips.length === 1 ? "jazda" : trips.length < 5 ? "jazdy" : "jázd"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Načítavam jazdy...</div>
          ) : trips.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Žiadne jazdy</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTripIds.length === trips.length && trips.length > 0}
                        onCheckedChange={onSelectAll}
                      />
                    </TableHead>
                    <TableHead>Dátum začiatku</TableHead>
                    <TableHead>Vozidlo</TableHead>
                    <TableHead>Vodič</TableHead>
                    <TableHead>Trasa</TableHead>
                    <TableHead className="text-right">Km</TableHead>
                    <TableHead className="text-right">Tachometer</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Zdroj</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedTripIds.includes(trip.id)}
                          onCheckedChange={() => onToggleSelection(trip.id)}
                          disabled={trip.locked}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/trips/${trip.id}`} className="hover:underline">
                          {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm", { locale: sk })}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{getVehicleRegistration(trip.vehicleId)}</TableCell>
                      <TableCell>{getDriverName(trip.driverId)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {trip.startLocation && trip.endLocation ? `${trip.startLocation} → ${trip.endLocation}` : "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {trip.distanceKm != null ? trip.distanceKm.toFixed(1) : "0.0"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {trip.endOdometer ? trip.endOdometer.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <TripTypeBadge type={trip.type} />
                      </TableCell>
                      <TableCell>
                        <TripSourceBadge source={trip.source} />
                      </TableCell>
                      <TableCell>
                        {trip.locked && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span className="text-xs">Uzamknuté</span>
                          </div>
                        )}
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
                        {trip.vatReportId && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/reports/vat/${trip.vatReportId}`}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="text-xs">V uzávierke</span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {getVatReport(trip.vatReportId)?.period || "Uzávierka"} -{" "}
                                  {getVatReport(trip.vatReportId)?.vehicleId
                                    ? getVehicleRegistration(getVatReport(trip.vatReportId)!.vehicleId!)
                                    : "Všetky vozidlá"}
                                </p>
                                <p className="text-xs text-muted-foreground">Kliknite pre detail uzávierky</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
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
                            <RequireRole roles={["admin"]}>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    <span className="text-destructive">Zmazať</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Zmazať jazdu?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Naozaj chcete zmazať túto jazdu? Táto akcia sa nedá vrátiť späť.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDelete(trip.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Zmazať
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </RequireRole>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
