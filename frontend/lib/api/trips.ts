import { mockTripsApi } from "../mock-api"
import type { Trip, TripsSummary } from "../types"

export interface TripsQueryParams {
  vehicleId?: string
  driverId?: string
  dateFrom?: string
  dateTo?: string
  type?: string
  source?: string
  locked?: boolean
}

export async function getTrips(params?: TripsQueryParams): Promise<Trip[]> {
  console.log("[v0] getTrips called with params:", params)

  const filters = {
    vehicleId: params?.vehicleId,
    driverId: params?.driverId,
    dateFrom: params?.dateFrom,
    dateTo: params?.dateTo,
    type: params?.type,
    source: params?.source,
    locked: params?.locked,
  }

  console.log("[v0] Filters being sent to mock API:", filters)
  const result = await mockTripsApi.getAll(filters)
  console.log("[v0] getTrips result:", result.length, "trips")

  return result
}

export async function getTrip(id: string): Promise<Trip> {
  return mockTripsApi.getById(id)
}

export async function createTrip(data: Partial<Trip>): Promise<Trip> {
  return mockTripsApi.create(data)
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
  return mockTripsApi.update(id, data)
}

export async function lockTrip(id: string): Promise<void> {
  await mockTripsApi.update(id, { locked: true })
}

export async function unlockTrip(id: string): Promise<void> {
  await mockTripsApi.update(id, { locked: false })
}

export async function deleteTrip(id: string): Promise<void> {
  return mockTripsApi.delete(id)
}

export async function duplicateTrip(tripId: string): Promise<Trip> {
  const originalTrip = await mockTripsApi.getById(tripId)

  const duplicatedData = {
    ...originalTrip,
    source: "manual" as const,
    locked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  delete (duplicatedData as any).id

  return mockTripsApi.create(duplicatedData)
}

export async function bulkLockTrips(tripIds: string[]): Promise<void> {
  for (const tripId of tripIds) {
    await mockTripsApi.update(tripId, { locked: true })
  }
}

export async function bulkUnlockTrips(tripIds: string[]): Promise<void> {
  for (const tripId of tripIds) {
    await mockTripsApi.update(tripId, { locked: false })
  }
}

export async function bulkDeleteTrips(tripIds: string[]): Promise<void> {
  for (const tripId of tripIds) {
    await mockTripsApi.delete(tripId)
  }
}

export async function bulkAddToVatReport(tripIds: string[], vatReportId: string): Promise<void> {
  for (const tripId of tripIds) {
    await mockTripsApi.update(tripId, {
      locked: true,
      vatReportId: vatReportId,
    })
  }
}

export async function getTripsSummary(params?: TripsQueryParams): Promise<TripsSummary> {
  // Mock implementation
  const trips = await getTrips(params)
  return {
    totalTrips: trips.length,
    totalDistance: trips.reduce((sum, trip) => sum + trip.distance, 0),
    businessTrips: trips.filter((t) => t.purpose === "business").length,
    privateTrips: trips.filter((t) => t.purpose === "private").length,
  }
}
