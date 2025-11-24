"use client"

import { Badge } from "@/components/ui/badge"
import type { Trip, VehicleOwnership } from "@/lib/types"
import { Car, Briefcase, Home } from "lucide-react"

interface VehicleUsageBadgeProps {
  ownershipType?: VehicleOwnership
  trips?: Trip[]
}

export function VehicleUsageBadge({ ownershipType, trips = [] }: VehicleUsageBadgeProps) {
  if (!ownershipType) {
    return null
  }

  // Calculate business usage percentage
  const businessKm = trips.filter((trip) => trip.type === "business").reduce((sum, trip) => sum + trip.distanceKm, 0)

  const totalKm = trips.reduce((sum, trip) => sum + trip.distanceKm, 0)

  const businessPercentage = totalKm > 0 ? Math.round((businessKm / totalKm) * 100) : 0

  if (ownershipType === "private") {
    return (
      <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground">
        <Home className="h-3 w-3" />
        Súkromné
      </Badge>
    )
  }

  // Company vehicle
  if (businessPercentage === 100) {
    return (
      <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
        <Briefcase className="h-3 w-3" />
        100% Firemné
      </Badge>
    )
  }

  if (businessPercentage > 0) {
    return (
      <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-200">
        <Car className="h-3 w-3" />
        {businessPercentage}% Firemné
      </Badge>
    )
  }

  // Company vehicle but no business trips yet
  return (
    <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
      <Briefcase className="h-3 w-3" />
      Firemné
    </Badge>
  )
}
