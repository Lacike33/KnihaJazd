import { mockGpsDevicesApi } from "../mock-api"
import type { GpsDevice } from "../types"

export async function getGpsDevices(): Promise<GpsDevice[]> {
  return mockGpsDevicesApi.getAll()
}

export async function createGpsDevice(data: Partial<GpsDevice>): Promise<GpsDevice> {
  return mockGpsDevicesApi.create(data)
}

export async function updateGpsDevice(id: string, data: Partial<GpsDevice>): Promise<GpsDevice> {
  return mockGpsDevicesApi.update(id, data)
}

export async function deleteGpsDevice(id: string): Promise<void> {
  return mockGpsDevicesApi.delete(id)
}

export async function uploadGpsFile(file: File, deviceSerial: string): Promise<void> {
  // Mock implementation - just simulate upload
  console.log("[v0] Mock GPS file upload:", file.name, "for device:", deviceSerial)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
