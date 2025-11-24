export type VehicleType = {
  id: string;
  registrationNo: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  odoInitialKm: number;
  ownershipType: OwnershipType;
  registrationDate: string;
  vatRegime: VatRegime;
  autoImportEnabled: boolean;
  templateUsageEnabled: boolean;
  kmMatchingTolerance: number;
  active: boolean;
  imageUrl?: string | null;
  fuelConsumption: {
    fuelType: FuelType;
    averageConsumption: number;
    cityConsumption: number;
    highwayConsumption: number;
    combinedConsumption: number;
  };
  insurance: VehicleInsuranceType | null;
};

export type VehicleInsuranceType = {
  id: string;
  vehicleId: string;
  provider?: string;
  policyNumber: string;
  validFrom: string;
  validTo: string;
  type: string;
  reminderDays: number;
  cost: number;
  notes?: string | null;
  insuranceCompany: string;
};

export type FuelType = "petrol" | "diesel" | "electric" | "hybrid" | "other";
export type OwnershipType = "company" | "private";
export type VatRegime = "100_business" | "50_mixed" | "0_private";
