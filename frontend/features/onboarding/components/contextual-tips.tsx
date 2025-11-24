"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useOnboarding } from "./onboarding-provider"
import { X, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContextualTip {
  id: string
  targetElement: string
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
}

const CONTEXTUAL_TIPS: ContextualTip[] = [
  {
    id: "vehicles-menu",
    targetElement: "[data-mission-target='vehicles-menu']",
    title: "Vozidlá",
    description: "Tu spravuješ vozový park - pridaj vozidlá, sleduj stav tachometra, tankovanie a servis.",
    position: "right",
  },
  {
    id: "trips-menu",
    targetElement: "[href='/trips']",
    title: "Jazdy",
    description: "Kompletný prehľad všetkých jázd - tabuľka, karty, alebo kalendár.",
    position: "right",
  },
  {
    id: "add-trip",
    targetElement: "[href='/add-trip']",
    title: "Pridať jazdu",
    description: "Rýchle pridanie novej jazdy s podporou pre stavy tachometra a zastávky.",
    position: "right",
  },
]

export function ContextualTips() {
  const { state } = useOnboarding()
  const [visibleTips, setVisibleTips] = useState<
    Map<string, { tip: ContextualTip; element: HTMLElement; position: DOMRect }>
  >(new Map())
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!state?.showTips) {
      setVisibleTips(new Map())
      return
    }

    const checkElements = () => {
      const newVisibleTips = new Map()

      CONTEXTUAL_TIPS.forEach((tip) => {
        if (dismissedTips.has(tip.id)) return

        const element = document.querySelector<HTMLElement>(tip.targetElement)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Only show tip if element is visible on screen
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            newVisibleTips.set(tip.id, { tip, element, position: rect })
          }
        }
      })

      setVisibleTips(newVisibleTips)
    }

    checkElements()

    const interval = setInterval(checkElements, 2000) // Check every 2 seconds
    window.addEventListener("scroll", checkElements, true)
    window.addEventListener("resize", checkElements)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", checkElements, true)
      window.removeEventListener("resize", checkElements)
    }
  }, [state?.showTips, dismissedTips])

  const dismissTip = (tipId: string) => {
    setDismissedTips((prev) => new Set(prev).add(tipId))
  }

  if (!state?.showTips || visibleTips.size === 0) return null

  return (
    <>
      {Array.from(visibleTips.values()).map(({ tip, position }) => {
        const tooltipPosition = tip.position || "bottom"
        let style: React.CSSProperties = {}

        switch (tooltipPosition) {
          case "right":
            style = {
              top: `${position.top + position.height / 2 - 40}px`,
              left: `${position.right + 16}px`,
            }
            break
          case "left":
            style = {
              top: `${position.top + position.height / 2 - 40}px`,
              right: `${window.innerWidth - position.left + 16}px`,
            }
            break
          case "top":
            style = {
              bottom: `${window.innerHeight - position.top + 16}px`,
              left: `${position.left}px`,
            }
            break
          case "bottom":
          default:
            style = {
              top: `${position.bottom + 16}px`,
              left: `${position.left}px`,
            }
        }

        return (
          <div
            key={tip.id}
            className="fixed z-[9997] bg-blue-500 text-white rounded-lg shadow-lg p-3 max-w-[240px] animate-in fade-in slide-in-from-top-2"
            style={style}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm">{tip.title}</h5>
                <p className="text-xs opacity-90 mt-1">{tip.description}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6 flex-shrink-0 hover:bg-blue-600"
                onClick={() => dismissTip(tip.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )
      })}
    </>
  )
}
