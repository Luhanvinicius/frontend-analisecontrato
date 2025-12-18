'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Verificar se está no navegador antes de acessar APIs
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    
    try {
      // Verificar se há tema salvo no localStorage
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Detectar preferência do sistema
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setTheme(systemTheme)
      }
    } catch (e) {
      // Ignorar erros durante build
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Proteger acesso ao localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme)
      } catch (e) {
        // Ignorar erros
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
