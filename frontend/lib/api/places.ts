import { mockPlacesApi } from "../mock-api"
import type { Place } from "../types"

export async function getPlaces() {
  return mockPlacesApi.getAll()
}

export async function getPlace(id: string) {
  return mockPlacesApi.getById(id)
}

export async function createPlace(data: Omit<Place, "id" | "createdAt" | "updatedAt">) {
  return mockPlacesApi.create(data)
}

export async function updatePlace(id: string, data: Partial<Place>) {
  return mockPlacesApi.update(id, data)
}

export async function deletePlace(id: string) {
  return mockPlacesApi.delete(id)
}
