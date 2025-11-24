"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Lock, Play, Trophy, Star } from "lucide-react"
import { useOnboarding } from "./onboarding-provider"
import type { Mission } from "@/lib/types"
import { useRouter } from "next/navigation"

export function MissionsPanel() {
  const router = useRouter()
  const { missions, refreshMissions, startMission } = useOnboarding()
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  console.log("[v0] MissionsPanel - missions count:", missions?.length || 0)
  console.log("[v0] MissionsPanel - missions:", missions)

  useEffect(() => {
    refreshMissions()
  }, [])

  const completedMissions = missions.filter((m) => m.status === "completed").length
  const totalMissions = missions.length
  const progress = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0

  const getStatusIcon = (status: Mission["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />
      case "in_progress":
        return <Play className="h-5 w-5 text-primary" />
      default:
        return <Star className="h-5 w-5 text-primary" />
    }
  }

  const getStatusBadge = (status: Mission["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            Dokončené
          </Badge>
        )
      case "locked":
        return <Badge variant="secondary">Uzamknuté</Badge>
      case "in_progress":
        return <Badge variant="default">Prebieha</Badge>
      default:
        return <Badge variant="outline">Dostupné</Badge>
    }
  }

  const handleStartMission = (mission: Mission) => {
    console.log("[v0] Starting mission:", mission.id)
    startMission(mission.id)

    // Navigate to the appropriate page after starting mission
    switch (mission.id) {
      case "first_vehicle":
        router.push("/vehicles")
        break
      case "first_trip":
        router.push("/add-trip")
        break
      case "three_partners":
        router.push("/places")
        break
      case "try_autogenerate":
        router.push("/generate-trips")
        break
      case "first_vat_report":
        router.push("/reports/vat")
        break
      case "setup_defaults":
        router.push("/settings")
        break
    }
  }

  return (
    <div className="space-y-6">
      {(!missions || missions.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Žiadne misie zatiaľ</p>
            <p className="text-sm text-muted-foreground">Misie sa načítavajú...</p>
          </CardContent>
        </Card>
      )}

      {missions && missions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Tvoje misie
                </CardTitle>
                <CardDescription>Dokonč misie a získaj odznaky</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {completedMissions}/{totalMissions}
                </p>
                <p className="text-sm text-muted-foreground">Dokončené</p>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-4" />
          </CardHeader>
          <CardContent className="space-y-3">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className={`${
                  mission.status === "locked" ? "opacity-50" : "cursor-pointer hover:shadow-md transition-all"
                }`}
                onClick={() => mission.status !== "locked" && setSelectedMission(mission)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0">{getStatusIcon(mission.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{mission.title}</h4>
                      {getStatusBadge(mission.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                    {mission.reward && mission.status === "completed" && (
                      <Badge variant="secondary" className="mt-2">
                        <Trophy className="h-3 w-3 mr-1" />
                        {mission.reward}
                      </Badge>
                    )}
                  </div>
                  {mission.status !== "locked" && mission.status !== "completed" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartMission(mission)
                      }}
                    >
                      Spustiť
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedMission && selectedMission.status !== "locked" && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{selectedMission.title}</CardTitle>
            <CardDescription>{selectedMission.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Odmena:</span>
              <Badge variant="secondary">
                <Trophy className="h-3 w-3 mr-1" />
                {selectedMission.reward}
              </Badge>
            </div>
            {selectedMission.status !== "completed" && (
              <Button className="w-full" onClick={() => handleStartMission(selectedMission)}>
                Začať misiu
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
