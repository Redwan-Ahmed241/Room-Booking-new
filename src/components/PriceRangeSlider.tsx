"use client"

import type React from "react"

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  className?: string
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, value, onChange, step = 1, className = "" }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - step)
    onChange([newMin, value[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + step)
    onChange([value[0], newMax])
  }

  const minPercent = ((value[0] - min) / (max - min)) * 100
  const maxPercent = ((value[1] - min) / (max - min)) * 100

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-pink-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          step={step}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 1 }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          step={step}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 2 }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>${min}</span>
        <span>${max}+</span>
      </div>
    </div>
  )
}

export default PriceRangeSlider
