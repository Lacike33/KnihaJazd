"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { OnboardingState, OnboardingStep, Mission, MissionStep } from "@/lib/types";
import { getOnboardingState, updateOnboardingStep, getMissions, resetOnboarding as apiResetOnboarding, completeMission as apiCompleteMission, toggleTips as apiToggleTips } from "@/lib/api/onboarding";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface OnboardingContextType {
  state: OnboardingState | null;
  missions: Mission[];
  isLoading: boolean;
  activeMission: Mission | null;
  currentMissionStep: MissionStep | null;
  startOnboarding: () => void;
  completeStep: (step: OnboardingStep) => Promise<void>;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  refreshMissions: () => Promise<void>;
  startMission: (missionId: string) => void;
  completeMissionStep: () => void;
  cancelMission: () => void;
  toggleTips: (enabled: boolean) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<OnboardingState | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [currentMissionStep, setCurrentMissionStep] = useState<MissionStep | null>(null);

  useEffect(() => {
    if (user) {
      loadOnboardingState();
      loadMissions();
    }
  }, [user]);

  const loadOnboardingState = async () => {
    if (!user) return;
    try {
      const data = await getOnboardingState(user.id);
      setState(data);
    } catch (error) {
      console.error("[v0] Failed to load onboarding state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMissions = async () => {
    if (!user) return;
    try {
      const data = await getMissions(user.id);
      setMissions(data);
    } catch (error) {
      console.error("[v0] Failed to load missions:", error);
    }
  };

  const startMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.status === "locked" || !mission.steps || mission.steps.length === 0) {
      console.log("[v0] Cannot start mission:", missionId, "status:", mission?.status, "steps:", mission?.steps?.length);
      return;
    }

    console.log("[v0] Starting mission:", missionId, "with", mission.steps.length, "steps");
    setActiveMission({ ...mission, status: "in_progress", currentStepIndex: 0 });
    setCurrentMissionStep(mission.steps[0]);
  };

  const completeMissionStep = async () => {
    if (!activeMission || currentMissionStep === null) return;

    const currentIndex = activeMission.currentStepIndex || 0;
    const nextIndex = currentIndex + 1;

    console.log("[v0] Completing mission step:", currentIndex, "next:", nextIndex, "total:", activeMission.steps?.length);

    if (nextIndex < (activeMission.steps?.length || 0)) {
      // Move to next step
      setActiveMission({ ...activeMission, currentStepIndex: nextIndex });
      setCurrentMissionStep(activeMission.steps![nextIndex]);
    } else {
      console.log("[v0] Mission completed:", activeMission.id);

      // Show celebration toast immediately
      toast({
        title: "🎉 Misia dokončená!",
        description: `${activeMission.title} - Získavaš odznak: ${activeMission.reward}`,
        duration: 5000,
      });

      if (user) {
        try {
          await apiCompleteMission(user.id, activeMission.id);
        } catch (error) {
          console.error("[v0] Failed to complete mission:", error);
        }
      }

      setActiveMission(null);
      setCurrentMissionStep(null);

      // Update mission status locally immediately
      setMissions((prev) => prev.map((m) => (m.id === activeMission.id ? { ...m, status: "completed" } : m)));

      // Reload missions to ensure sync
      await loadMissions();
    }
  };

  const cancelMission = () => {
    console.log("[v0] Mission cancelled");
    setActiveMission(null);
    setCurrentMissionStep(null);
  };

  const startOnboarding = () => {
    if (state) {
      setState({ ...state, status: "in_progress", currentStep: "welcome" });
    }
  };

  const completeStep = async (step: OnboardingStep) => {
    if (!user) return;
    try {
      const newState = await updateOnboardingStep(user.id, step);
      setState(newState);
      await loadMissions();
    } catch (error) {
      console.error("[v0] Failed to complete step:", error);
    }
  };

  const skipOnboarding = () => {
    if (state) {
      setState({ ...state, status: "skipped" });
    }
  };

  const resetOnboarding = async () => {
    if (!user) return;
    try {
      const newState = await apiResetOnboarding(user.id);
      setState(newState);
      await loadMissions();
      startOnboarding();
    } catch (error) {
      console.error("[v0] Failed to reset onboarding:", error);
    }
  };

  const refreshMissions = async () => {
    await loadMissions();
  };

  const toggleTips = async (enabled: boolean) => {
    if (!user) return;
    try {
      const newState = await apiToggleTips(user.id, enabled);
      setState(newState);
    } catch (error) {
      console.error("[v0] Failed to toggle tips:", error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        missions,
        isLoading,
        activeMission,
        currentMissionStep,
        startOnboarding,
        completeStep,
        skipOnboarding,
        resetOnboarding,
        refreshMissions,
        startMission,
        completeMissionStep,
        cancelMission,
        toggleTips,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
