import type { OdometerReading } from "@/lib/types"
import { mockOdometerApi } from "@/lib/mock-api"

export async function getOdometerReadings(vehicleId?: string): Promise<OdometerReading[]> {
  return mockOdometerApi.getAll(vehicleId)
}

export async function getOdometerReading(id: string): Promise<OdometerReading | null> {
  return mockOdometerApi.getById(id)
}

export async function createOdometerReading(data: Omit<OdometerReading, "id">): Promise<OdometerReading> {
  return mockOdometerApi.create(data)
}

export async function performOCR(imageData: string): Promise<{ odometerKm: number; confidence: number }> {
  return mockOdometerApi.performOCR(imageData)
}

export async function deleteOdometerReading(id: string): Promise<void> {
  return mockOdometerApi.delete(id)
}

export async function getLatestOdometerReading(vehicleId: string): Promise<OdometerReading | null> {
  return mockOdometerApi.getLatestForVehicle(vehicleId)
}

export async function updateOdometerReading(id: string, data: Partial<OdometerReading>): Promise<OdometerReading> {
  return mockOdometerApi.update(id, data)
}

export async function getOdometerReadingsInRange(
  vehicleId: string,
  dateFrom: string,
  dateTo: string,
): Promise<OdometerReading[]> {
  const allReadings = await mockOdometerApi.getAll(vehicleId)
  const startDate = new Date(dateFrom)
  const endDate = new Date(dateTo)

  return allReadings.filter((r) => {
    const readingDate = new Date(r.date)
    return readingDate >= startDate && readingDate <= endDate
  })
}
