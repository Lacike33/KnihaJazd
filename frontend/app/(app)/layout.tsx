import type React from "react";
import { AppLayout } from "@/components/app-layout";
import { OnboardingProvider } from "@/features/onboarding/components/onboarding-provider";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";
import { MissionHighlight } from "@/features/onboarding/components/mission-highlight";
import { ContextualTips } from "@/features/onboarding/components/contextual-tips";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <AppLayout>{children}</AppLayout>
      <OnboardingWizard />
      <MissionHighlight />
      <ContextualTips />
    </OnboardingProvider>
  );
}
