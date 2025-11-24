import type { OnboardingState, OnboardingStep, Mission, ContextualTip } from "@/lib/types"
import { mockOnboardingApi } from "@/lib/mock-api"

export async function getOnboardingState(userId: string): Promise<OnboardingState> {
  return mockOnboardingApi.getState(userId)
}

export async function updateOnboardingStep(userId: string, step: OnboardingStep): Promise<OnboardingState> {
  return mockOnboardingApi.updateStep(userId, step)
}

export async function completeOnboarding(userId: string): Promise<OnboardingState> {
  return mockOnboardingApi.complete(userId)
}

export async function skipOnboarding(userId: string): Promise<OnboardingState> {
  return mockOnboardingApi.skip(userId)
}

export async function resetOnboarding(userId: string): Promise<OnboardingState> {
  return mockOnboardingApi.reset(userId)
}

export async function getMissions(userId: string): Promise<Mission[]> {
  return mockOnboardingApi.getMissions(userId)
}

export async function completeMission(userId: string, missionId: string): Promise<Mission> {
  return mockOnboardingApi.completeMission(userId, missionId)
}

export async function getContextualTips(userId: string): Promise<ContextualTip[]> {
  return mockOnboardingApi.getTips(userId)
}

export async function markTipShown(userId: string, tipId: string): Promise<void> {
  return mockOnboardingApi.markTipShown(userId, tipId)
}

export async function toggleTips(userId: string, enabled: boolean): Promise<OnboardingState> {
  return mockOnboardingApi.toggleTips(userId, enabled)
}
