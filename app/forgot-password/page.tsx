'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setEmailSent(true)
      toast.success('Email de recuperação enviado!')
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação:', error)
      // Mesmo em caso de erro, mostrar mensagem de sucesso por segurança
      setEmailSent(true)
      toast.success('Se o email existir, você receberá um link de recuperação')
    } finally {
      setIsLoading(false)
    }
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
              <Mail className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {emailSent ? 'Email Enviado!' : 'Recuperar Senha'}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>
            {emailSent 
              ? 'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha'
              : 'Digite seu email para receber um link de recuperação'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {emailSent ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-500/10 border border-green-400/30' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    Se o email <strong>{email}</strong> estiver cadastrado, você receberá um código de recuperação em breve.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/reset-password')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Já tenho o código de acesso
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Email
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E5AA8] hover:bg-[#164A96] text-white h-12"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </div>
                ) : (
                  'Enviar Link de Recuperação'
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

