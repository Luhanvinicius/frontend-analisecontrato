'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className={`relative overflow-hidden transition-all duration-300 border-0 ${
          theme === 'dark' 
            ? 'bg-[#1E5AA8] text-white hover:bg-[#164A96] hover:scale-110 hover:shadow-xl' 
            : 'bg-[#1E5AA8] text-white hover:bg-[#164A96] hover:scale-110 hover:shadow-xl'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 relative z-10 transition-transform duration-300 hover:rotate-180" />
        ) : (
          <Moon className="h-5 w-5 relative z-10 transition-transform duration-300 hover:rotate-12" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* Efeito de brilho */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
    </div>
  )
}
