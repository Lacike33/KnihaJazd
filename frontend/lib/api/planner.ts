import type { PlannedTrip } from "@/lib/types"
import { mockPlannedTripsApi } from "@/lib/mock-api"

export async function getPlannedTrips(filters?: { status?: string; fromDate?: string; toDate?: string }): Promise<
  PlannedTrip[]
> {
  return mockPlannedTripsApi.list(filters)
}

export async function getPlannedTrip(id: string): Promise<PlannedTrip> {
  return mockPlannedTripsApi.get(id)
}

export async function createPlannedTrip(data: Partial<PlannedTrip>): Promise<PlannedTrip> {
  return mockPlannedTripsApi.create(data)
}

export async function updatePlannedTrip(id: string, data: Partial<PlannedTrip>): Promise<PlannedTrip> {
  return mockPlannedTripsApi.update(id, data)
}

export async function deletePlannedTrip(id: string): Promise<void> {
  return mockPlannedTripsApi.delete(id)
}

export async function completePlannedTrip(id: string, actualTripId: string): Promise<PlannedTrip> {
  return mockPlannedTripsApi.complete(id, actualTripId)
}
