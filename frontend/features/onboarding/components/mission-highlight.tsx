"use client"

import { useEffect, useState } from "react"
import { useOnboarding } from "./onboarding-provider"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function MissionHighlight() {
  const { activeMission, currentMissionStep, completeMissionStep, cancelMission } = useOnboarding()
  const { toast } = useToast()
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!activeMission || !currentMissionStep) {
      setTargetElement(null)
      return
    }

    const selector = currentMissionStep.targetElement
    console.log("[v0] Looking for mission target:", selector)
    const element = document.querySelector<HTMLElement>(selector)

    if (element) {
      console.log("[v0] Found mission target element:", element)
      setTargetElement(element)
      updatePosition(element)

      element.scrollIntoView({ behavior: "smooth", block: "center" })

      const handleClick = (e: Event) => {
        console.log("[v0] Mission target clicked")
        if (currentMissionStep.action === "click") {
          setTimeout(() => {
            completeMissionStep()

            const currentIndex = activeMission.currentStepIndex || 0
            const nextIndex = currentIndex + 1

            if (nextIndex >= (activeMission.steps?.length || 0)) {
              toast({
                title: "🎉 Misia dokončená!",
                description: `${activeMission.title} - Získavaš odznak: ${activeMission.reward}`,
                duration: 5000,
              })
            }
          }, 300)
        }
      }
      element.addEventListener("click", handleClick)

      const updatePos = () => updatePosition(element)
      window.addEventListener("resize", updatePos)
      window.addEventListener("scroll", updatePos, true)

      return () => {
        element.removeEventListener("click", handleClick)
        window.removeEventListener("resize", updatePos)
        window.removeEventListener("scroll", updatePos, true)
      }
    } else {
      console.log("[v0] Mission target not found:", selector)
    }
  }, [activeMission, currentMissionStep, completeMissionStep, toast])

  const updatePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    setPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
  }

  if (!targetElement || !currentMissionStep || !activeMission) return null

  const highlightType = currentMissionStep.highlightType || "pulse"

  return (
    <>
      {/* Dark overlay everywhere except target */}
      <div
        className="fixed inset-0 bg-black/60 pointer-events-none z-[9998]"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
            ${position.left - 8}px ${position.top - 8}px,
            ${position.left - 8}px ${position.top + position.height + 8}px,
            ${position.left + position.width + 8}px ${position.top + position.height + 8}px,
            ${position.left + position.width + 8}px ${position.top - 8}px,
            ${position.left - 8}px ${position.top - 8}px
          )`,
        }}
      />

      {/* Highlighted border around target */}
      <div
        className={`fixed pointer-events-none z-[9999] rounded-lg border-4 transition-all ${
          highlightType === "pulse"
            ? "border-blue-500 animate-pulse"
            : highlightType === "glow"
              ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
              : "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.8)]"
        }`}
        style={{
          top: `${position.top - 8}px`,
          left: `${position.left - 8}px`,
          width: `${position.width + 16}px`,
          height: `${position.height + 16}px`,
        }}
      />

      {/* Tooltip with instructions */}
      <div
        className="fixed z-[10000] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm"
        style={{
          top: `${Math.min(position.top + position.height + 20, window.innerHeight - 150)}px`,
          left: `${Math.max(16, Math.min(position.left, window.innerWidth - 400))}px`,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <ChevronDown className="flex-shrink-0 w-6 h-6 text-primary" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{currentMissionStep.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{currentMissionStep.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-xs text-muted-foreground">
                Krok {(activeMission.currentStepIndex || 0) + 1} z {activeMission.steps?.length || 0}
              </div>
              <Button size="sm" variant="outline" onClick={cancelMission}>
                <X className="w-3 h-3 mr-1" />
                Zrušiť
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
