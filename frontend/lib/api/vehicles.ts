import { mockVehiclesApi } from "../mock-api"
import type { Vehicle } from "../types"

export async function getVehicles(): Promise<Vehicle[]> {
  return mockVehiclesApi.getAll()
}

export async function getVehicle(id: string): Promise<Vehicle> {
  return mockVehiclesApi.getById(id)
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  return mockVehiclesApi.create(data)
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
  return mockVehiclesApi.update(id, data)
}

export async function deleteVehicle(id: string): Promise<void> {
  return mockVehiclesApi.delete(id)
}
