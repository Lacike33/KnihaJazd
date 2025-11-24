"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, Star, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getExportTemplates,
  createExportTemplate,
  deleteExportTemplate,
  executeQuickExport,
} from "@/lib/api/export-templates"
import type { ExportTemplate } from "@/lib/types"

export default function ExportsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    format: "excel" as ExportTemplate["format"],
    type: "trips" as ExportTemplate["type"],
    fields: [] as string[],
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["export-templates"],
    queryFn: getExportTemplates,
  })

  const createMutation = useMutation({
    mutationFn: createExportTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["export-templates"] })
      setCreateDialogOpen(false)
      setFormData({ name: "", format: "excel", type: "trips", fields: [] })
      toast({ title: "Šablóna vytvorená", description: "Exportná šablóna bola úspešne vytvorená" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExportTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["export-templates"] })
      toast({ title: "Šablóna zmazaná" })
    },
  })

  const quickExportMutation = useMutation({
    mutationFn: executeQuickExport,
    onSuccess: (data) => {
      toast({ title: "Export pripravený", description: `Sťahuje sa: ${data.url}` })
    },
  })

  const getFormatBadge = (formatType: ExportTemplate["format"]) => {
    const variants = {
      csv: { variant: "secondary" as const, label: "CSV" },
      excel: { variant: "default" as const, label: "Excel" },
      pdf: { variant: "outline" as const, label: "PDF" },
    }
    const { variant, label } = variants[formatType]
    return <Badge variant={variant}>{label}</Badge>
  }

  const handleCreate = () => {
    if (!formData.name) {
      toast({ title: "Chyba", description: "Zadajte názov šablóny", variant: "destructive" })
      return
    }
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exporty</h1>
        </div>
        <div className="text-muted-foreground">Načítavam...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exporty</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nová šablóna
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Rýchly export</h3>
          <div className="space-y-2">
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => quickExportMutation.mutate("trips-month")}
            >
              <Download className="mr-2 h-4 w-4" />
              Všetky jazdy (tento mesiac)
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => quickExportMutation.mutate("vat-quarter")}
            >
              <Download className="mr-2 h-4 w-4" />
              DPH výkaz (aktuálny štvrťrok)
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => quickExportMutation.mutate("costs-year")}
            >
              <Download className="mr-2 h-4 w-4" />
              Náklady (tento rok)
            </Button>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Naposledy exportované</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Jazdy_Januar_2024.xlsx</div>
                <div className="text-xs text-muted-foreground">15.01.2024 10:30</div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">DPH_Q4_2023.pdf</div>
                <div className="text-xs text-muted-foreground">10.01.2024 14:20</div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b p-4">
          <h3 className="font-semibold">Exportné šablóny</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Názov</TableHead>
              <TableHead>Formát</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Polia</TableHead>
              <TableHead>Predvolená</TableHead>
              <TableHead>Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{getFormatBadge(template.format)}</TableCell>
                <TableCell className="capitalize">{template.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{template.fields.length} polí</TableCell>
                <TableCell>
                  {template.isDefault && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(template.id)}>
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
            <DialogTitle>Vytvoriť exportnú šablónu</DialogTitle>
            <DialogDescription>Zadajte parametre novej exportnej šablóny</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Názov šablóny *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Daňový export jázd"
              />
            </div>
            <div>
              <Label>Formát *</Label>
              <Select
                value={formData.format}
                onValueChange={(value: any) => setFormData({ ...formData, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Typ exportu *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trips">Jazdy</SelectItem>
                  <SelectItem value="vat">DPH výkaz</SelectItem>
                  <SelectItem value="costs">Náklady</SelectItem>
                  <SelectItem value="custom">Vlastný</SelectItem>
                </SelectContent>
              </Select>
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
