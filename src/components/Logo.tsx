import type React from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="bg-pink-500 text-white rounded-lg p-2">
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">VillaEase</span>
      </div>
    </div>
  )
}

export default Logo
