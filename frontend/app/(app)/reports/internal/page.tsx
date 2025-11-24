"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getInternalReports,
  createInternalReport,
  deleteInternalReport,
  exportInternalReport,
} from "@/lib/api/internal-reports"
import type { InternalReport } from "@/lib/types"

export default function InternalReportsPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "monthly" as InternalReport["type"],
    period: "",
    dateFrom: "",
    dateTo: "",
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["internal-reports", selectedType],
    queryFn: () => getInternalReports({ type: selectedType }),
  })

  const createMutation = useMutation({
    mutationFn: createInternalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-reports"] })
      setCreateDialogOpen(false)
      setFormData({ name: "", type: "monthly", period: "", dateFrom: "", dateTo: "" })
      toast({ title: "Report vytvorený", description: "Interný report bol úspešne vytvorený" })
    },
    onError: () => {
      toast({ title: "Chyba", description: "Nepodarilo sa vytvoriť report", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInternalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-reports"] })
      toast({ title: "Report zmazaný", description: "Interný report bol úspešne zmazaný" })
    },
  })

  const exportMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format: "csv" | "excel" | "pdf" }) => exportInternalReport(id, format),
    onSuccess: (data) => {
      toast({ title: "Export pripravený", description: `Sťahuje sa: ${data.url}` })
    },
  })

  const getTypeBadge = (type: InternalReport["type"]) => {
    const variants = {
      monthly: { variant: "default" as const, label: "Mesačný" },
      quarterly: { variant: "secondary" as const, label: "Štvrťročný" },
      yearly: { variant: "outline" as const, label: "Ročný" },
      custom: { variant: "outline" as const, label: "Vlastný" },
    }
    const { variant, label } = variants[type]
    return <Badge variant={variant}>{label}</Badge>
  }

  const handleCreate = () => {
    if (!formData.name || !formData.dateFrom || !formData.dateTo) {
      toast({ title: "Chyba", description: "Vyplňte všetky povinné polia", variant: "destructive" })
      return
    }
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Interné reporty</h1>
        </div>
        <div className="text-muted-foreground">Načítavam...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interné reporty</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Vytvoriť report
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Typ reportu</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky typy</SelectItem>
                <SelectItem value="monthly">Mesačný</SelectItem>
                <SelectItem value="quarterly">Štvrťročný</SelectItem>
                <SelectItem value="yearly">Ročný</SelectItem>
                <SelectItem value="custom">Vlastný</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Celkom reportov</div>
          <div className="text-2xl font-bold">{reports.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Celkom km</div>
          <div className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.totalKm, 0).toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Celkom jázd</div>
          <div className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.totalTrips, 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Celkom náklady</div>
          <div className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.totalCost, 0).toFixed(2)} €</div>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Názov</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Obdobie</TableHead>
              <TableHead className="text-right">Jazdy</TableHead>
              <TableHead className="text-right">Celkom km</TableHead>
              <TableHead className="text-right">Náklady</TableHead>
              <TableHead>Vytvoril</TableHead>
              <TableHead>Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{getTypeBadge(report.type)}</TableCell>
                <TableCell>{report.period}</TableCell>
                <TableCell className="text-right">{report.totalTrips}</TableCell>
                <TableCell className="text-right">{report.totalKm.toLocaleString()} km</TableCell>
                <TableCell className="text-right">{report.totalCost.toFixed(2)} €</TableCell>
                <TableCell className="text-sm text-muted-foreground">{report.createdBy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => exportMutation.mutate({ id: report.id, format: "excel" })}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(report.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vytvoriť interný report</DialogTitle>
            <DialogDescription>Zadajte parametre nového reportu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Názov reportu *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mesačný report - Január 2024"
              />
            </div>
            <div>
              <Label>Typ reportu *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mesačný</SelectItem>
                  <SelectItem value="quarterly">Štvrťročný</SelectItem>
                  <SelectItem value="yearly">Ročný</SelectItem>
                  <SelectItem value="custom">Vlastný</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Obdobie *</Label>
              <Input
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="2024-01 alebo Q1 2024"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Dátum od *</Label>
                <Input
                  type="date"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label>Dátum do *</Label>
                <Input
                  type="date"
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              Vytvoriť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
