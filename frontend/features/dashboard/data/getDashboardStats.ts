import "server-only";

import { config } from "@/config/config";

export const getDashboardStats = async () => {
  // v1/dashboard/stats

  //   const response = await fetch(`${config.apiUrl}/v1/dashboard/stats`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   const data = await response.json();

  return {
    data: {
      totalVehicles: 3,
      totalTrips: 6,
      totalKm: 1234.5,
      businessKm: 678.9,
    },
  };
};
