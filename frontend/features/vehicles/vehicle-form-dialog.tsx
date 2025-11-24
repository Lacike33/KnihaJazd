"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createVehicle, updateVehicle } from "@/lib/api/vehicles";
import type { Vehicle } from "@/lib/types";
import { Plus, Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LicensePlateInput } from "@/components/license-plate-input";
import { useOnboarding } from "@/features/onboarding/components/onboarding-provider";

interface VehicleFormDialogProps {
  vehicle?: Vehicle;
  trigger?: React.ReactNode;
}

export function VehicleFormDialog({ vehicle, trigger }: VehicleFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(vehicle?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    registrationNo: vehicle?.registrationNo || "",
    vin: vehicle?.vin || "",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    year: vehicle?.year?.toString() || "",
    odoInitialKm: vehicle?.odoInitialKm?.toString() || "",
    ownershipType: vehicle?.ownershipType || "company",
  });

  const { completeMissionStep, activeMission } = useOnboarding();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        registrationNo: formData.registrationNo,
        vin: formData.vin || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        year: formData.year ? Number.parseInt(formData.year) : undefined,
        odoInitialKm: formData.odoInitialKm ? Number.parseFloat(formData.odoInitialKm) : undefined,
        ownershipType: formData.ownershipType,
        imageUrl: imagePreview || undefined,
      };

      if (vehicle) {
        await updateVehicle(vehicle.id, data);
        toast({ title: "Vozidlo aktualizované" });
      } else {
        await createVehicle(data);
        toast({ title: "Vozidlo vytvorené" });

        if (activeMission?.id === "first_vehicle") {
          setTimeout(() => {
            completeMissionStep();
          }, 500);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Chyba",
        description: error instanceof Error ? error.message : "Nepodarilo sa uložiť vozidlo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Pridať vozidlo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Upraviť vozidlo" : "Nové vozidlo"}</DialogTitle>
          <DialogDescription>{vehicle ? "Upravte údaje vozidla" : "Vytvorte nové vozidlo v systéme"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Fotografia vozidla</Label>
            <div className="flex gap-4">
              {imagePreview ? (
                <div className="relative h-32 w-48 overflow-hidden rounded-lg border">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-32 w-48 items-center justify-center rounded-lg border border-dashed bg-muted">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col justify-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  {imagePreview ? "Zmeniť fotku" : "Nahrať fotku"}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <p className="text-xs text-muted-foreground">JPG, PNG max 5MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNo">EČV *</Label>
            <LicensePlateInput value={formData.registrationNo} onChange={(value) => setFormData({ ...formData, registrationNo: value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownershipType">Typ vozidla *</Label>
            <Select value={formData.ownershipType} onValueChange={(value) => setFormData({ ...formData, ownershipType: value as "company" | "private" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Firemné vozidlo</SelectItem>
                <SelectItem value="private">Súkromné vozidlo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Značka</Label>
            <Input id="brand" placeholder="Škoda" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="Octavia" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Rok</Label>
              <Input id="year" type="number" placeholder="2020" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odoInitialKm">Počiatočný stav km</Label>
              <Input id="odoInitialKm" type="number" placeholder="50000" value={formData.odoInitialKm} onChange={(e) => setFormData({ ...formData, odoInitialKm: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="VIN číslo" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={loading} data-mission-target="submit-vehicle-form">
              {loading ? "Ukladám..." : vehicle ? "Uložiť" : "Vytvoriť"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
