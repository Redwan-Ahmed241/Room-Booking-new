interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Orange circular background */}
          <circle cx="50" cy="35" r="28" fill="#FF8A00" className="drop-shadow-sm" />

          {/* Blue location pin */}
          <path
            d="M50 15C40.6 15 33 22.6 33 32c0 11.25 17 38 17 38s17-26.75 17-38c0-9.4-7.6-17-17-17z"
            fill="url(#blueGradient)"
            className="drop-shadow-md"
          />

          {/* House icon inside pin */}
          <g transform="translate(42, 25)">
            {/* House base */}
            <path d="M8 4L2 9v7h12V9L8 4z" fill="white" />
            {/* Windows */}
            <rect x="4" y="11" width="2" height="2" fill="white" />
            <rect x="10" y="11" width="2" height="2" fill="white" />
            {/* Door */}
            <rect x="7" y="13" width="2" height="3" fill="white" />
          </g>

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && <span className={`font-bold text-slate-700 ${textSizeClasses[size]}`}>VillaEase</span>}
    </div>
  )
}
