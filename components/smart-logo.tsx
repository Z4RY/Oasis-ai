"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

interface SmartLogoProps {
  className?: string
  showText?: boolean
}

export function SmartLogo({ className = "", showText = true }: SmartLogoProps) {
  const { user } = useAuth()
  
  // Redirect to dashboard if user is authenticated, otherwise to main page
  const href = user ? "/dashboard" : "/"
  
  return (
    <Link href={href} className={`flex items-center space-x-3 ${className}`}>
      <div className="w-8 h-8 text-foreground">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2L8 6h3v6H8l4 4 4-4h-3V6h3l-4-4z" />
          <path d="M2 12l4-4v3h6v-3l4 4-4 4v-3H6v3l-4-4z" />
        </svg>
      </div>
      {showText && (
        <span className="text-2xl font-light text-foreground">Oasis</span>
      )}
    </Link>
  )
}
