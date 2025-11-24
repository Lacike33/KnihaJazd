import { mockDriversApi } from "../mock-api"
import type { Driver } from "../types"

export async function getDrivers(): Promise<Driver[]> {
  return mockDriversApi.getAll()
}

export async function createDriver(data: Partial<Driver>): Promise<Driver> {
  return mockDriversApi.create(data)
}

export async function updateDriver(id: string, data: Partial<Driver>): Promise<Driver> {
  return mockDriversApi.update(id, data)
}

export async function deleteDriver(id: string): Promise<void> {
  return mockDriversApi.delete(id)
}
