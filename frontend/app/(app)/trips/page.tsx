"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrips, deleteTrip, createTrip } from "@/lib/api/trips";
import { getVehicles } from "@/lib/api/vehicles";
import { getDrivers } from "@/lib/api/drivers";
import { getVatReports } from "@/lib/api/vat-reports";
import { TripFiltersComponent, type TripFilters } from "@/features/trips/components/trip-filters";
import { TripsTableView } from "@/features/trips/components/trips-table-view";
import { TripsCardView } from "@/features/trips/components/trips-card-view";
import { TripsCalendarView } from "@/features/trips/components/trips-calendar-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableIcon, LayoutGrid, Calendar, Route, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Trip } from "@/lib/types";

type ViewMode = "table" | "cards" | "calendar";

export default function TripsPage() {
  const [filters, setFilters] = useState<TripFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["trips", filters],
    queryFn: () => getTrips(filters),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  const { data: vatReports = [] } = useQuery({
    queryKey: ["vat-reports"],
    queryFn: getVatReports,
  });

  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast({
        title: "Jazda bola vytvorená",
        description: "Nová jazda bola úspešne pridaná do systému",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vytvoriť jazdu",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast({
        title: "Jazda bola zmazaná",
        description: "Jazda bola úspešne odstránená zo systému",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa zmazať jazdu",
        variant: "destructive",
      });
    },
  });

  const handleDuplicateTrip = (trip: Trip) => {
    // Prepare duplicated trip data without date and odometer
    const duplicateData = {
      ...trip,
      id: undefined,
      startTime: "",
      endTime: "",
      startOdometer: undefined,
      endOdometer: undefined,
      locked: false,
      createdAt: undefined,
      updatedAt: undefined,
    };

    // Open the trip form dialog with pre-filled data
    // This would need to be passed to TripFormDialog component
    toast({
      title: "Duplikovanie jazdy",
      description: "Formulár bude predvyplnený údajmi z vybranej jazdy",
    });
  };

  const handleToggleSelection = (tripId: string) => {
    setSelectedTripIds((prev) => (prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]));
  };

  const handleSelectAll = () => {
    if (selectedTripIds.length === trips.length) {
      setSelectedTripIds([]);
    } else {
      setSelectedTripIds(trips.map((t) => t.id));
    }
  };

  const handleAddToVatReport = (reportId?: string) => {
    if (selectedTripIds.length === 0) {
      toast({
        title: "Žiadne vybrané jazdy",
        description: "Prosím vyberte aspoň jednu jazdu",
        variant: "destructive",
      });
      return;
    }

    // Implementation would lock selected trips and assign to report
    toast({
      title: `Pridané ${selectedTripIds.length} jázd`,
      description: reportId ? "Jazdy boli pridané do uzávierky" : "Bola vytvorená nová uzávierka",
    });
    setSelectedTripIds([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kniha jázd</h1>
          <p className="text-muted-foreground">Prehľad všetkých jázd s možnosťou filtrovania</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/generate-trips")}>
            <Route className="mr-2 h-4 w-4" />
            Pridať plánovanú trasu
          </Button>
          <Button onClick={() => router.push("/add-trip")}>
            <Plus className="mr-2 h-4 w-4" />
            Pridať jazdu
          </Button>
        </div>
      </div>

      <TripFiltersComponent filters={filters} onFiltersChange={setFilters} vehicles={vehicles} drivers={drivers} />

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            Tabuľka
          </TabsTrigger>
          <TabsTrigger value="cards">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Karty
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Kalendár
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <TripsTableView
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            vatReports={vatReports}
            isLoading={isLoading}
            selectedTripIds={selectedTripIds}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onDelete={deleteMutation.mutate}
            onDuplicate={handleDuplicateTrip}
            onAddToVatReport={handleAddToVatReport}
          />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <TripsCardView
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            vatReports={vatReports}
            isLoading={isLoading}
            selectedTripIds={selectedTripIds}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onDelete={deleteMutation.mutate}
            onDuplicate={handleDuplicateTrip}
            onAddToVatReport={handleAddToVatReport}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <TripsCalendarView trips={trips} vehicles={vehicles} drivers={drivers} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
