"use client";

import { useAuth } from "@/providers/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AlertLockTrips = () => {
  const { hasRole } = useAuth();

  if (hasRole(["admin", "accountant"])) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Informácia</AlertTitle>
        <AlertDescription>Nezabudnite pravidelně uzamykať jazdy pre aktuálne obdobie.</AlertDescription>
      </Alert>
    );
  } else {
    return null;
  }
};

export default AlertLockTrips;
