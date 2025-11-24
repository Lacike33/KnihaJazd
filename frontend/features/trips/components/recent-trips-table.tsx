import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TripSourceBadge } from "./trip-source-badge";
import { TripTypeBadge } from "./trip-type-badge";
import { Lock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { getTrips } from "../data/getTrips";

export async function RecentTripsTable() {
  const recentTrips = await getTrips(1, 10);

  if (recentTrips.data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Žiadne jazdy</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dátum</TableHead>
            <TableHead>Vozidlo</TableHead>
            <TableHead>Vodič</TableHead>
            <TableHead>Trasa</TableHead>
            <TableHead className="text-right">Km</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Zdroj</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTrips.data.map((trip) => (
            <TableRow key={trip.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Link href={`/trips/${trip.id}`} className="hover:underline">
                  {format(new Date(trip.startTime), "dd.MM.yyyy HH:mm", { locale: sk })}
                </Link>
              </TableCell>
              <TableCell>{trip.vehicle.registrationNo}</TableCell>
              <TableCell>{trip.driver.name}</TableCell>
              <TableCell className="max-w-xs truncate">{trip.startLocation && trip.endLocation ? `${trip.startLocation} → ${trip.endLocation}` : "N/A"}</TableCell>
              <TableCell className="text-right font-medium">{trip.distanceKm.toFixed(1)}</TableCell>
              <TableCell>
                <TripTypeBadge type={trip.type} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TripSourceBadge source={trip.source} />
                  {trip.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
