'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  useEffect(() => {
    // Se vier token na URL, preencher automaticamente
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!token) {
      toast.error('Por favor, informe o código de recuperação recebido por email')
      return
    }

    if (!email) {
      toast.error('Por favor, informe o email cadastrado')
      return
    }

    setIsLoading(true)

    try {
      console.log('Enviando requisição de reset:', { 
        email: email.trim(), 
        tokenLength: token.trim().length,
        hasPassword: !!password 
      });
      
      const response = await api.post('/auth/reset-password', {
        token: token.trim(),
        email: email.trim(),
        newPassword: password
      })

      console.log('Resposta do servidor:', response.data);
      
      setSuccess(true)
      toast.success('Senha redefinida com sucesso!')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      console.error('Erro completo ao redefinir senha:', error)
      console.error('Detalhes:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao redefinir senha. Verifique o código e tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className={`w-full max-w-md ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'} backdrop-blur-xl shadow-2xl`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'} flex items-center justify-center`}>
                <CheckCircle className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
            <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Senha Redefinida!
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>
              Sua senha foi redefinida com sucesso. Redirecionando para o login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className={`w-full max-w-md ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'} backdrop-blur-xl shadow-2xl`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center`}>
              <Lock className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Redefinir Senha
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>
            Digite o código recebido por email e sua nova senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Email cadastrado
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Código de recuperação (6 dígitos)
              </Label>
              <Input
                id="token"
                type="text"
                placeholder="000000"
                value={token}
                onChange={(e) => {
                  // Permitir apenas números e limitar a 6 dígitos
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setToken(value);
                }}
                maxLength={6}
                required
                className={`h-14 font-mono text-center text-2xl tracking-widest ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
              />
              <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                Digite o código de 6 dígitos recebido no email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-12 pr-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`h-12 pr-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E5AA8] hover:bg-[#164A96] text-white h-12"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Redefinindo...
                </div>
              ) : (
                'Redefinir Senha'
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/login" 
                className={`text-sm ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Voltar para o login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

