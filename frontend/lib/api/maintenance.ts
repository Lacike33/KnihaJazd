import type { MaintenanceRecord } from "@/lib/types"
import { mockMaintenanceApi } from "@/lib/mock-api"

export async function getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]> {
  return mockMaintenanceApi.getAll(vehicleId)
}

export async function getMaintenanceRecord(id: string): Promise<MaintenanceRecord | null> {
  return mockMaintenanceApi.getById(id)
}

export async function createMaintenanceRecord(data: Omit<MaintenanceRecord, "id">): Promise<MaintenanceRecord> {
  return mockMaintenanceApi.create(data)
}

export async function updateMaintenanceRecord(
  id: string,
  data: Partial<MaintenanceRecord>,
): Promise<MaintenanceRecord> {
  return mockMaintenanceApi.update(id, data)
}

export async function deleteMaintenanceRecord(id: string): Promise<void> {
  return mockMaintenanceApi.delete(id)
}
