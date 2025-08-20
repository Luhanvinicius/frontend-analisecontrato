'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false)
      // Redirecionar para a URL especificada ou para a página inicial
      router.push(redirectUrl)
    }, 2000)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Redirecionar para a URL especificada ou para a página inicial
      router.push(redirectUrl)
    }, 1500)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background animado */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`} />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${theme === 'dark' ? 'bg-white/30' : 'bg-[#1E5AA8]/30'} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="relative">
                <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-16 h-16 rounded-2xl shadow-2xl" />
              </div>
              <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                E-Confere
              </span>
            </Link>
          </div>

          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                {isLogin 
                  ? 'Entre para acessar suas análises' 
                  : 'Cadastre-se para começar a usar'
                }
              </CardDescription>
              {redirectUrl !== '/' && (
                <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mt-2`}>
                  {redirectUrl === '/painel' 
                    ? 'Você será redirecionado para o painel após o login'
                    : 'Você será redirecionado após o login'
                  }
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Login */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  className={`w-full h-14 ${theme === 'dark' ? 'text-white border-white/20 hover:bg-white/10' : 'text-gray-900 border-gray-300 hover:bg-gray-100'} text-lg backdrop-blur-sm hover:scale-105 transition-all duration-300`}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="md" />
                  ) : (
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continuar com Google
                </Button>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-20 transition-opacity duration-300 -z-10" />
              </div>

              <div className="relative">
                <Separator className={theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`bg-transparent px-4 ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>ou</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required={!isLogin}
                      className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>E-mail</Label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} w-5 h-5`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className={`h-14 pl-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Senha</Label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} w-5 h-5`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className={`h-14 pl-12 pr-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Confirmar senha</Label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} w-5 h-5`} />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required={!isLogin}
                        className={`h-14 pl-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-[#1E5AA8] hover:bg-[#164A96] text-white text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300 border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="md" />
                        <span className="ml-3">
                          {isLogin ? 'Entrando...' : 'Criando conta...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {isLogin ? 'Entrar' : 'Criar conta'}
                      </>
                    )}
                  </Button>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
                </div>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#1E5AA8] hover:text-[#164A96] font-medium text-lg transition-colors duration-300"
                >
                  {isLogin 
                    ? 'Não tem conta? Cadastre-se' 
                    : 'Já tem conta? Faça login'
                  }
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link href="/" className={`${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-lg transition-colors duration-300`}>
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
