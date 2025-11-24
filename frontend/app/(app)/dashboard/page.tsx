import { Car, Route, TrendingUp } from "lucide-react";
import { StatsCard } from "@/features/dashboard/components/stats-card";
import { RecentTripsTable } from "@/features/trips/components/recent-trips-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/features/dashboard/data/getDashboardStats";
import AlertLockTrips from "@/features/dashboard/components/alert-lock-trips";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vitajte späť</p>
      </div>

      <AlertLockTrips />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Vozidlá" value={stats.data.totalVehicles} description="Aktívne vozidlá v systéme" icon={Car} />
        <StatsCard title="Jazdy tento mesiac" value={stats.data.totalTrips || 0} description="Celkový počet jázd" icon={Route} />
        <StatsCard title="Celkové km" value={stats.data.totalKm ? `${stats.data.totalKm.toFixed(0)} km` : "0 km"} description="Celková vzdialenosť" icon={TrendingUp} />
        <StatsCard title="Služobné km" value={stats.data.businessKm ? `${stats.data.businessKm.toFixed(0)} km` : "0 km"} description="Km pre firmu" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posledné jazdy</CardTitle>
          <CardDescription>Prehľad posledných 10 jázd vo všetkých vozidlách</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTripsTable />
        </CardContent>
      </Card>
    </div>
  );
}
