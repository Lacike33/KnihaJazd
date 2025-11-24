import type { VatReport } from "@/lib/types"
import { mockVatReportsApi } from "@/lib/mock-api"

export async function getVatReports(filters?: {
  year?: string
  vehicleId?: string
}): Promise<VatReport[]> {
  return mockVatReportsApi.getAll(filters)
}

export async function getVatReportById(id: string): Promise<VatReport> {
  return mockVatReportsApi.getById(id)
}

export async function createVatReport(data: Omit<VatReport, "id" | "createdAt" | "updatedAt">): Promise<VatReport> {
  return mockVatReportsApi.create(data)
}

export async function lockVatReport(id: string): Promise<VatReport> {
  return mockVatReportsApi.lock(id)
}

export async function generateVatReportPdf(id: string): Promise<string> {
  return mockVatReportsApi.generatePdf(id)
}
