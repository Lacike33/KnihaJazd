import type { Refueling } from "@/lib/types"
import { mockRefuelingsApi } from "@/lib/mock-api"

export async function getRefuelings(vehicleId?: string): Promise<Refueling[]> {
  return mockRefuelingsApi.getAll(vehicleId)
}

export async function getRefueling(id: string): Promise<Refueling | null> {
  return mockRefuelingsApi.getById(id)
}

export async function createRefueling(data: Omit<Refueling, "id">): Promise<Refueling> {
  return mockRefuelingsApi.create(data)
}

export async function updateRefueling(id: string, data: Partial<Refueling>): Promise<Refueling> {
  return mockRefuelingsApi.update(id, data)
}

export async function deleteRefueling(id: string): Promise<void> {
  return mockRefuelingsApi.delete(id)
}
