// Core types for the application
export type Role = "admin" | "accountant" | "driver" | "viewer"

export interface Address {
  street: string
  number: string
  city: string
  postalCode: string
  country: string
}

export interface Company {
  id: string
  name: string
  ico?: string
  dic?: string
  address?: Address // Changed from string to Address
  icdph?: string
  isVatPayer?: boolean
}

export interface User {
  id: string
  email: string
  role: Role
  company: Company
  driverId?: string
  partnerSettings?: PartnerSettings // Added partner settings
  onboardingState?: OnboardingState // Added onboarding state
}

export type VehicleOwnership = "company" | "private"
export type VatRegime = "100_business" | "50_mixed"
export type DrivingPermission = "only_default" | "all_vehicles"

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric" | "other"
export type InsuranceType = "liability" | "comprehensive" | "other"
export type DocumentType = "registration" | "insurance" | "lease" | "service" | "other"

export interface VehicleFuelConsumption {
  fuelType: FuelType
  averageConsumption: number // l/100km or kWh/100km
  cityConsumption?: number
  highwayConsumption?: number
  combinedConsumption?: number
}

export interface VehicleInsurance {
  id: string
  vehicleId: string
  type: InsuranceType
  policyNumber: string
  insuranceCompany: string
  validFrom: string
  validTo: string
  reminderDays?: number
  cost?: number
  notes?: string
}

export interface VehicleDocument {
  id: string
  vehicleId: string
  type: DocumentType
  name: string
  fileUrl: string
  uploadedAt: string
  uploadedBy: string
  notes?: string
}

export interface Vehicle {
  id: string
  registrationNo: string
  vin?: string
  brand?: string
  model?: string
  year?: number
  odoInitialKm?: number
  ownershipType?: VehicleOwnership
  registrationDate?: string
  vatRegime?: VatRegime
  autoImportEnabled?: boolean
  templateUsageEnabled?: boolean
  kmMatchingTolerance?: number
  fuelConsumption?: VehicleFuelConsumption
  insurance?: VehicleInsurance
  active?: boolean
  imageUrl?: string // Added imageUrl field for vehicle photo
}

export interface Driver {
  id: string
  name: string
  userId?: string
  role?: Role
  defaultVehicleId?: string
  drivingPermission?: DrivingPermission
}

export type TripSource = "gps_auto" | "gps_corrected" | "manual"
export type TripType = "business" | "private" | "mixed" | "unknown"

export interface TripWaypoint {
  id: string
  placeId: string
  placeName: string
  order: number
  isFixed: boolean // if false, it's random/optional waypoint
}

export type RouteMode = "google_maps" | "fixed_km"

export interface RouteVariant {
  id: string
  name: string
  distanceKm: number
  durationMinutes: number
  description?: string
  isDefault: boolean
}

export interface Trip {
  id: string
  vehicleId: string
  driverId?: string
  source: TripSource
  type: TripType
  startTime: string
  endTime: string
  startLocation?: string
  endLocation?: string
  startLat?: number
  startLon?: number
  endLat?: number
  endLon?: number
  distanceKm: number
  startOdometer?: number
  endOdometer?: number
  odometerReadingStartId?: string // Added odometer reading IDs to link trips with odometer records
  odometerReadingEndId?: string
  odometerPhotoUrl?: string
  odometerPhotoTakenBy?: string
  odometerPhotoTakenAt?: string
  ocrOriginalValue?: number
  ocrCorrectedValue?: number
  templateName?: string
  description?: string
  locked: boolean
  vatReportId?: string // Added vatReportId to link trips to VAT reports
  waypoints?: TripWaypoint[]
  routeMode?: RouteMode
  fixedKm?: number
  kmTolerance?: number
  routeVariants?: RouteVariant[]
  selectedRouteIndex?: number
  isOneWay?: boolean
  returnTrip?: TemplateReturnTrip
  createdAt: string
  updatedAt: string
}

export interface GpsDevice {
  id: string
  serialNumber: string
  vehicleId?: string
  isActive: boolean
  createdAt: string
}

