import type React from "react"
import { Home } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="p-1 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg">
        <Home className={`${iconSizes[size]} text-white`} />
      </div>
      <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>VillaEase</span>
    </div>
  )
}

export default Logo
