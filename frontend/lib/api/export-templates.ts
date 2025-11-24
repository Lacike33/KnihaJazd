import { mockExportTemplatesApi } from "../mock-api"
import type { ExportTemplate } from "../types"

export async function getExportTemplates(): Promise<ExportTemplate[]> {
  return mockExportTemplatesApi.getAll()
}

export async function getExportTemplate(id: string): Promise<ExportTemplate> {
  return mockExportTemplatesApi.getById(id)
}

export async function createExportTemplate(data: {
  name: string
  format: "csv" | "excel" | "pdf"
  type: "trips" | "vat" | "costs" | "custom"
  fields: string[]
  isDefault?: boolean
}): Promise<ExportTemplate> {
  return mockExportTemplatesApi.create(data)
}

export async function updateExportTemplate(id: string, data: Partial<ExportTemplate>): Promise<ExportTemplate> {
  return mockExportTemplatesApi.update(id, data)
}

export async function deleteExportTemplate(id: string): Promise<void> {
  return mockExportTemplatesApi.delete(id)
}

export async function executeQuickExport(type: string): Promise<{ url: string }> {
  return mockExportTemplatesApi.quickExport(type)
}