export interface TripsSummary {
  totalTrips: number
  totalKm: number
  businessKm: number
  privateKm: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export type RewardType = "commission" | "bonus_months"
export type AffiliateStatus = "pending" | "active" | "paid"
export type AffiliateAction = "click" | "signup" | "activation" | "renewal" | "commission_earned" | "payout"

export interface AffiliateStats {
  totalReferrals: number
  payingCustomers: number
  totalCommission: number
  bonusMonths: number
  pendingCommission: number
  paidCommission: number
  usedBonusMonths: number
}

export interface AffiliateReferral {
  id: string
  referralCode: string
  referredEmail: string
  referredUserId?: string
  status: AffiliateStatus
  signupDate: string
  activationDate?: string
  commissionAmount: number
  bonusMonths: number
}

export interface AffiliateHistory {
  id: string
  date: string
  action: AffiliateAction
  clientEmail?: string
  amount?: number
  bonusMonths?: number
  description: string
}

export interface PartnerSettings {
  id: string
  userId: string
  isPartner: boolean
  companyIco?: string
  companyName?: string
  bankAccount?: string
  rewardType: RewardType
  referralCode: string
  gdprConsent: boolean
}

export interface TripChangeLog {
  id: string
  tripId: string
  userId: string
  userName: string
  changedAt: string
  field: string
  oldValue: string
  newValue: string
  description: string
}

export interface Refueling {
  id: string
  vehicleId: string
  driverId?: string
  date: string
  liters: number
  pricePerLiter: number
  totalPrice: number
  fuelType: string
  odometerKm: number
  location?: string
  invoiceNumber?: string
  notes?: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: "repair" | "inspection" | "service"
  date: string
  odometerKm: number
  description: string
  cost: number
  serviceProvider?: string
  invoiceNumber?: string
  notes?: string
}

export interface ScheduledMaintenance {
  id: string
  vehicleId: string
  type: "inspection" | "emissions" | "oil_change" | "tire_change" | "other"
  dueDate: string
  dueOdometerKm?: number
  description: string
  status: "pending" | "completed" | "overdue"
  reminderDays?: number
}

export interface OdometerReading {
  id: string
  vehicleId: string
  date: string
  odometerKm: number
  photoUrl?: string
  source: "manual" | "gps" | "photo"
  recordedBy?: string
}

export type PlaceType = "client" | "own_place" | "headquarters"

export interface Place {
  id: string
  name: string
  type: PlaceType
  address?: Address // Changed from string to Address
  latitude?: number
  longitude?: number
  isCompanyLocation?: boolean
  notes?: string
  tripPurposes?: string[]
  defaultPurposeIndex?: number // index of tripPurposes array to use as default
  createdAt: string
  updatedAt: string
}

export interface TemplateWaypoint {
  id: string
  placeId: string
  placeName: string
  order: number
  isFixed: boolean // if false, it's random/optional waypoint
}

export interface TemplateReturnTrip {
  enabled: boolean
  exactTime?: string // HH:mm format - if set, return at this exact time
  afterBreakMinutes?: number // if set, return after X minutes break
  timeTolerance?: number // tolerance in minutes for actual time deviation
}

export interface TripTemplate {
  id: string
  name: string
  vehicleId?: string // null means "all vehicles"
  fromPlaceId: string
  toPlaceId: string
  distanceKm: number
  defaultType: TripType
  defaultDescription?: string
  enabledForMobileAuto: boolean
  priority: number
  kmTolerance?: number
  timeFilterEnabled?: boolean
  timeFilterStart?: string // HH:mm format
  timeFilterEnd?: string // HH:mm format
  workdaysOnly?: boolean
  isRecurring?: boolean // Pravidelná jazda - automatically added to planned trips
  isAllDayTrip?: boolean // Celodenná jazda - blocks vehicle/driver for the whole day
  isOneWay?: boolean // Jednosmerná jazda
  returnTrip?: TemplateReturnTrip // Obojsmerná jazda - return trip configuration
  waypoints?: TemplateWaypoint[] // Medzizastávky between start and end
  allowOnHolidays?: boolean // Môže sa vykonať aj počas sviatkov
  createdAt: string
  updatedAt: string
}

export type ReportStatus = "draft" | "generated" | "locked"
export type ReportPeriod = "monthly" | "quarterly"
export type VatPayerType = "monthly" | "quarterly"

export interface InternalReport {
  id: string
  name: string
  type: "monthly" | "quarterly" | "yearly" | "custom"
  period: string
  dateFrom: string
  dateTo: string
  vehicleId?: string
  driverId?: string
  totalTrips: number
  totalKm: number
  businessKm: number
  privateKm: number
  totalCost: number
  createdAt: string
  createdBy: string
}

export interface ExportTemplate {
  id: string
  name: string
  format: "csv" | "excel" | "pdf"
  type: "trips" | "vat" | "costs" | "custom"
  fields: string[]
  filters?: any
  isDefault: boolean
  createdAt: string
}

export interface VatReport {
  id: string
  period: string // "2024-01" or "2024-Q1"
  vehicleId?: string // null means all vehicles
  status: ReportStatus
  totalKm: number
  businessKm: number
  privateKm: number
  startOdometer: number
  endOdometer: number
  tripCount: number
  fuelCosts: number
  maintenanceCosts: number
  tollCosts: number
  generatedAt?: string
  generatedBy?: string
  lockedAt?: string
  lockedBy?: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyVatSettings {
  vatPayerType: VatPayerType
  autoGenerateReports: boolean
}

export interface VehicleVatSettings {
  vehicleId: string
  includeInVatReports: boolean
  vatRegime: VatRegime
  autoGenerateReports: boolean
}

export type NotificationType =
  | "vat_deadline_approaching"
  | "missing_odometer_photo"
  | "km_mismatch"
  | "fuel_costs_anomaly"
  | "private_trip_on_business_vehicle"
  | "insurance_expiry_approaching" // Added insurance notification

export type NotificationChannel = "email" | "push" | "in_app"

export interface NotificationSettings {
  type: NotificationType
  enabled: boolean
  channels: NotificationChannel[]
  advanceDays?: number // For expiry warnings
  kmTolerance?: number // For km_mismatch - threshold in km
  fuelLiterTolerance?: number // For fuel_costs_anomaly - threshold in liters
}

// Added calendar sync settings types
export type CalendarSyncProvider = "google" | "outlook" | "apple"
export type CalendarSyncType = "planned_only" | "actual_only" | "all"

export interface CalendarSyncSettings {
  enabled: boolean
  provider: CalendarSyncProvider
  syncType: CalendarSyncType
  calendarId?: string
  lastSyncAt?: string
  autoSync: boolean
  syncIntervalMinutes: number
}

export interface CompanySettings {
  id: string
  companyId: string
  vatPayerType: VatPayerType
  autoGenerateVatReports: boolean
  defaultVehicleVatRegime: VatRegime
  notifications: NotificationSettings[]
  mobileAutoGenerateTrips: boolean
  mobileRequiresConfirmation: boolean
  globalKmTolerance: number
  autofillDefaultTripPurpose?: boolean
  calendarSync?: CalendarSyncSettings // Added calendar sync settings
}

export type TripGenerationDriverMode = "none" | "random" | "fixed"
export type TripGenerationKmSource = "tacho" | "phl"
export type TripGenerationPhlMode = "none" | "check_only" | "full"
export type TripGenerationKmDistribution = "even" | "percent_limit"
export type TripGenerationStatus = "preview" | "confirmed" | "cancelled"
export type TemplateUsageMode = "templates_only" | "templates_and_random" | "random_only"

export interface ClientFilters {
  addAllClients: boolean
  district?: string
  maxDistanceKm?: number
  maxTravelHours?: number
  includeHolidays: boolean
  includeAllDayTrips: boolean
}

export interface TripGenerationParams {
  vehicleId: string
  dateFrom: string
  dateTo: string
  odoStart: number
  odoEnd: number
  kmSource: TripGenerationKmSource
  tripType: TripType
  timeStart: string // HH:mm
  timeEnd: string // HH:mm
  minGapMinutes: number
  daysEnabled: {
    mon: boolean
    tue: boolean
    wed: boolean
    thu: boolean
    fri: boolean
    sat: boolean
    sun: boolean
  }
  ignoreWeekends: boolean
  ignoreHolidays: boolean
  placeIds: string[]
  driverMode: TripGenerationDriverMode
  driverId?: string
  trailerEnabled: boolean
  trailerThresholdKm: number
  phlMode: TripGenerationPhlMode
  phlKmDistribution: TripGenerationKmDistribution
  phlMaxPercentPerTrip?: number
  clientFilters?: ClientFilters
  templateUsageMode?: TemplateUsageMode
  templateIds?: string[]
  useDefaultPurposesOnly?: boolean
}

export interface GeneratedTripPreview {
  date: string
  timeFrom: string
  timeTo: string
  placeId: string
  placeName: string
  km: number
  kmExtra: number
  driverId?: string
  driverName?: string
  flags: ("generated" | "km_adjusted" | "driver_conflict" | "fixed" | "phl_based")[]
}

export interface TripGenerationPreviewResponse {
  runId: string
  summary: {
    totalDays: number
    totalGeneratedTrips: number
    totalKm: number
    kmSource: TripGenerationKmSource
    warnings: {
      code: string
      count: number
      message: string
    }[]
  }
  trips: GeneratedTripPreview[]
}

export interface TripGenerationRun {
  id: string
  params: TripGenerationParams
  status: TripGenerationStatus
  createdAt: string
  createdBy: string
}

export type HolidayType = "public" | "company" | "regional"

export interface Holiday {
  id: string
  date: string // YYYY-MM-DD format
  name: string
  type: HolidayType
  country: string
  region?: string
  recurring: boolean // if true, repeats every year
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: string
  userId: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
  lastLogin?: string
}

export type PlannedTripStatus = "planned" | "completed" | "cancelled"
export type RecurrenceType = "daily" | "weekly" | "monthly" | "workdays" | "custom"

export interface RecurrencePattern {
  type: RecurrenceType
  startDate: string
  endDate?: string
  timeTolerance?: number // minutes +/-
  customDays?: number[] // for custom pattern: 1=Monday, 7=Sunday
}

export interface PlannedTrip {
  id: string
  vehicleId: string
  driverId?: string
  templateId?: string
  plannedDate: string
  plannedTimeFrom: string
  plannedTimeTo: string
  fromPlaceId: string
  toPlaceId: string
  distanceKm: number
  type: TripType
  description?: string
  status: PlannedTripStatus
  actualTripId?: string // Link to actual trip when completed
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  waypoints?: TripWaypoint[]
  isOneWay: boolean
  returnTrip?: TemplateReturnTrip
  allowOnHolidays: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
}

export type OnboardingStep =
  | "welcome"
  | "user_type"
  | "vehicle_setup"
  | "driver_setup"
  | "places_setup"
  | "first_trip"
  | "advanced_features"
  | "completed"

export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "skipped"

export interface OnboardingState {
  status: OnboardingStatus
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  completedMissions: string[] // Added completedMissions to track finished missions
  showTips: boolean
  skippedAt?: Date
  completedAt?: Date
}

export type MissionStatus = "locked" | "available" | "in_progress" | "completed"

export interface MissionStep {
  id: string
  title: string
  description: string
  targetElement: string // CSS selector or data-mission-target attribute
  action: "click" | "navigate" | "fill" | "complete"
  highlightType?: "pulse" | "glow" | "spotlight"
}

export interface Mission {
  id: string
  title: string
  description: string
  status: MissionStatus
  reward?: string
  requiredSteps?: OnboardingStep[]
  icon: string
  steps?: MissionStep[] // Added mission steps for guided highlighting
  currentStepIndex?: number
}

export interface ContextualTip {
  id: string
  target: string
  title: string
  content: string
  position: "top" | "bottom" | "left" | "right"
  shown: boolean
}
