"use client";

import type React from "react";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHolidays, createHoliday, deleteHoliday, importHolidaysFromCsv, importHolidaysFromApi } from "@/lib/api/holidays";
import type { HolidayType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Calendar, Filter } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function HolidaysPage() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    type: "all",
    country: "all",
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "public" as HolidayType,
    country: "Slovensko",
    region: "",
    recurring: true,
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importCountry, setImportCountry] = useState("Slovensko");
  const [importYear, setImportYear] = useState(new Date().getFullYear());

  const queryParams = {
    year: filters.year,
    type: filters.type !== "all" ? filters.type : undefined,
    country: filters.country !== "all" ? filters.country : undefined,
  };

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ["holidays", queryParams],
    queryFn: () => getHolidays(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: createHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setCreateDialogOpen(false);
      setFormData({
        date: "",
        name: "",
        type: "public",
        country: "Slovensko",
        region: "",
        recurring: true,
      });
      toast({
        title: "Úspešne vytvorené",
        description: "Sviatok bol úspešne pridaný.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast({
        title: "Úspešne zmazané",
        description: "Sviatok bol úspešne odstránený.",
      });
    },
  });

  const importCsvMutation = useMutation({
    mutationFn: (file: File) => importHolidaysFromCsv(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setImportDialogOpen(false);
      setCsvFile(null);
      toast({
        title: "Import dokončený",
        description: `Importované: ${data.imported} sviatkov.`,
      });
    },
  });

  const importApiMutation = useMutation({
    mutationFn: () => importHolidaysFromApi(importCountry, importYear),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setImportDialogOpen(false);
      toast({
        title: "Import dokončený",
        description: `Importované: ${data.imported} sviatkov z API.`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      createdBy: "Admin",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Naozaj chcete zmazať tento sviatok?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCsvImport = () => {
    if (!csvFile) {
      toast({
        title: "Chyba",
        description: "Vyberte prosím CSV súbor.",
        variant: "destructive",
      });
      return;
    }
    importCsvMutation.mutate(csvFile);
  };

  const handleApiImport = () => {
    importApiMutation.mutate();
  };

  const getTypeLabel = (type: HolidayType) => {
    switch (type) {
      case "public":
        return "Štátny";
      case "company":
        return "Firemný";
      case "regional":
        return "Regionálny";
      default:
        return type;
    }
  };

  const getTypeBadgeVariant = (type: HolidayType) => {
    switch (type) {
      case "public":
        return "default";
      case "company":
        return "secondary";
      case "regional":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "Sviatky", href: "/holidays" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sviatky a dni pracovného pokoja</h1>
          <p className="text-muted-foreground mt-1">Správa sviatkov pre plánovanie a generovanie jázd</p>
        </div>
        <div className="flex gap-2">
          {hasRole("admin") && (
            <>
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import sviatkov</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Import z CSV súboru</h3>
                      <div>
                        <Label htmlFor="csv-file">Vyberte CSV súbor</Label>
                        <Input id="csv-file" type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
                        <p className="text-xs text-muted-foreground mt-2">Formát: dátum, názov, typ, krajina, región, opakuje_sa</p>
                      </div>
                      <Button onClick={handleCsvImport} disabled={!csvFile || importCsvMutation.isPending} className="w-full">
                        {importCsvMutation.isPending ? "Importujem..." : "Importovať z CSV"}
                      </Button>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-semibold">Import z verejného API</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="import-country">Krajina</Label>
                          <Select value={importCountry} onValueChange={setImportCountry}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Slovensko">Slovensko</SelectItem>
                              <SelectItem value="Česko">Česko</SelectItem>
                              <SelectItem value="Poľsko">Poľsko</SelectItem>
                              <SelectItem value="Rakúsko">Rakúsko</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="import-year">Rok</Label>
                          <Input id="import-year" type="number" value={importYear} onChange={(e) => setImportYear(Number(e.target.value))} min="2020" max="2030" />
                        </div>
                      </div>
                      <Button onClick={handleApiImport} disabled={importApiMutation.isPending} className="w-full" variant="secondary">
                        {importApiMutation.isPending ? "Importujem..." : "Importovať z API"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Pridať sviatok
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nový sviatok</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">Názov *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="napr. Deň vzniku SR" required />
                      </div>
                      <div>
                        <Label htmlFor="date">Dátum *</Label>
                        <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                      </div>
                      <div>
                        <Label htmlFor="type">Typ</Label>
                        <Select value={formData.type} onValueChange={(value: HolidayType) => setFormData({ ...formData, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Štátny sviatok</SelectItem>
                            <SelectItem value="company">Firemné voľno</SelectItem>
                            <SelectItem value="regional">Regionálny</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="country">Krajina</Label>
                        <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Slovensko" />
                      </div>
                      <div>
                        <Label htmlFor="region">Región (voliteľné)</Label>
                        <Input id="region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} placeholder="napr. Bratislavský kraj" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recurring">Opakuje sa každý rok</Label>
                      <Switch id="recurring" checked={formData.recurring} onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked })} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Vytváram..." : "Vytvoriť"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtre
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="filter-year">Rok</Label>
              <Select value={filters.year.toString()} onValueChange={(value) => setFilters({ ...filters, year: Number(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-type">Typ</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky</SelectItem>
                  <SelectItem value="public">Štátne sviatky</SelectItem>
                  <SelectItem value="company">Firemné voľno</SelectItem>
                  <SelectItem value="regional">Regionálne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-country">Krajina</Label>
              <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky</SelectItem>
                  <SelectItem value="Slovensko">Slovensko</SelectItem>
                  <SelectItem value="Česko">Česko</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sviatky {filters.year}</span>
            <Badge variant="secondary">{holidays.length} záznamov</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Načítavam...</div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žiadne sviatky pre vybrané filtre</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum</TableHead>
                  <TableHead>Názov</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Krajina</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Opakuje sa</TableHead>
                  {hasRole("admin") && <TableHead className="text-right">Akcie</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">
                      {new Date(holiday.date).toLocaleDateString("sk-SK", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(holiday.type)}>{getTypeLabel(holiday.type)}</Badge>
                    </TableCell>
                    <TableCell>{holiday.country}</TableCell>
                    <TableCell>{holiday.region || "-"}</TableCell>
                    <TableCell>{holiday.recurring ? "Áno" : "Nie"}</TableCell>
                    {hasRole("admin") && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(holiday.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
