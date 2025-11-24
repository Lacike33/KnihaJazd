import { mockTripGenerationApi } from "../mock-api"
import type { TripGenerationParams, TripGenerationPreviewResponse, TripGenerationRun, Trip } from "../types"

export async function previewGeneratedTrips(params: TripGenerationParams): Promise<TripGenerationPreviewResponse> {
  return mockTripGenerationApi.preview(params)
}

export async function confirmGeneratedTrips(runId: string): Promise<Trip[]> {
  return mockTripGenerationApi.confirm(runId)
}

export async function cancelGeneratedTrips(runId: string): Promise<void> {
  return mockTripGenerationApi.cancel(runId)
}

export async function getGenerationRun(runId: string): Promise<TripGenerationRun> {
  return mockTripGenerationApi.getRun(runId)
}
