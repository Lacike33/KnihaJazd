"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionsPanel } from "@/features/onboarding/components/missions-panel";
import { AIAssistant } from "@/features/onboarding/components/ai-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/features/onboarding/components/onboarding-provider";
import { BookOpen, MessageCircle, Trophy, SettingsIcon } from "lucide-react";

export default function HelperPage() {
  const { state, resetOnboarding, missions, toggleTips } = useOnboarding(); // Destructure toggleTips

  console.log("[v0] Helper page loaded");
  console.log("[v0] Onboarding state:", state);
  console.log("[v0] Missions:", missions);
  console.log("[v0] Missions count:", missions?.length || 0);

  const handleRestartTutorial = async () => {
    console.log("[v0] Restarting tutorial...");
    await resetOnboarding();
  };

  const handleToggleTips = async (checked: boolean) => {
    console.log("[v0] Toggle tips clicked:", checked);
    await toggleTips(checked);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Pomocník & Tutoriál" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pomocník & Tutoriál</h1>
          <p className="text-muted-foreground">Misie, AI asistent a nastavenia tutoriálu</p>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm">
            <strong>Debug Info:</strong> State: {state?.status || "loading"} | Missions: {missions?.length || 0} | Tips: {state?.showTips ? "ON" : "OFF"}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="missions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="missions" className="gap-2">
            <Trophy className="h-4 w-4" />
            Misie
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Asistent
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Nastavenia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          {console.log("[v0] Rendering MissionsPanel")}
          <MissionsPanel />
        </TabsContent>

        <TabsContent value="ai">
          {console.log("[v0] Rendering AIAssistant")}
          <AIAssistant />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Úvodný tutoriál</CardTitle>
                <CardDescription>Spusti úvodný tutoriál odznova alebo pokračuj tam, kde si skončil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stav tutoriálu</p>
                    <p className="text-sm text-muted-foreground">
                      {state?.status === "completed" && "Dokončený"}
                      {state?.status === "in_progress" && `Prebieha - krok ${state.currentStep}`}
                      {state?.status === "not_started" && "Nespustený"}
                      {state?.status === "skipped" && "Preskočený"}
                    </p>
                  </div>
                  <Button onClick={handleRestartTutorial}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Spustiť odznova
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kontextové tipy</CardTitle>
                <CardDescription>Zobrazovať pomocné tipy pri používaní aplikácie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="show-tips" checked={state?.showTips} onCheckedChange={handleToggleTips} />
                  <Label htmlFor="show-tips">Zobrazovať kontextové tipy</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
