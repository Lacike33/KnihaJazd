import {
  MOCK_USERS,
  MOCK_VEHICLES,
  MOCK_DRIVERS,
  MOCK_TRIPS,
  MOCK_GPS_DEVICES,
  MOCK_PARTNER_SETTINGS,
  MOCK_AFFILIATE_STATS,
  MOCK_AFFILIATE_REFERRALS,
  MOCK_AFFILIATE_HISTORY,
  MOCK_VAT_REPORTS,
  MOCK_INTERNAL_REPORTS,
  MOCK_EXPORT_TEMPLATES,
  MOCK_PLACES,
  MOCK_TRIP_TEMPLATES,
  MOCK_HOLIDAYS,
  MOCK_PLANNED_TRIPS,
  MOCK_REFUELINGS,
  MOCK_MAINTENANCE_RECORDS,
  MOCK_ODOMETER_READINGS,
} from "./mock-data"
import type {
  User,
  Vehicle,
  Driver,
  Trip,
  GpsDevice,
  LoginResponse,
  AffiliateStats,
  AffiliateReferral,
  AffiliateHistory,
  PartnerSettings,
  VatReport,
  InternalReport,
  ExportTemplate,
  Place,
  TripTemplate,
  TripGenerationParams,
  TripGenerationPreviewResponse,
  TripGenerationRun,
  GeneratedTripPreview,
  Holiday,
  PlannedTrip,
  Refueling,
  MaintenanceRecord,
  OdometerReading,
  OnboardingState,
  OnboardingStep,
  Mission,
  ContextualTip,
} from "./types"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth Mock API
export const mockAuthApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(500)
    console.log("[v0] Mock login attempt:", email)

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("Nesprávne prihlasovacie údaje")
    }

    const { password: _, ...userWithoutPassword } = user
    const access_token = `mock_token_${user.id}_${Date.now()}`

    console.log("[v0] Mock login success:", userWithoutPassword)
    return { access_token, user: userWithoutPassword }
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(300)
    console.log("[v0] Mock getCurrentUser with token:", token)

    // Extract user ID from token
    const userId = token.split("_")[2]
    const user = MOCK_USERS.find((u) => u.id === userId)

    if (!user) {
      throw new Error("Token je neplatný")
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}

// Vehicles Mock API
export const mockVehiclesApi = {
  async getAll(): Promise<Vehicle[]> {
    await delay(300)
    return [...MOCK_VEHICLES]
  },

  async getById(id: string): Promise<Vehicle> {
    await delay(300)
    const vehicle = MOCK_VEHICLES.find((v) => v.id === id)
    if (!vehicle) throw new Error("Vozidlo nenájdené")
    return vehicle
  },

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    await delay(500)
    const newVehicle: Vehicle = {
      id: String(MOCK_VEHICLES.length + 1),
      registrationNumber: data.registrationNumber || "",
      brand: data.brand || "",
      model: data.model || "",
      year: data.year || new Date().getFullYear(),
      fuelType: data.fuelType || "petrol",
      mileage: data.mileage || 0,
      active: data.active !== undefined ? data.active : true,
      ...data,
    }
    MOCK_VEHICLES.push(newVehicle)
    return newVehicle
  },

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await delay(500)
    const index = MOCK_VEHICLES.findIndex((v) => v.id === id)
    if (index === -1) throw new Error("Vozidlo nenájdené")

    MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...data }
    return MOCK_VEHICLES[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_VEHICLES.findIndex((v) => v.id === id)
    if (index !== -1) {
      MOCK_VEHICLES.splice(index, 1)
    }
  },
}

