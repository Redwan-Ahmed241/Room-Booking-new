"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"

interface PriceRangeSliderProps {
  min?: number
  max?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export default function PriceRangeSlider({
  min = 0,
  max = 1000,
  value,
  onChange,
  className = "",
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(min, Math.min(newMin, localValue[1] - 1))
    const newValue: [number, number] = [clampedMin, localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(max, Math.max(newMax, localValue[0] + 1))
    const newValue: [number, number] = [localValue[0], clampedMax]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const percentage = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <DollarSign className="w-4 h-4 text-primary-600" />
        Price Range (per night)
      </Label>

      {/* Visual Slider */}
      <div className="relative h-2 bg-slate-200 rounded-full">
        {/* Track highlight */}
        <div
          className="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm"
          style={{
            left: `${percentage(localValue[0])}%`,
            width: `${percentage(localValue[1]) - percentage(localValue[0])}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1.5 hover:scale-110 transition-transform shadow-md hover:border-primary-600"
          style={{ left: `${percentage(localValue[0])}%` }}
        />

        {/* Max handle */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1.5 hover:scale-110 transition-transform shadow-md hover:border-primary-600"
          style={{ left: `${percentage(localValue[1])}%` }}
        />
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Minimum</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="number"
              min={min}
              max={localValue[1] - 1}
              value={localValue[0]}
              onChange={(e) => handleMinChange(Number.parseInt(e.target.value) || min)}
              className="pl-10 h-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Min price"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Maximum</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="number"
              min={localValue[0] + 1}
              max={max}
              value={localValue[1]}
              onChange={(e) => handleMaxChange(Number.parseInt(e.target.value) || max)}
              className="pl-10 h-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Max price"
            />
          </div>
        </div>
      </div>

      {/* Price display */}
      <div className="flex justify-between text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
        <span className="font-medium">${localValue[0]}</span>
        <span className="text-slate-400">to</span>
        <span className="font-medium">${localValue[1]}</span>
      </div>
    </div>
  )
}
