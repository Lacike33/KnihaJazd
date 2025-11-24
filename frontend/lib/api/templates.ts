import { mockTripTemplatesApi } from "../mock-api"
import type { TripTemplate } from "../types"

export async function getTripTemplates() {
  return mockTripTemplatesApi.getAll()
}

export { getTripTemplates as getTemplates }

export async function getTripTemplate(id: string) {
  return mockTripTemplatesApi.getById(id)
}

export async function createTripTemplate(data: Omit<TripTemplate, "id" | "createdAt" | "updatedAt">) {
  return mockTripTemplatesApi.create(data)
}

export async function updateTripTemplate(id: string, data: Partial<TripTemplate>) {
  return mockTripTemplatesApi.update(id, data)
}

export async function deleteTripTemplate(id: string) {
  return mockTripTemplatesApi.delete(id)
}
