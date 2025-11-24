"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, FileText, Lock, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getVatReports,
  getVatReportById,
  lockVatReport,
  generateVatReportPdf,
  createVatReport,
} from "@/lib/api/vat-reports"
import type { VatReport } from "@/lib/types"
import { format } from "date-fns"
import { sk } from "date-fns/locale"

export default function VatReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [selectedReport, setSelectedReport] = useState<VatReport | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newReportPeriod, setNewReportPeriod] = useState("")
  const [newReportVehicle, setNewReportVehicle] = useState("all")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["vat-reports", selectedYear, selectedVehicle],
    queryFn: () => getVatReports({ year: selectedYear, vehicleId: selectedVehicle }),
  })

  const lockMutation = useMutation({
    mutationFn: lockVatReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vat-reports"] })
      toast({ title: "DPH výkaz uzamknutý" })
      setDetailOpen(false)
    },
  })

  const generatePdfMutation = useMutation({
    mutationFn: generateVatReportPdf,
    onSuccess: (pdfUrl) => {
      queryClient.invalidateQueries({ queryKey: ["vat-reports"] })
      toast({ title: "PDF vygenerované", description: "Výkaz bol úspešne exportovaný" })
      // Simulate download
      window.open(pdfUrl, "_blank")
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { period: string; vehicleId: string | null }) => {
      // Calculate mock data for the new report
      const mockReportData = {
        period: data.period,
        vehicleId: data.vehicleId,
        businessKm: 1200,
        privateKm: 300,
        totalKm: 1500,
        startOdometer: 45000,
        endOdometer: 46500,
        tripCount: 24,
        fuelCosts: 180.5,
        maintenanceCosts: 0,
        tollCosts: 15.2,
        status: "generated" as const,
        generatedAt: new Date().toISOString(),
        generatedBy: "Admin",
      }
      return createVatReport(mockReportData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vat-reports"] })
      toast({ title: "DPH výkaz vytvorený", description: "Výkaz bol úspešne vygenerovaný" })
      setCreateOpen(false)
      setNewReportPeriod("")
      setNewReportVehicle("all")
    },
  })

  const handleViewDetail = async (reportId: string) => {
    const report = await getVatReportById(reportId)
    setSelectedReport(report)
    setDetailOpen(true)
  }

  const handleCreateReport = () => {
    if (!newReportPeriod) {
      toast({ title: "Chyba", description: "Vyberte obdobie", variant: "destructive" })
      return
    }
    createMutation.mutate({
      period: newReportPeriod,
      vehicleId: newReportVehicle === "all" ? null : newReportVehicle,
    })
  }

  const getStatusBadge = (status: VatReport["status"]) => {
    const variants = {
      draft: { variant: "secondary" as const, label: "Koncept" },
      generated: { variant: "default" as const, label: "Vygenerovaný" },
      locked: { variant: "outline" as const, label: "Uzamknutý" },
    }
    const { variant, label } = variants[status]
    return <Badge variant={variant}>{label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">DPH výkazy</h1>
        </div>
        <div className="text-muted-foreground">Načítavam...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">DPH výkazy</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Vytvoriť výkaz
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Rok</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Vozidlo</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky vozidlá</SelectItem>
                <SelectItem value="1">BA 123 CD</SelectItem>
                <SelectItem value="2">BA 456 EF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Obdobie</TableHead>
              <TableHead>Vozidlo</TableHead>
              <TableHead className="text-right">Služobné km</TableHead>
              <TableHead className="text-right">Súkromné km</TableHead>
              <TableHead className="text-right">Celkom km</TableHead>
              <TableHead className="text-right">% služobné</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => {
              const businessPercentage = (report.businessKm / report.totalKm) * 100
              return (
                <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{report.period}</TableCell>
                  <TableCell>{report.vehicleId ? `Vozidlo ${report.vehicleId}` : "Všetky"}</TableCell>
                  <TableCell className="text-right">{report.businessKm.toFixed(0)} km</TableCell>
                  <TableCell className="text-right">{report.privateKm.toFixed(0)} km</TableCell>
                  <TableCell className="text-right">{report.totalKm.toFixed(0)} km</TableCell>
                  <TableCell className="text-right font-semibold">{businessPercentage.toFixed(1)}%</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetail(report.id)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => generatePdfMutation.mutate(report.id)}
                        disabled={generatePdfMutation.isPending}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {report.status !== "locked" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => lockMutation.mutate(report.id)}
                          disabled={lockMutation.isPending}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vytvoriť nový DPH výkaz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Obdobie</label>
              <Select value={newReportPeriod} onValueChange={setNewReportPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte obdobie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Január 2024</SelectItem>
                  <SelectItem value="2024-02">Február 2024</SelectItem>
                  <SelectItem value="2024-03">Marec 2024</SelectItem>
                  <SelectItem value="2024-04">Apríl 2024</SelectItem>
                  <SelectItem value="2024-05">Máj 2024</SelectItem>
                  <SelectItem value="2024-06">Jún 2024</SelectItem>
                  <SelectItem value="2024-07">Júl 2024</SelectItem>
                  <SelectItem value="2024-08">August 2024</SelectItem>
                  <SelectItem value="2024-09">September 2024</SelectItem>
                  <SelectItem value="2024-10">Október 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Vozidlo</label>
              <Select value={newReportVehicle} onValueChange={setNewReportVehicle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky vozidlá</SelectItem>
                  <SelectItem value="1">BA 123 CD</SelectItem>
                  <SelectItem value="2">BA 456 EF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateReport} disabled={createMutation.isPending} className="flex-1">
                {createMutation.isPending ? "Vytváram..." : "Vytvoriť"}
              </Button>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Zrušiť
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail DPH výkazu - {selectedReport?.period}</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Celkom km</div>
                  <div className="text-2xl font-bold">{selectedReport.totalKm.toFixed(0)}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Služobné km</div>
                  <div className="text-2xl font-bold text-green-600">{selectedReport.businessKm.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((selectedReport.businessKm / selectedReport.totalKm) * 100).toFixed(1)}%
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Súkromné km</div>
                  <div className="text-2xl font-bold text-orange-600">{selectedReport.privateKm.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((selectedReport.privateKm / selectedReport.totalKm) * 100).toFixed(1)}%
                  </div>
                </Card>
              </div>

              {/* Odometer Info */}
              <Card className="p-4">
                <h3 className="mb-3 font-semibold">Stav tachometra</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Začiatok obdobia</div>
                    <div className="text-lg font-semibold">{selectedReport.startOdometer.toLocaleString()} km</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Koniec obdobia</div>
                    <div className="text-lg font-semibold">{selectedReport.endOdometer.toLocaleString()} km</div>
                  </div>
                </div>
              </Card>

              {/* Trips Info */}
              <Card className="p-4">
                <h3 className="mb-3 font-semibold">Jazdy</h3>
                <div className="text-sm text-muted-foreground">Počet jázd v období</div>
                <div className="text-lg font-semibold">{selectedReport.tripCount}</div>
              </Card>

              {/* Costs */}
              <Card className="p-4">
                <h3 className="mb-3 font-semibold">Prehľad nákladov</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Palivo (PHM)</span>
                    <span className="font-semibold">{selectedReport.fuelCosts.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servis a údržba</span>
                    <span className="font-semibold">{selectedReport.maintenanceCosts.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diaľnice</span>
                    <span className="font-semibold">{selectedReport.tollCosts.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Celkom</span>
                    <span className="font-bold">
                      {(selectedReport.fuelCosts + selectedReport.maintenanceCosts + selectedReport.tollCosts).toFixed(
                        2,
                      )}{" "}
                      €
                    </span>
                  </div>
                </div>
              </Card>

              {/* Meta info */}
              {selectedReport.generatedAt && (
                <Card className="p-4">
                  <h3 className="mb-3 font-semibold">Informácie</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vygenerované</span>
                      <span>
                        {format(new Date(selectedReport.generatedAt), "dd.MM.yyyy HH:mm", { locale: sk })} -{" "}
                        {selectedReport.generatedBy}
                      </span>
                    </div>
                    {selectedReport.lockedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uzamknuté</span>
                        <span>
                          {format(new Date(selectedReport.lockedAt), "dd.MM.yyyy HH:mm", { locale: sk })} -{" "}
                          {selectedReport.lockedBy}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span>{getStatusBadge(selectedReport.status)}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={() => generatePdfMutation.mutate(selectedReport.id)} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Vygenerovať PDF
                </Button>
                {selectedReport.status !== "locked" && (
                  <Button onClick={() => lockMutation.mutate(selectedReport.id)} variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    Uzamknúť
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
