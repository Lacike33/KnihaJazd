import { UserRole } from "@/types/user";

export type DriverType = {
  id: string;
  name: string;
  userId: string;
  role: UserRole;
  defaultVehicleId: string | null;
  drivingPermission: DrivingPermission;
};

export type DrivingPermission = "only_default" | "all" | "restricted";
