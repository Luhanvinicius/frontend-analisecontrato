'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/services/api'

interface User {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo e buscar perfil atualizado
    const loadUser = async () => {
      // Verificar se está no navegador e não durante build
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          const savedToken = localStorage.getItem('token')
          const savedUser = localStorage.getItem('user')
        
          if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
            
            // Buscar perfil atualizado do servidor para garantir que o role está correto
            try {
              const response = await api.get('/auth/profile')
              if (response.data?.user) {
                const updatedUser = response.data.user
                setUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error)
              // Se der erro, usar o usuário salvo mesmo
            }
          }
        } catch (e) {
          // Ignorar erros durante build
        }
      }
      setIsLoading(false)
    }
    
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, user: newUser } = response.data
      
      if (!newToken || !newUser) {
        throw new Error('Resposta inválida do servidor')
      }
      
      setToken(newToken)
      setUser(newUser)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer login'
      throw new Error(errorMessage)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { token: newToken, user: newUser } = response.data
      
      setToken(newToken)
      setUser(newUser)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao criar conta')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/profile')
      if (response.data?.user) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

