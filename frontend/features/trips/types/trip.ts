import { DriverType } from "@/features/drivers/types/driver";
import { VehicleType } from "@/features/vehicles/types/vehicle";

export type Trip = {
  id: string;
  vehicleId: string;
  driverId: string;
  startLocation: string | null;
  endLocation: string | null;
  distanceKm: number;
  startTime: string;
  endTime: string;
  startOdometer: number;
  endOdometer: number;
  odometerPhotoUrl: string | null;
  odometerPhotoTakenBy: string | null;
  odometerPhotoTakenAt: string | null;
  ocrOriginalValue: number | null;
  ocrCorrectedValue: number | null;
  templateName: string | null;
  type: TripType;
  description: string | null;
  source: TripSource;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  driver: DriverType;
  vehicle: VehicleType;
};

export type TripType = "business" | "personal" | "commute" | "other" | "private";
export type TripSource = "gps_auto" | "manual" | "imported" | "other" | "gps_corrected";
