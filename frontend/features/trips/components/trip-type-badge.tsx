import { Badge } from "@/components/ui/badge";
import { TripType } from "../types/trip";

interface TripTypeBadgeProps {
  type: TripType;
}

export function TripTypeBadge({ type }: TripTypeBadgeProps) {
  switch (type) {
    case "business":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Služobná</Badge>;
    case "private":
      return <Badge variant="secondary">Súkromná</Badge>;
    case "commute":
      return <Badge variant="outline">Dojazdy</Badge>;
    case "other":
      return <Badge variant="outline">Iné</Badge>;
    case "personal":
      return <Badge className="bg-green-500 hover:bg-green-600">Osobná</Badge>;
    default:
      return <Badge variant="outline">Neznámy</Badge>;
  }
}
