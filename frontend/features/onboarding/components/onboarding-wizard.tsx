"use client"

import { useState, useEffect } from "react"
import { useOnboarding } from "./onboarding-provider"
import { WelcomeScreen } from "./welcome-screen"
import { UserTypeSetup } from "./user-type-setup"
import { VehicleSetup } from "./vehicle-setup"
import { DriverSetup } from "./driver-setup"
import { PlacesSetup } from "./places-setup"
import { FirstTripTutorial } from "./first-trip-tutorial"
import { AdvancedFeaturesTeaser } from "./advanced-features-teaser"
import { useRouter } from "next/navigation"

export function OnboardingWizard() {
  const router = useRouter()
  const { state, completeStep, skipOnboarding } = useOnboarding()
  const [currentScreen, setCurrentScreen] = useState<
    | "welcome"
    | "user_type"
    | "vehicle_setup"
    | "driver_setup"
    | "places_setup"
    | "first_trip"
    | "advanced_features"
    | null
  >(null)
  const [vehicleId, setVehicleId] = useState<string>("")

  useEffect(() => {
    if (state?.status === "not_started" || (state?.status === "in_progress" && state.currentStep === "welcome")) {
      setCurrentScreen("welcome")
    } else if (state?.status === "in_progress") {
      setCurrentScreen(state.currentStep as any)
    } else {
      setCurrentScreen(null)
    }
  }, [state])

  const handleStartOnboarding = () => {
    completeStep("welcome")
    setCurrentScreen("user_type")
  }

  const handleSkipOnboarding = () => {
    skipOnboarding()
    setCurrentScreen(null)
  }

  const handleUserTypeComplete = (data: { userType: string; vatMode: string }) => {
    console.log("[v0] User type setup completed:", data)
    completeStep("user_type")
    setCurrentScreen("vehicle_setup")
  }

  const handleVehicleComplete = (createdVehicleId: string) => {
    setVehicleId(createdVehicleId)
    completeStep("vehicle_setup")
    setCurrentScreen("driver_setup")
  }

  const handleDriverComplete = () => {
    completeStep("driver_setup")
    setCurrentScreen("places_setup")
  }

  const handlePlacesComplete = () => {
    completeStep("places_setup")
    setCurrentScreen("first_trip")
  }

  const handleFirstTripComplete = () => {
    completeStep("first_trip")
    setCurrentScreen("advanced_features")
  }

  const handleAdvancedFeaturesComplete = () => {
    completeStep("advanced_features")
    setCurrentScreen(null)
  }

  const handleLearnMore = (featureId: string) => {
    // Navigate to specific feature based on ID
    switch (featureId) {
      case "autogenerate":
        router.push("/generate-trips")
        break
      case "templates":
        router.push("/templates")
        break
      case "vat_report":
        router.push("/reports/vat")
        break
      case "import":
        router.push("/import")
        break
    }
    setCurrentScreen(null)
  }

  if (!state) return null

  return (
    <>
      <WelcomeScreen open={currentScreen === "welcome"} onStart={handleStartOnboarding} onSkip={handleSkipOnboarding} />
      <UserTypeSetup
        open={currentScreen === "user_type"}
        onComplete={handleUserTypeComplete}
        onBack={() => setCurrentScreen("welcome")}
      />
      <VehicleSetup
        open={currentScreen === "vehicle_setup"}
        onComplete={handleVehicleComplete}
        onBack={() => setCurrentScreen("user_type")}
      />
      <DriverSetup
        open={currentScreen === "driver_setup"}
        vehicleId={vehicleId}
        onComplete={handleDriverComplete}
        onBack={() => setCurrentScreen("vehicle_setup")}
      />
      <PlacesSetup
        open={currentScreen === "places_setup"}
        onComplete={handlePlacesComplete}
        onBack={() => setCurrentScreen("driver_setup")}
      />
      <FirstTripTutorial
        open={currentScreen === "first_trip"}
        onComplete={handleFirstTripComplete}
        onBack={() => setCurrentScreen("places_setup")}
      />
      <AdvancedFeaturesTeaser
        open={currentScreen === "advanced_features"}
        onComplete={handleAdvancedFeaturesComplete}
        onLearnMore={handleLearnMore}
      />
    </>
  )
}