// Drivers Mock API
export const mockDriversApi = {
  async getAll(): Promise<Driver[]> {
    await delay(300)
    return [...MOCK_DRIVERS]
  },

  async create(data: Partial<Driver>): Promise<Driver> {
    await delay(500)
    const newDriver: Driver = {
      id: String(MOCK_DRIVERS.length + 1),
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      licenseNumber: data.licenseNumber || "",
      active: data.active !== undefined ? data.active : true,
    }
    MOCK_DRIVERS.push(newDriver)
    return newDriver
  },

  async update(id: string, data: Partial<Driver>): Promise<Driver> {
    await delay(500)
    const index = MOCK_DRIVERS.findIndex((d) => d.id === id)
    if (index === -1) throw new Error("Vodič nenájdený")

    MOCK_DRIVERS[index] = { ...MOCK_DRIVERS[index], ...data }
    return MOCK_DRIVERS[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_DRIVERS.findIndex((d) => d.id === id)
    if (index !== -1) {
      MOCK_DRIVERS.splice(index, 1)
    }
  },
}

// Trips Mock API
export const mockTripsApi = {
  async getAll(filters?: {
    vehicleId?: string
    driverId?: string
    dateFrom?: string
    dateTo?: string
    type?: string
    source?: string
    locked?: boolean
  }): Promise<Trip[]> {
    await delay(300)
    console.log("[v0] mockTripsApi.getAll called with filters:", filters)

    let trips = [...MOCK_TRIPS]
    console.log("[v0] Total trips before filtering:", trips.length)

    if (filters?.vehicleId) {
      trips = trips.filter((t) => t.vehicleId === filters.vehicleId)
      console.log("[v0] After vehicleId filter:", trips.length)
    }
    if (filters?.driverId) {
      trips = trips.filter((t) => t.driverId === filters.driverId)
      console.log("[v0] After driverId filter:", trips.length)
    }
    if (filters?.dateFrom) {
      const dateFrom = new Date(filters.dateFrom)
      trips = trips.filter((t) => new Date(t.startTime) >= dateFrom)
      console.log("[v0] After dateFrom filter:", trips.length, "dateFrom:", filters.dateFrom)
    }
    if (filters?.dateTo) {
      const dateTo = new Date(filters.dateTo)
      trips = trips.filter((t) => new Date(t.startTime) <= dateTo)
      console.log("[v0] After dateTo filter:", trips.length, "dateTo:", filters.dateTo)
    }
    if (filters?.type) {
      trips = trips.filter((t) => t.type === filters.type)
      console.log("[v0] After type filter:", trips.length)
    }
    if (filters?.source) {
      trips = trips.filter((t) => t.source === filters.source)
      console.log("[v0] After source filter:", trips.length)
    }
    if (filters?.locked !== undefined) {
      trips = trips.filter((t) => t.locked === filters.locked)
      console.log("[v0] After locked filter:", trips.length)
    }

    console.log("[v0] Final filtered trips count:", trips.length)
    return trips
  },

  async getById(id: string): Promise<Trip> {
    await delay(300)
    const trip = MOCK_TRIPS.find((t) => t.id === id)
    if (!trip) throw new Error("Jazda nenájdená")
    return trip
  },

  async create(data: Partial<Trip>): Promise<Trip> {
    await delay(500)
    const newTrip: Trip = {
      id: String(MOCK_TRIPS.length + 1),
      vehicleId: data.vehicleId || "",
      driverId: data.driverId || "",
      startLocation: data.startLocation || "",
      endLocation: data.endLocation || "",
      distanceKm: data.distanceKm || 0,
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date().toISOString(),
      type: data.type || "business",
      description: data.description || "",
      source: data.source || "manual",
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_TRIPS.push(newTrip)
    return newTrip
  },

  async update(id: string, data: Partial<Trip>): Promise<Trip> {
    await delay(500)
    const index = MOCK_TRIPS.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Jazda nenájdená")

    if (MOCK_TRIPS[index].locked && data.locked !== false) {
      throw new Error("Uzamknutú jazdu nie je možné upraviť")
    }

    MOCK_TRIPS[index] = { ...MOCK_TRIPS[index], ...data }
    return MOCK_TRIPS[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_TRIPS.findIndex((t) => t.id === id)
    if (index !== -1) {
      MOCK_TRIPS.splice(index, 1)
    }
  },
}

// GPS Devices Mock API
export const mockGpsDevicesApi = {
  async getAll(): Promise<GpsDevice[]> {
    await delay(300)
    return [...MOCK_GPS_DEVICES]
  },

  async create(data: Partial<GpsDevice>): Promise<GpsDevice> {
    await delay(500)
    const newDevice: GpsDevice = {
      id: String(MOCK_GPS_DEVICES.length + 1),
      deviceId: data.deviceId || "",
      name: data.name || "",
      vehicleId: data.vehicleId,
      active: data.active !== undefined ? data.active : true,
      lastSeen: new Date().toISOString(),
    }
    MOCK_GPS_DEVICES.push(newDevice)
    return newDevice
  },

  async update(id: string, data: Partial<GpsDevice>): Promise<GpsDevice> {
    await delay(500)
    const index = MOCK_GPS_DEVICES.findIndex((d) => d.id === id)
    if (index === -1) throw new Error("GPS zariadenie nenájdené")

    MOCK_GPS_DEVICES[index] = { ...MOCK_GPS_DEVICES[index], ...data }
    return MOCK_GPS_DEVICES[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_GPS_DEVICES.findIndex((d) => d.id === id)
    if (index !== -1) {
      MOCK_GPS_DEVICES.splice(index, 1)
    }
  },
}

// Affiliate Mock API for partner and referral management
export const mockAffiliateApi = {
  async getStats(userId: string): Promise<AffiliateStats> {
    await delay(300)
    const stats = MOCK_AFFILIATE_STATS[userId]
    if (!stats) {
      // Return empty stats for users without affiliate data
      return {
        totalReferrals: 0,
        payingCustomers: 0,
        totalCommission: 0,
        bonusMonths: 0,
        pendingCommission: 0,
        paidCommission: 0,
        usedBonusMonths: 0,
      }
    }
    return stats
  },

  async getReferrals(userId: string): Promise<AffiliateReferral[]> {
    await delay(300)
    const partnerSettings = MOCK_PARTNER_SETTINGS.find((p) => p.userId === userId)
    if (!partnerSettings) return []

    return MOCK_AFFILIATE_REFERRALS.filter((r) => r.referralCode === partnerSettings.referralCode)
  },

  async getHistory(userId: string): Promise<AffiliateHistory[]> {
    await delay(300)
    const partnerSettings = MOCK_PARTNER_SETTINGS.find((p) => p.userId === userId)
    if (!partnerSettings) return []

    // For simplicity, return all history items
    // In real app, filter by userId or referral code
    return [...MOCK_AFFILIATE_HISTORY]
  },

  async getPartnerSettings(userId: string): Promise<PartnerSettings | null> {
    await delay(300)
    const settings = MOCK_PARTNER_SETTINGS.find((p) => p.userId === userId)
    return settings || null
  },

  async updatePartnerSettings(userId: string, data: Partial<PartnerSettings>): Promise<PartnerSettings> {
    await delay(500)
    const index = MOCK_PARTNER_SETTINGS.findIndex((p) => p.userId === userId)

    if (index === -1) {
      // Create new partner settings
      const newSettings: PartnerSettings = {
        id: String(MOCK_PARTNER_SETTINGS.length + 1),
        userId,
        isPartner: data.isPartner !== undefined ? data.isPartner : false,
        rewardType: data.rewardType || "bonus_months",
        referralCode: data.referralCode || `REF${userId}${Date.now()}`,
        gdprConsent: data.gdprConsent || false,
        ...data,
      }
      MOCK_PARTNER_SETTINGS.push(newSettings)
      return newSettings
    }

    MOCK_PARTNER_SETTINGS[index] = { ...MOCK_PARTNER_SETTINGS[index], ...data }
    return MOCK_PARTNER_SETTINGS[index]
  },

  async requestPayout(userId: string, amount: number): Promise<void> {
    await delay(500)
    console.log(`[v0] Mock payout request: userId=${userId}, amount=${amount}`)
    // In real app, this would create a payout request
    // For mock, we just log it
  },
}

// VAT Reports Mock API
export const mockVatReportsApi = {
  async getAll(filters?: { year?: string; vehicleId?: string }): Promise<VatReport[]> {
    await delay(300)
    let filtered = [...MOCK_VAT_REPORTS]

    if (filters?.year) {
      filtered = filtered.filter((r) => r.period.startsWith(filters.year!))
    }

    if (filters?.vehicleId && filters.vehicleId !== "all") {
      filtered = filtered.filter((r) => r.vehicleId === filters.vehicleId)
    }

    return filtered
  },

  async getById(id: string): Promise<VatReport> {
    await delay(300)
    const report = MOCK_VAT_REPORTS.find((r) => r.id === id)
    if (!report) throw new Error("VAT report not found")
    return report
  },

  async create(data: Omit<VatReport, "id" | "createdAt" | "updatedAt">): Promise<VatReport> {
    await delay(500)
    const newReport: VatReport = {
      ...data,
      id: String(MOCK_VAT_REPORTS.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_VAT_REPORTS.push(newReport)
    return newReport
  },

  async lock(id: string): Promise<VatReport> {
    await delay(300)
    const report = MOCK_VAT_REPORTS.find((r) => r.id === id)
    if (!report) throw new Error("VAT report not found")

    report.status = "locked"
    report.lockedAt = new Date().toISOString()
    report.lockedBy = "Admin"
    report.updatedAt = new Date().toISOString()

    return report
  },

  async generatePdf(id: string): Promise<string> {
    await delay(1000)
    const report = MOCK_VAT_REPORTS.find((r) => r.id === id)
    if (!report) throw new Error("VAT report not found")

    // Simulate PDF generation
    const pdfUrl = `/exports/vat-report-${id}.pdf`
    report.pdfUrl = pdfUrl
    report.updatedAt = new Date().toISOString()

    return pdfUrl
  },
}

// Internal Reports Mock API
export const mockInternalReportsApi = {
  async getAll(filters?: {
    type?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<InternalReport[]> {
    await delay(300)
    let reports = [...MOCK_INTERNAL_REPORTS]

    if (filters?.type && filters.type !== "all") {
      reports = reports.filter((r) => r.type === filters.type)
    }

    return reports
  },

  async getById(id: string): Promise<InternalReport> {
    await delay(200)
    const report = MOCK_INTERNAL_REPORTS.find((r) => r.id === id)
    if (!report) throw new Error("Report not found")
    return report
  },

  async create(data: any): Promise<InternalReport> {
    await delay(400)
    const newReport: InternalReport = {
      id: String(MOCK_INTERNAL_REPORTS.length + 1),
      ...data,
      totalTrips: 0,
      totalKm: 0,
      businessKm: 0,
      privateKm: 0,
      totalCost: 0,
      createdAt: new Date().toISOString(),
      createdBy: "Admin User",
    }
    MOCK_INTERNAL_REPORTS.push(newReport)
    return newReport
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_INTERNAL_REPORTS.findIndex((r) => r.id === id)
    if (index > -1) {
      MOCK_INTERNAL_REPORTS.splice(index, 1)
    }
  },

  async export(id: string, format: string): Promise<{ url: string }> {
    await delay(500)
    return { url: `/downloads/report-${id}.${format}` }
  },
}

// Export Templates Mock API
export const mockExportTemplatesApi = {
  async getAll(): Promise<ExportTemplate[]> {
    await delay(300)
    return [...MOCK_EXPORT_TEMPLATES]
  },

  async getById(id: string): Promise<ExportTemplate> {
    await delay(200)
    const template = MOCK_EXPORT_TEMPLATES.find((t) => t.id === id)
    if (!template) throw new Error("Template not found")
    return template
  },

  async create(data: any): Promise<ExportTemplate> {
    await delay(400)
    const newTemplate: ExportTemplate = {
      ...data,
      id: String(MOCK_EXPORT_TEMPLATES.length + 1),
      isDefault: data.isDefault || false,
      createdAt: new Date().toISOString(),
    }
    MOCK_EXPORT_TEMPLATES.push(newTemplate)
    return newTemplate
  },

  async update(id: string, data: Partial<ExportTemplate>): Promise<ExportTemplate> {
    await delay(300)
    const index = MOCK_EXPORT_TEMPLATES.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Template not found")

    MOCK_EXPORT_TEMPLATES[index] = {
      ...MOCK_EXPORT_TEMPLATES[index],
      ...data,
    }
    return MOCK_EXPORT_TEMPLATES[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_EXPORT_TEMPLATES.findIndex((t) => t.id === id)
    if (index > -1) {
      MOCK_EXPORT_TEMPLATES.splice(index, 1)
    }
  },

  async quickExport(type: string): Promise<{ url: string }> {
    await delay(600)
    const timestamp = Date.now()
    return { url: `/downloads/quick-export-${type}-${timestamp}.xlsx` }
  },
}

// Places Mock API
export const mockPlacesApi = {
  async getAll(): Promise<Place[]> {
    await delay(300)
    return [...MOCK_PLACES]
  },

  async getById(id: string): Promise<Place | null> {
    await delay(200)
    return MOCK_PLACES.find((p) => p.id === id) || null
  },

  async create(data: Omit<Place, "id" | "createdAt" | "updatedAt">): Promise<Place> {
    await delay(400)
    const newPlace: Place = {
      ...data,
      id: String(MOCK_PLACES.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_PLACES.push(newPlace)
    return newPlace
  },

  async update(id: string, data: Partial<Place>): Promise<Place> {
    await delay(400)
    const index = MOCK_PLACES.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Place not found")

    MOCK_PLACES[index] = {
      ...MOCK_PLACES[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_PLACES[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_PLACES.findIndex((p) => p.id === id)
    if (index !== -1) {
      MOCK_PLACES.splice(index, 1)
    }
  },
}

// Trip Templates Mock API
export const mockTripTemplatesApi = {
  async getAll(): Promise<TripTemplate[]> {
    await delay(300)
    return [...MOCK_TRIP_TEMPLATES]
  },

  async getById(id: string): Promise<TripTemplate | null> {
    await delay(200)
    return MOCK_TRIP_TEMPLATES.find((t) => t.id === id) || null
  },

  async create(data: Omit<TripTemplate, "id" | "createdAt" | "updatedAt">): Promise<TripTemplate> {
    await delay(400)
    const newTemplate: TripTemplate = {
      ...data,
      id: String(MOCK_TRIP_TEMPLATES.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_TRIP_TEMPLATES.push(newTemplate)
    return newTemplate
  },

  async update(id: string, data: Partial<TripTemplate>): Promise<TripTemplate> {
    await delay(400)
    const index = MOCK_TRIP_TEMPLATES.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Template not found")

    MOCK_TRIP_TEMPLATES[index] = {
      ...MOCK_TRIP_TEMPLATES[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_TRIP_TEMPLATES[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const index = MOCK_TRIP_TEMPLATES.findIndex((t) => t.id === id)
    if (index !== -1) {
      MOCK_TRIP_TEMPLATES.splice(index, 1)
    }
  },
}

// Users Mock API for user management
export const mockUsersApi = {
  async getAll(): Promise<User[]> {
    await delay(300)
    return MOCK_USERS.map(({ password, ...user }) => user)
  },

  async getById(id: string): Promise<User> {
    await delay(200)
    const user = MOCK_USERS.find((u) => u.id === id)
    if (!user) throw new Error("User not found")
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async create(data: Omit<User, "id">): Promise<User> {
    await delay(500)
    const newUser = {
      ...data,
      id: String(MOCK_USERS.length + 1),
      password: "changeme123", // Default password
    }
    MOCK_USERS.push(newUser)

    // If role is driver and driverId provided, update driver with userId
    if (data.role === "driver" && data.driverId) {
      const driver = MOCK_DRIVERS.find((d) => d.id === data.driverId)
      if (driver) {
        driver.userId = newUser.id
        driver.role = "driver"
      }
    }

    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    await delay(500)
    const index = MOCK_USERS.findIndex((u) => u.id === id)
    if (index === -1) throw new Error("User not found")

    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data }
    const { password, ...userWithoutPassword } = MOCK_USERS[index]
    return userWithoutPassword
  },

  async delete(id: string): Promise<void> {
    await delay(500)
    const index = MOCK_USERS.findIndex((u) => u.id === id)
    if (index === -1) throw new Error("User not found")

    const user = MOCK_USERS[index]

    // If user is linked to driver, remove the link
    if (user.driverId) {
      const driver = MOCK_DRIVERS.find((d) => d.id === user.driverId)
      if (driver) {
        driver.userId = undefined
        driver.role = undefined
      }
    }

    MOCK_USERS.splice(index, 1)
  },
}

// Trip Generation Mock API
export const mockTripGenerationApi = {
  async preview(params: TripGenerationParams): Promise<TripGenerationPreviewResponse> {
    await delay(1500) // Longer delay to simulate complex generation

    const runId = `gen_${Date.now()}`

    // Calculate date range
    const startDate = new Date(params.dateFrom)
    const endDate = new Date(params.dateTo)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get selected places
    const selectedPlaces = MOCK_PLACES.filter((p) => params.placeIds.includes(p.id))

    // Generate mock trips
    const trips: GeneratedTripPreview[] = []
    let totalKm = 0
    const targetKm = params.odoEnd - params.odoStart

    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)

      const dayOfWeek = currentDate.getDay()
      const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      const isDayEnabled = params.daysEnabled[dayKeys[dayOfWeek] as keyof typeof params.daysEnabled]

      if (!isDayEnabled) continue
      if (params.ignoreWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) continue

      // Generate 1-3 trips per day
      const tripsPerDay = Math.floor(Math.random() * 3) + 1

      for (let j = 0; j < tripsPerDay; j++) {
        if (totalKm >= targetKm) break

        const place = selectedPlaces[Math.floor(Math.random() * selectedPlaces.length)]
        const km = Math.floor(Math.random() * 50) + 10
        const kmExtra = params.phlMode !== "none" ? Math.floor(Math.random() * 5) : 0

        const hour = Math.floor(Math.random() * 10) + 8 // 8-18h
        const timeFrom = `${hour.toString().padStart(2, "0")}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`
        const timeTo = `${(hour + 1).toString().padStart(2, "0")}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`

        trips.push({
          date: currentDate.toISOString().split("T")[0],
          timeFrom,
          timeTo,
          placeId: place.id,
          placeName: place.name,
          km,
          kmExtra,
          driverId: params.driverMode === "fixed" ? params.driverId : undefined,
          driverName:
            params.driverMode === "fixed" && params.driverId
              ? MOCK_DRIVERS.find((d) => d.id === params.driverId)?.name
              : undefined,
          flags: ["generated", params.phlMode !== "none" ? "phl_based" : "fixed"] as any,
        })

        totalKm += km + kmExtra
      }
    }

    // Generate warnings
    const warnings = []
    if (totalKm !== targetKm) {
      warnings.push({
        code: "km_mismatch",
        count: 1,
        message: `Rozdiel ${Math.abs(totalKm - targetKm)} km medzi cieľom a vygenerovanými jazdami`,
      })
    }

    if (params.driverMode === "none") {
      warnings.push({
        code: "missing_drivers",
        count: trips.length,
        message: "Niektoré jazdy nemajú priradeného vodiča",
      })
    }

    const storedPreviews = (globalThis as any).__generationPreviews || {}
    storedPreviews[runId] = { trips, params }
    ;(globalThis as any).__generationPreviews = storedPreviews

    console.log("[v0] Stored preview for runId:", runId, "with", trips.length, "trips")

    return {
      runId,
      summary: {
        totalDays: daysDiff,
        totalGeneratedTrips: trips.length,
        totalKm,
        kmSource: params.kmSource,
        warnings,
      },
      trips,
    }
  },

  async confirm(runId: string): Promise<Trip[]> {
    await delay(800)
    console.log("[v0] Confirming generated trips for runId:", runId)

    // Store the preview temporarily in memory (in real app, this would be from database)
    const storedPreviews = (globalThis as any).__generationPreviews || {}
    const preview = storedPreviews[runId]

    if (!preview) {
      console.log("[v0] No preview found for runId:", runId)
      throw new Error("Generation run not found. Please regenerate the preview.")
    }

    console.log("[v0] Found preview with", preview.trips.length, "trips to create")

    // Create actual trips from the preview
    const createdTrips: Trip[] = []

    for (const previewTrip of preview.trips) {
      const newTrip: Trip = {
        id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vehicleId: preview.params.vehicleId,
        driverId: previewTrip.driverId || preview.params.driverId,
        date: previewTrip.date,
        startTime: `${previewTrip.date}T${previewTrip.timeFrom}`,
        endTime: `${previewTrip.date}T${previewTrip.timeTo}`,
        startOdometer: 0, // Will be calculated based on previous trips
        endOdometer: previewTrip.km,
        distance: previewTrip.km,
        purpose: "business",
        route: {
          from: {
            name: "Sídlo firmy",
            address: "Hlavná 1, Bratislava",
            coordinates: { lat: 48.1486, lng: 17.1077 },
          },
          to: {
            name: previewTrip.placeName,
            address: previewTrip.placeName,
            coordinates: { lat: 48.1486, lng: 17.1077 },
          },
        },
        source: "generated",
        locked: false,
        notes: `Automaticky vygenerovaná jazda (${runId})`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add to MOCK_TRIPS
      MOCK_TRIPS.push(newTrip)
      createdTrips.push(newTrip)
    }

    console.log("[v0] Successfully created", createdTrips.length, "trips")

    // Clean up the stored preview
    delete storedPreviews[runId]

    return createdTrips
  },

  async cancel(runId: string): Promise<void> {
    await delay(300)
    console.log("[v0] Cancelling generation run:", runId)

    // Store the preview temporarily in memory (in real app, this would be from database)
    const storedPreviews = (globalThis as any).__generationPreviews || {}
    delete storedPreviews[runId]
    ;(globalThis as any).__generationPreviews = storedPreviews
  },

  async getRun(runId: string): Promise<TripGenerationRun> {
    await delay(300)
    // Mock implementation
    throw new Error("Not implemented in mock")
  },
}

// Holidays Mock API for managing holidays and days off
export const mockHolidaysApi = {
  getAll: async (params?: { year?: number; type?: string; country?: string }): Promise<Holiday[]> => {
    await delay(300)
    let filtered = [...MOCK_HOLIDAYS]

    if (params?.year) {
      filtered = filtered.filter((h) => h.date.startsWith(params.year!.toString()))
    }

    if (params?.type) {
      filtered = filtered.filter((h) => h.type === params.type)
    }

    if (params?.country) {
      filtered = filtered.filter((h) => h.country === params.country)
    }

    return filtered.sort((a, b) => a.date.localeCompare(b.date))
  },

  getById: async (id: string): Promise<Holiday> => {
    await delay(300)
    const holiday = MOCK_HOLIDAYS.find((h) => h.id === id)
    if (!holiday) throw new Error("Holiday not found")
    return holiday
  },

  create: async (data: Omit<Holiday, "id" | "createdAt" | "updatedAt">): Promise<Holiday> => {
    await delay(300)
    const newHoliday: Holiday = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_HOLIDAYS.push(newHoliday)
    return newHoliday
  },

  update: async (id: string, data: Partial<Holiday>): Promise<Holiday> => {
    await delay(300)
    const index = MOCK_HOLIDAYS.findIndex((h) => h.id === id)
    if (index === -1) throw new Error("Holiday not found")

    MOCK_HOLIDAYS[index] = {
      ...MOCK_HOLIDAYS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_HOLIDAYS[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay(300)
    const index = MOCK_HOLIDAYS.findIndex((h) => h.id === id)
    if (index !== -1) {
      MOCK_HOLIDAYS.splice(index, 1)
    }
  },

  importFromCsv: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    await delay(1000)
    // Mock CSV import - in reality would parse CSV file
    const mockImportedCount = Math.floor(Math.random() * 10) + 5
    return {
      imported: mockImportedCount,
      errors: [],
    }
  },

  importFromApi: async (country: string, year: number): Promise<{ imported: number }> => {
    await delay(1500)
    // Mock API import - in reality would fetch from external holidays API
    const mockImportedCount = Math.floor(Math.random() * 15) + 10
    return {
      imported: mockImportedCount,
    }
  },
}

// Planned Trips Mock API
export const mockPlannedTripsApi = {
  list: async (filters?: { status?: string; fromDate?: string; toDate?: string }): Promise<PlannedTrip[]> => {
    await delay(300)
    let result = [...MOCK_PLANNED_TRIPS]

    if (filters?.status) {
      result = result.filter((t) => t.status === filters.status)
    }

    if (filters?.fromDate) {
      result = result.filter((t) => t.plannedDate >= filters.fromDate!)
    }

    if (filters?.toDate) {
      result = result.filter((t) => t.plannedDate <= filters.toDate!)
    }

    return result
  },

  get: async (id: string): Promise<PlannedTrip> => {
    await delay(300)
    const trip = MOCK_PLANNED_TRIPS.find((t) => t.id === id)
    if (!trip) throw new Error("Plánovaná jazda nenájdená")
    return trip
  },

  create: async (data: Partial<PlannedTrip>): Promise<PlannedTrip> => {
    await delay(500)
    const newTrip: PlannedTrip = {
      id: `pt-${Date.now()}`,
      vehicleId: data.vehicleId!,
      driverId: data.driverId,
      templateId: data.templateId,
      plannedDate: data.plannedDate!,
      plannedTimeFrom: data.plannedTimeFrom!,
      plannedTimeTo: data.plannedTimeTo!,
      fromPlaceId: data.fromPlaceId!,
      toPlaceId: data.toPlaceId!,
      distanceKm: data.distanceKm || 0,
      type: data.type || "business",
      description: data.description,
      status: "planned",
      isRecurring: data.isRecurring || false,
      recurrencePattern: data.recurrencePattern,
      waypoints: data.waypoints || [],
      isOneWay: data.isOneWay || false,
      returnTrip: data.returnTrip,
      allowOnHolidays: data.allowOnHolidays || false,
      createdAt: new Date().toISOString(),
      createdBy: "current-user-id",
      updatedAt: new Date().toISOString(),
    }
    MOCK_PLANNED_TRIPS.push(newTrip)
    return newTrip
  },

  update: async (id: string, data: Partial<PlannedTrip>): Promise<PlannedTrip> => {
    await delay(500)
    const index = MOCK_PLANNED_TRIPS.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Plánovaná jazda nenájdená")

    MOCK_PLANNED_TRIPS[index] = {
      ...MOCK_PLANNED_TRIPS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_PLANNED_TRIPS[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay(300)
    const index = MOCK_PLANNED_TRIPS.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Plánovaná jazda nenájdená")
    MOCK_PLANNED_TRIPS.splice(index, 1)
  },

  complete: async (id: string, actualTripId: string): Promise<PlannedTrip> => {
    await delay(300)
    const index = MOCK_PLANNED_TRIPS.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Plánovaná jazda nenájdená")

    MOCK_PLANNED_TRIPS[index] = {
      ...MOCK_PLANNED_TRIPS[index],
      status: "completed",
      actualTripId,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_PLANNED_TRIPS[index]
  },
}

// Refuelings Mock API
export const mockRefuelingsApi = {
  getAll: async (vehicleId?: string): Promise<Refueling[]> => {
    await delay(200)
    return vehicleId ? MOCK_REFUELINGS.filter((r) => r.vehicleId === vehicleId) : MOCK_REFUELINGS
  },

  getById: async (id: string): Promise<Refueling | null> => {
    await delay(200)
    return MOCK_REFUELINGS.find((r) => r.id === id) || null
  },

  create: async (data: Omit<Refueling, "id">): Promise<Refueling> => {
    await delay(300)
    const newRefueling: Refueling = {
      ...data,
      id: `ref-${Date.now()}`,
    }
    MOCK_REFUELINGS.push(newRefueling)
    return newRefueling
  },

  update: async (id: string, data: Partial<Refueling>): Promise<Refueling> => {
    await delay(300)
    const index = MOCK_REFUELINGS.findIndex((r) => r.id === id)
    if (index === -1) throw new Error("Refueling not found")
    MOCK_REFUELINGS[index] = { ...MOCK_REFUELINGS[index], ...data }
    return MOCK_REFUELINGS[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay(300)
    const index = MOCK_REFUELINGS.findIndex((r) => r.id === id)
    if (index !== -1) {
      MOCK_REFUELINGS.splice(index, 1)
    }
  },
}

// Maintenance Mock API
export const mockMaintenanceApi = {
  getAll: async (vehicleId?: string): Promise<MaintenanceRecord[]> => {
    await delay(200)
    return vehicleId ? MOCK_MAINTENANCE_RECORDS.filter((m) => m.vehicleId === vehicleId) : MOCK_MAINTENANCE_RECORDS
  },

  getById: async (id: string): Promise<MaintenanceRecord | null> => {
    await delay(200)
    return MOCK_MAINTENANCE_RECORDS.find((m) => m.id === id) || null
  },

  create: async (data: Omit<MaintenanceRecord, "id">): Promise<MaintenanceRecord> => {
    await delay(300)
    const newRecord: MaintenanceRecord = {
      ...data,
      id: `maint-${Date.now()}`,
    }
    MOCK_MAINTENANCE_RECORDS.push(newRecord)
    return newRecord
  },

  update: async (id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    await delay(300)
    const index = MOCK_MAINTENANCE_RECORDS.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Maintenance record not found")
    MOCK_MAINTENANCE_RECORDS[index] = { ...MOCK_MAINTENANCE_RECORDS[index], ...data }
    return MOCK_MAINTENANCE_RECORDS[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay(300)
    const index = MOCK_MAINTENANCE_RECORDS.findIndex((m) => m.id === id)
    if (index !== -1) {
      MOCK_MAINTENANCE_RECORDS.splice(index, 1)
    }
  },
}

// Odometer Mock API
export const mockOdometerApi = {
  getAll: async (vehicleId?: string): Promise<OdometerReading[]> => {
    await delay(200)
    return vehicleId ? MOCK_ODOMETER_READINGS.filter((o) => o.vehicleId === vehicleId) : MOCK_ODOMETER_READINGS
  },

  getById: async (id: string): Promise<OdometerReading | null> => {
    await delay(200)
    return MOCK_ODOMETER_READINGS.find((o) => o.id === id) || null
  },

  create: async (data: Omit<OdometerReading, "id">): Promise<OdometerReading> => {
    await delay(300)
    const newReading: OdometerReading = {
      ...data,
      id: `odo-${Date.now()}`,
    }
    MOCK_ODOMETER_READINGS.push(newReading)
    return newReading
  },

  performOCR: async (imageData: string): Promise<{ odometerKm: number; confidence: number }> => {
    // Simulate OCR processing
    await delay(1500)
    // Mock OCR result - in reality this would call an OCR service
    const randomKm = 45000 + Math.floor(Math.random() * 10000)
    const confidence = 0.85 + Math.random() * 0.14 // 85-99%
    return {
      odometerKm: randomKm,
      confidence: Math.round(confidence * 100) / 100,
    }
  },

  delete: async (id: string): Promise<void> => {
    await delay(300)
    const index = MOCK_ODOMETER_READINGS.findIndex((o) => o.id === id)
    if (index !== -1) {
      MOCK_ODOMETER_READINGS.splice(index, 1)
    }
  },

  getLatestForVehicle: async (vehicleId: string): Promise<OdometerReading | null> => {
    await delay(200)
    const readings = MOCK_ODOMETER_READINGS.filter((r) => r.vehicleId === vehicleId).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return readings[0] || null
  },
}

// Onboarding Mock API
export const mockOnboardingApi = {
  async getState(userId: string): Promise<OnboardingState> {
    const stored = globalThis.MOCK_ONBOARDING_STATES?.get(userId)
    if (stored) return stored

    const defaultState: OnboardingState = {
      status: "not_started",
      currentStep: "welcome",
      completedSteps: [],
      completedMissions: [],
      showTips: true,
    }

    if (!globalThis.MOCK_ONBOARDING_STATES) {
      globalThis.MOCK_ONBOARDING_STATES = new Map()
    }
    globalThis.MOCK_ONBOARDING_STATES.set(userId, defaultState)

    return defaultState
  },

  async updateStep(userId: string, step: OnboardingStep): Promise<OnboardingState> {
    const state = await mockOnboardingApi.getState(userId)

    if (!state.completedSteps.includes(step)) {
      state.completedSteps.push(step)
    }

    const steps: OnboardingStep[] = [
      "welcome",
      "user_type",
      "vehicle_setup",
      "driver_setup",
      "places_setup",
      "first_trip",
      "advanced_features",
    ]

    const currentIndex = steps.indexOf(step)
    const nextStep = steps[currentIndex + 1] || "completed"

    state.currentStep = nextStep as OnboardingStep
    state.status = "in_progress"

    globalThis.MOCK_ONBOARDING_STATES?.set(userId, state)
    return state
  },

  async complete(userId: string): Promise<OnboardingState> {
    const state = await mockOnboardingApi.getState(userId)
    state.status = "completed"
    state.currentStep = "completed"
    state.completedAt = new Date()
    globalThis.MOCK_ONBOARDING_STATES?.set(userId, state)
    return state
  },

  async skip(userId: string): Promise<OnboardingState> {
    const state = await mockOnboardingApi.getState(userId)
    state.status = "skipped"
    state.skippedAt = new Date()
    globalThis.MOCK_ONBOARDING_STATES?.set(userId, state)
    return state
  },

  async reset(userId: string): Promise<OnboardingState> {
    const defaultState: OnboardingState = {
      status: "not_started",
      currentStep: "welcome",
      completedSteps: [],
      completedMissions: [],
      showTips: true,
    }
    globalThis.MOCK_ONBOARDING_STATES?.set(userId, defaultState)
    return defaultState
  },

  async getMissions(userId: string): Promise<Mission[]> {
    const state = await mockOnboardingApi.getState(userId)

    const missions: Mission[] = [
      {
        id: "first_vehicle",
        title: "Pridaj svoje prvé vozidlo",
        description: "Vytvor záznam svojho vozidla v systéme",
        status: state.completedMissions?.includes("first_vehicle")
          ? "completed"
          : state.completedSteps.includes("vehicle_setup")
            ? "completed"
            : "available",
        icon: "Car",
        reward: "Začiatočník",
        steps: [
          {
            id: "navigate_vehicles",
            title: "Prejdi do sekcie Vozidlá",
            description: "Klikni na 'Vozidlá' v ľavom menu",
            targetElement: '[data-mission-target="vehicles-menu"]',
            action: "click",
            highlightType: "pulse",
          },
          {
            id: "click_add_vehicle",
            title: "Klikni na tlačidlo pridať",
            description: "Otvor formulár pre nové vozidlo",
            targetElement: '[data-mission-target="add-vehicle-button"]',
            action: "click",
            highlightType: "glow",
          },
          {
            id: "submit_vehicle",
            title: "Vytvor vozidlo",
            description: "Vyplň údaje a klikni na tlačidlo 'Vytvoriť'",
            targetElement: '[data-mission-target="submit-vehicle-form"]',
            action: "click",
            highlightType: "success",
          },
        ],
      },
      {
        id: "first_trip",
        title: "Vytvor prvú jazdu",
        description: "Zaznamenaj svoju prvú jazdu do knihy jázd",
        status: state.completedMissions?.includes("first_trip")
          ? "completed"
          : state.completedSteps.includes("first_trip")
            ? "completed"
            : "available",
        icon: "Route",
        reward: "Prvý kilometér",
      },
      {
        id: "three_partners",
        title: "Pridaj aspoň 3 partnerov",
        description: "Vytvor záznamy svojich častých destinácií",
        status: state.completedMissions?.includes("three_partners") ? "completed" : "available",
        icon: "MapPin",
        reward: "Navigátor",
      },
      {
        id: "try_autogenerate",
        title: "Vyskúšaj autogenerovanie jázd",
        description: "Vytvor jazdy za celé obdobie naraz",
        status: state.completedMissions?.includes("try_autogenerate")
          ? "completed"
          : state.completedSteps.includes("advanced_features")
            ? "available"
            : "locked",
        icon: "Sparkles",
        reward: "Automatizátor",
        requiredSteps: ["first_trip"],
      },
      {
        id: "first_vat_report",
        title: "Vygeneruj prvý DPH výkaz",
        description: "Vytvor výkaz pre Finančnú správu",
        status: state.completedMissions?.includes("first_vat_report") ? "completed" : "available",
        icon: "FileText",
        reward: "Účtovník",
      },
      {
        id: "setup_defaults",
        title: "Nastav si defaultné vozidlo a vodiča",
        description: "Urýchli vyplňovanie jázd pomocou predvolených hodnôt",
        status: state.completedMissions?.includes("setup_defaults")
          ? "completed"
          : state.completedSteps.includes("driver_setup")
            ? "completed"
            : "available",
        icon: "Settings",
        reward: "Profesionál",
      },
    ]

    return missions
  },

  async completeMission(userId: string, missionId: string): Promise<Mission> {
    const state = await mockOnboardingApi.getState(userId)
    if (!state.completedMissions) state.completedMissions = []
    if (!state.completedMissions.includes(missionId)) {
      state.completedMissions.push(missionId)
      globalThis.MOCK_ONBOARDING_STATES?.set(userId, state)
    }

    const missions = await mockOnboardingApi.getMissions(userId)
    const mission = missions.find((m) => m.id === missionId)
    if (mission) {
      mission.status = "completed"
    }
    return mission!
  },

  async getTips(userId: string): Promise<ContextualTip[]> {
    return [
      {
        id: "dph_settings",
        target: '[data-tip="dph-settings"]',
        title: "Nastavenie DPH",
        content: "Tu nastavíš režim DPH pre výkazy podľa § 85n zákona.",
        position: "bottom",
        shown: false,
      },
      {
        id: "autogenerate_trips",
        target: '[data-tip="autogenerate"]',
        title: "Autogenerovanie jázd",
        content: "Vygeneruj celý mesiac jázd naraz. Ušetrí ti to hodiny práce.",
        position: "left",
        shown: false,
      },
      {
        id: "trip_templates",
        target: '[data-tip="templates"]',
        title: "Šablóny jázd",
        content: "Vytvor si šablóny pre pravidelné trasy a použi ich jedným klikom.",
        position: "bottom",
        shown: false,
      },
    ]
  },

  async markTipShown(userId: string, tipId: string): Promise<void> {
    // Mark tip as shown
  },

  async toggleTips(userId: string, enabled: boolean): Promise<OnboardingState> {
    const state = await mockOnboardingApi.getState(userId)
    state.showTips = enabled
    globalThis.MOCK_ONBOARDING_STATES?.set(userId, state)
    return state
  },
}
