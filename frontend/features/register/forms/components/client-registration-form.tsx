"use client";

import type React from "react";

import { useAuth } from "@/providers/auth-provider";
import type { Role } from "@/lib/types";

interface RequireRoleProps {
  roles: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function useHasRole(roles: Role | Role[]): boolean {
  const { hasRole } = useAuth();
  return hasRole(roles);
}

export function usePermissions() {
  const { user } = useAuth();

  return {
    canManageVehicles: user?.role === "admin",
    canManageDrivers: user?.role === "admin",
    canManageGpsDevices: user?.role === "admin",
    canLockTrips: user?.role === "admin" || user?.role === "accountant",
    canEditAllTrips: user?.role === "admin" || user?.role === "accountant",
    canEditOwnTrips: user?.role === "driver",
    canExportData: user?.role === "admin" || user?.role === "accountant",
    canViewAllTrips: user?.role === "admin" || user?.role === "accountant" || user?.role === "viewer",
    canEditTripType: true, // All roles can edit trip type (business/private)
  };
}
