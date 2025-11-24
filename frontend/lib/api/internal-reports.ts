import { mockInternalReportsApi } from "../mock-api"
import type { InternalReport } from "../types"

export async function getInternalReports(filters?: {
  type?: string
  dateFrom?: string
  dateTo?: string
}): Promise<InternalReport[]> {
  return mockInternalReportsApi.getAll(filters)
}

export async function getInternalReport(id: string): Promise<InternalReport> {
  return mockInternalReportsApi.getById(id)
}

export async function createInternalReport(data: {
  name: string
  type: "monthly" | "quarterly" | "yearly" | "custom"
  period: string
  dateFrom: string
  dateTo: string
  vehicleId?: string
  driverId?: string
}): Promise<InternalReport> {
  return mockInternalReportsApi.create(data)
}

export async function deleteInternalReport(id: string): Promise<void> {
  return mockInternalReportsApi.delete(id)
}

export async function exportInternalReport(id: string, format: "csv" | "excel" | "pdf"): Promise<{ url: string }> {
  return mockInternalReportsApi.export(id, format)
}
