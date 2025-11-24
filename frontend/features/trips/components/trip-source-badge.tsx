import { Badge } from "@/components/ui/badge";
import { Satellite, Pencil, FileText } from "lucide-react";
import { TripSource } from "../types/trip";

interface TripSourceBadgeProps {
  source: TripSource;
}

export function TripSourceBadge({ source }: TripSourceBadgeProps) {
  switch (source) {
    case "gps_auto":
      return (
        <Badge variant="secondary" className="gap-1">
          <Satellite className="h-3 w-3" />
          GPS
        </Badge>
      );
    case "gps_corrected":
      return (
        <Badge variant="outline" className="gap-1">
          <Pencil className="h-3 w-3" />
          GPS + úprava
        </Badge>
      );
    case "manual":
      return (
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          Manuál
        </Badge>
      );
    case "imported":
      return (
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          Import
        </Badge>
      );
    case "other":
    default:
      return <Badge variant="outline">Iné</Badge>;
  }
}
