import type { Holiday } from "@/lib/types"
import { mockHolidaysApi } from "@/lib/mock-api"

export async function getHolidays(params?: { year?: number; type?: string; country?: string }): Promise<Holiday[]> {
  return mockHolidaysApi.getAll(params)
}

export async function getHoliday(id: string): Promise<Holiday> {
  return mockHolidaysApi.getById(id)
}

export async function createHoliday(data: Omit<Holiday, "id" | "createdAt" | "updatedAt">): Promise<Holiday> {
  return mockHolidaysApi.create(data)
}

export async function updateHoliday(id: string, data: Partial<Holiday>): Promise<Holiday> {
  return mockHolidaysApi.update(id, data)
}

export async function deleteHoliday(id: string): Promise<void> {
  return mockHolidaysApi.delete(id)
}

export async function importHolidaysFromCsv(file: File): Promise<{ imported: number; errors: string[] }> {
  return mockHolidaysApi.importFromCsv(file)
}

export async function importHolidaysFromApi(country: string, year: number): Promise<{ imported: number }> {
  return mockHolidaysApi.importFromApi(country, year)
}
