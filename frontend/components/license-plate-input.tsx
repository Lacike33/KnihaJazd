"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LicensePlateInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

export function LicensePlateInput({ value, onChange, label = "EČV", required = false }: LicensePlateInputProps) {
  const [focused, setFocused] = useState(false)

  // Format: AA123BB or AA1234BB (Slovak license plate format)
  const formatValue = (input: string) => {
    const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "")
    return cleaned.slice(0, 8) // Max 8 characters
  }

  const displayValue = formatValue(value)

  // Split into parts for visual display: XX-000-XX
  const getParts = (val: string) => {
    const letters1 = val.slice(0, 2) // First 2 letters
    const numbers = val.slice(2, 6) // Up to 4 numbers
    const letters2 = val.slice(6, 8) // Last 2 letters
    return { letters1, numbers, letters2 }
  }

  const parts = getParts(displayValue)

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div className="relative">
        {/* Hidden input for actual value */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(formatValue(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="opacity-0 absolute inset-0 z-10 cursor-pointer"
          placeholder=""
        />

        {/* Visual license plate */}
        <div
          className={`relative flex items-center justify-center h-16 bg-white border-4 rounded-lg transition-all ${
            focused ? "border-blue-500 ring-2 ring-blue-200" : "border-black"
          }`}
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)",
            boxShadow: focused ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* EU flag */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-10 bg-blue-600 rounded flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="text-yellow-300 text-[8px] leading-none mb-0.5">★★★</div>
                <div className="text-yellow-300 text-[8px] leading-none mb-0.5">★★★★</div>
                <div className="text-yellow-300 text-[8px] leading-none mb-0.5">★★★★</div>
                <div className="text-yellow-300 text-[8px] leading-none">★★★</div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-white bg-blue-600 px-1 rounded-b">SK</div>
          </div>

          {/* License plate text */}
          <div className="flex items-center gap-1 ml-12 font-mono text-2xl font-bold tracking-wider">
            <span className="w-12 text-center">{parts.letters1 || ""}</span>
            <span className="text-gray-400">-</span>
            <span className="w-16 text-center">{parts.numbers || ""}</span>
            <span className="text-gray-400">-</span>
            <span className="w-12 text-center">{parts.letters2 || ""}</span>
          </div>

          {/* Placeholder hint */}
          {!displayValue && !focused && (
            <div className="absolute inset-0 flex items-center justify-center ml-12 pointer-events-none">
              <span className="text-gray-400 font-mono text-xl">AA-123-BB</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-1">Zadajte ŠPZ vo formáte: AA123BB alebo AA1234BB</p>
      </div>
    </div>
  )
}
