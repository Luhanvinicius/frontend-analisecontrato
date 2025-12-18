'use client'

// Forçar renderização dinâmica (sem prerendering)
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Building, TreePine, Home, Key, RefreshCw, FileCheck, Upload, Zap, Shield, Clock, CheckCircle, Sparkles, ArrowRight, QrCode, Copy, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/services/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const services = [
  {
    id: 'matricula-urbana',
    title: 'Analisar Matrícula Urbana',
    description: 'Análise completa de matrícula de imóvel urbano',
    icon: Building,
    price: 14.99,
    gradient: 'from-blue-500 via-blue-600 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  {
    id: 'matricula-rural',
    title: 'Analisar Matrícula Rural',
    description: 'Análise detalhada de matrícula de imóvel rural',
    icon: TreePine,
    price: 14.99,
    gradient: 'from-green-500 via-emerald-600 to-teal-500',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'contrato-urbano',
    title: 'Analisar Contrato Urbano',
    description: 'Análise de contrato de compra e venda urbano',
    icon: Home,
    price: 9.99,
    gradient: 'from-purple-500 via-violet-600 to-indigo-500',
    bgGradient: 'from-purple-50 to-violet-50',
    free: true
  },
  {
    id: 'contrato-rural',
    title: 'Analisar Contrato Rural',
    description: 'Análise de contrato de compra e venda rural',
    icon: TreePine,
    price: 9.99,
    gradient: 'from-emerald-500 via-green-600 to-lime-500',
    bgGradient: 'from-emerald-50 to-green-50',
    free: true
  },
  {
    id: 'contrato-aluguel',
    title: 'Analisar Contrato de Aluguel',
    description: 'Análise de contrato de locação residencial',
    icon: Key,
    price: 9.99,
    gradient: 'from-orange-500 via-amber-600 to-yellow-500',
    bgGradient: 'from-orange-50 to-amber-50',
    free: true
  },
  {
    id: 'contrato-permuta',
    title: 'Analisar Contrato de Permuta',
    description: 'Análise de contrato de permuta de imóveis',
    icon: RefreshCw,
    price: 9.99,
    gradient: 'from-indigo-500 via-purple-600 to-pink-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    free: true
  },
  {
    id: 'transcricao-matricula',
    title: 'Analisar Transcrição de Matrícula',
    description: 'Análise de transcrição de matrícula imobiliária',
    icon: FileCheck,
    price: 19.99,
    gradient: 'from-red-500 via-rose-600 to-pink-500',
    bgGradient: 'from-red-50 to-rose-50'
  }
]

const backgroundImages = [
  '/modern-house-exterior.png',
  '/modern-apartment-building.png',
  '/luxury-villa.png',
  '/modern-glass-office.png'
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showQrCodeDialog, setShowQrCodeDialog] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; pixCopyPaste: string; amount: number; tipo: string; paymentId?: string; gatewayPaymentId?: string; paymentGateway?: string } | null>(null)
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hasFreeAnalysis, setHasFreeAnalysis] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const { isAuthenticated, login, register, refreshUser } = useAuth()

  useEffect(() => {
    setIsVisible(true)
    
    // Rotacionar imagens de fundo
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Verificar se o usuário já usou análise gratuita esta semana
  useEffect(() => {
    const checkFreeAnalysis = async () => {
      if (isAuthenticated) {
        try {
          const { verificarAnaliseGratuita } = await import('@/services/analise')
          const data = await verificarAnaliseGratuita()
          // hasFreeAnalysis do backend retorna true se PODE usar (não usou ainda)
          // Então invertemos para saber se JÁ usou
          setHasFreeAnalysis(!data.hasFreeAnalysis)
        } catch (error) {
          console.error('Erro ao verificar análise gratuita:', error)
          setHasFreeAnalysis(false)
        }
      }
    }
    checkFreeAnalysis()
  }, [isAuthenticated])

  // Verificar se deve abrir modal de pagamento automaticamente
  useEffect(() => {
    const paymentParam = searchParams.get('payment')
    const serviceParam = searchParams.get('service')
    
    if (paymentParam === 'true' && isAuthenticated && serviceParam) {
      // Encontrar o serviço correspondente
      const service = services.find(s => s.id === serviceParam)
      if (service) {
        // Mapear ID do serviço para tipo do backend
        const tipoMap: Record<string, string> = {
          'matricula-urbana': 'MATRICULA_URBANA',
          'matricula-rural': 'MATRICULA_RURAL',
          'contrato-urbano': 'CONTRATO_IMOVEL_URBANO',
          'contrato-rural': 'CONTRATO_IMOVEL_RURAL',
          'contrato-aluguel': 'CONTRATO_ALUGUEL',
          'contrato-permuta': 'PERMUTA',
          'transcricao-matricula': 'TRANSCRICAO',
        }
        
        const plan = {
          title: service.title,
          price: service.price,
          tipo: tipoMap[serviceParam] || serviceParam.toUpperCase()
        }
        
        // Gerar pagamento automaticamente após um pequeno delay
        setTimeout(() => {
          generatePayment(plan)
          // Limpar parâmetros da URL
          router.replace('/', { scroll: false })
        }, 500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated, router])

  // Carregar script do Google Identity Services
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const handleServiceClick = (serviceId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/upload?service=${serviceId}`)
    } else {
      router.push(`/upload?service=${serviceId}`)
    }
  }

  const handleMeuPainelClick = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/painel')
    } else {
      router.push('/painel')
    }
  }

  const [selectedPlan, setSelectedPlan] = useState<{ title: string; price: number; tipo: string } | null>(null)

  const handlePlanClick = async (plan: { title: string; price: number; tipo: string }) => {
    if (!isAuthenticated) {
      setSelectedPlan(plan)
      setShowLoginDialog(true)
      return
    }

    // Gerar pagamento e QR code
    await generatePayment(plan)
  }

  const generatePayment = async (plan: { title: string; price: number; tipo: string }) => {
    setIsGeneratingPayment(true)
    try {
      const response = await api.post('/api/payment/intent', {
        tipo: plan.tipo,
        paymentGateway: 'asaas'
      })

      if (response.data.qrCode || response.data.pixCopyPaste) {
        setQrCodeData({
          qrCode: response.data.qrCode || '',
          pixCopyPaste: response.data.pixCopyPaste || '',
          amount: response.data.amount,
          tipo: plan.tipo,
          paymentId: response.data.paymentId,
          gatewayPaymentId: response.data.gatewayPaymentId || response.data.clientSecret || response.data.paymentId,
          paymentGateway: response.data.paymentGateway || 'asaas'
        })
        setShowQrCodeDialog(true)
      } else {
        toast.error('Erro ao gerar QR code. Tente novamente.')
      }
    } catch (error: any) {
      console.error('Erro ao gerar pagamento:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao gerar pagamento. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsGeneratingPayment(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (isRegisterMode) {
        const name = formData.get('name') as string
        await register(name, email, password)
        toast.success('Cadastro realizado com sucesso!')
      } else {
        await login(email, password)
        toast.success('Login realizado com sucesso!')
      }
      setShowLoginDialog(false)
      setIsRegisterMode(false)
      
      // Se havia um plano selecionado, gerar o pagamento agora
      if (selectedPlan) {
        setTimeout(() => {
          generatePayment(selectedPlan)
        }, 500)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login/cadastro')
    }
  }

  const copyPixCode = () => {
    if (qrCodeData?.pixCopyPaste) {
      navigator.clipboard.writeText(qrCodeData.pixCopyPaste)
      toast.success('Código PIX copiado!')
    }
  }

  const checkPaymentStatus = async () => {
    if (!qrCodeData?.paymentId || !qrCodeData?.gatewayPaymentId || !qrCodeData?.paymentGateway) {
      toast.error('Dados de pagamento incompletos')
      return
    }

    setIsCheckingPayment(true)
    try {
      const response = await api.post('/api/payment/confirm', {
        paymentId: qrCodeData.paymentId,
        gatewayPaymentId: qrCodeData.gatewayPaymentId,
        paymentGateway: qrCodeData.paymentGateway
      })

      if (response.data.payment?.status === 'completed') {
        toast.success('Pagamento confirmado com sucesso!')
        setShowQrCodeDialog(false)
        // Redirecionar para o painel
        router.push('/painel?payment=success')
      } else {
        toast.error('Pagamento ainda não foi confirmado. Tente novamente em alguns instantes.')
      }
    } catch (error: any) {
      console.error('Erro ao verificar pagamento:', error)
      const errorMessage = error.response?.data?.error || 'Erro ao verificar pagamento'
      if (errorMessage.includes('não confirmado')) {
        toast.error('Pagamento ainda não foi confirmado. Aguarde alguns instantes e tente novamente.')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoadingGoogle(true)
    setGoogleError('')

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      setGoogleError('Login com Google não configurado. Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID no arquivo .env.local')
      setIsLoadingGoogle(false)
      return
    }

    // Aguardar o script do Google carregar
    const checkGoogle = setInterval(() => {
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        clearInterval(checkGoogle)
        
        try {
          // Usar o Google Identity Services OAuth2
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'openid email profile',
            callback: async (tokenResponse: any) => {
              try {
                if (tokenResponse.error) {
                  throw new Error(tokenResponse.error)
                }

                // Obter informações do usuário
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                })

                if (!userInfoResponse.ok) {
                  throw new Error('Erro ao obter informações do usuário')
                }

                const userInfo = await userInfoResponse.json()

                // Enviar para o backend
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
                const backendResponse = await fetch(`${apiUrl}/auth/google`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    idToken: tokenResponse.access_token,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                  }),
                })

                if (!backendResponse.ok) {
                  let errorMessage = 'Erro ao fazer login com Google'
                  try {
                    const errorData = await backendResponse.json()
                    errorMessage = errorData.error || errorMessage
                  } catch {
                    errorMessage = `Erro ${backendResponse.status}: ${backendResponse.statusText}`
                  }
                  throw new Error(errorMessage)
                }

                const data = await backendResponse.json()
                
                if (data.token && data.user) {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                  }
                  
                  // Atualizar contexto e buscar perfil atualizado
                  if (refreshUser) {
                    try {
                      await refreshUser()
                    } catch (err) {
                      console.error('Erro ao atualizar perfil:', err)
                    }
                  }
                  
                  // Fechar modal e continuar com o fluxo de pagamento
                  setIsLoadingGoogle(false)
                  setShowLoginDialog(false)
                  toast.success('Login com Google realizado com sucesso!')
                  
                  // Se havia um plano selecionado, gerar o pagamento agora
                  if (selectedPlan) {
                    setTimeout(() => {
                      generatePayment(selectedPlan)
                    }, 500)
                  }
                } else {
                  throw new Error('Resposta inválida do servidor')
                }
              } catch (err: any) {
                console.error('Erro no login Google:', err)
                setGoogleError(err.message || 'Erro ao fazer login com Google')
                setIsLoadingGoogle(false)
              }
            },
          })

          tokenClient.requestAccessToken()
        } catch (err: any) {
          console.error('Erro ao inicializar Google OAuth:', err)
          setGoogleError('Erro ao inicializar login com Google')
          setIsLoadingGoogle(false)
        }
      }
    }, 100)

    // Timeout após 5 segundos
    setTimeout(() => {
      clearInterval(checkGoogle)
      if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
        setGoogleError('Erro ao carregar Google Sign-In. Verifique sua conexão e tente novamente.')
        setIsLoadingGoogle(false)
      }
    }, 5000)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background animado */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`} />
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex ? (theme === 'dark' ? 'opacity-20' : 'opacity-25') : 'opacity-0'
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-t from-black/60 via-transparent to-black/40' : 'bg-gradient-to-t from-white/40 via-transparent to-white/30'}`} />
        
        {/* Partículas flutuantes */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#1E5AA8]/20'} rounded-full animate-pulse`}
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

      {/* Header */}
      <header className={`relative z-50 border-b ${theme === 'dark' ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white/80'} backdrop-blur-xl`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-10 h-10 rounded-lg shadow-2xl" />
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              E-Confere
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login?redirect=/">
              <div className="relative">
                <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white shadow-lg hover:scale-110 transition-all duration-300 border-0">
                  Login
                </Button>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>
            </Link>
            <div className="relative">
              <Button 
                onClick={handleMeuPainelClick}
                className="bg-[#1E5AA8] hover:bg-[#164A96] text-white shadow-lg hover:scale-110 transition-all duration-300 border-0"
              >
                Meu Painel
              </Button>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo Principal */}
            <div className="mb-12">
              <div className="relative inline-block">
                <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-32 h-32 rounded-3xl shadow-2xl mx-auto mb-8" />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  E-Confere
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} max-w-4xl mx-auto leading-relaxed`}>
                Análise inteligente de documentos imobiliários com{' '}
                <span className="bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] bg-clip-text text-transparent font-semibold">
                  Inteligência Artificial
                </span>
              </p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Card 
                    key={service.id}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl border-0 ${
                      theme === 'dark' ? 'bg-white/10' : 'bg-white/80'
                    } backdrop-blur-xl ${
                      theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-white/90'
                    } ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="relative mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:scale-125 transition-all duration-500 shadow-2xl`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className={`absolute -inset-2 bg-gradient-to-r ${service.gradient} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                      </div>
                      <CardTitle className={`text-xl font-bold ${theme === 'dark' ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-[#1E5AA8]'} transition-colors duration-300`}>
                        {service.title}
                      </CardTitle>
                      <CardDescription className={`${theme === 'dark' ? 'text-white/70 group-hover:text-white/90' : 'text-gray-600 group-hover:text-gray-800'} transition-colors duration-300`}>
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-center">
                        {service.free && !hasFreeAnalysis ? (
                          <Badge className={`${
                            theme === 'dark' 
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                              : 'bg-green-600 text-white border border-green-700 shadow-lg'
                          }`}>
                            Grátis 1x/semana
                          </Badge>
                        ) : service.free && hasFreeAnalysis ? null : (
                          <Badge className={`${
                            theme === 'dark' 
                              ? 'bg-[#1E5AA8]/20 text-[#2B6BC0] border border-[#1E5AA8]/30' 
                              : 'bg-[#1E5AA8] text-white border border-[#164A96] shadow-lg'
                          }`}>
                            Análise premium
                          </Badge>
                        )}
                      </div>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button className="w-full bg-[#1E5AA8] hover:bg-[#164A96] text-white">
                          Analisar Agora
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={`relative z-10 py-20 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-xl`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
              Como Funciona
            </h2>
            <p className={`text-2xl ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'} max-w-4xl mx-auto leading-relaxed`}>
              Compre imóveis com segurança! Analise a matrícula ou contrato antes de comprar em segundos com nossa{' '}
              <span className="bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] bg-clip-text text-transparent font-semibold">
                Inteligência Artificial
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Upload,
                title: 'Faça upload do seu documento',
                description: 'Envie seu documento em PDF de forma segura',
                gradient: 'from-[#1E5AA8] to-[#2B6BC0]',
                delay: '0ms'
              },
              {
                icon: Zap,
                title: 'IA analisa o conteúdo',
                description: 'Nossa IA extrai cláusulas perigosas e importantes ou te alerta em caso de ônus',
                gradient: 'from-purple-500 to-pink-500',
                delay: '200ms'
              },
              {
                icon: FileCheck,
                title: 'Você recebe um relatório em PDF',
                description: 'Relatório completo pronto em segundos',
                gradient: 'from-green-500 to-emerald-500',
                delay: '400ms'
              },
              {
                icon: Shield,
                title: 'Compre com segurança',
                description: 'Faça sua primeira análise contratual gratuitamente',
                gradient: 'from-orange-500 to-red-500',
                delay: '600ms'
              }
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index} 
                  className="text-center group"
                  style={{ animationDelay: step.delay }}
                >
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mx-auto group-hover:scale-125 transition-all duration-500 shadow-2xl`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className={`absolute -inset-3 bg-gradient-to-r ${step.gradient} rounded-3xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-[#1E5AA8]'} mb-4 transition-colors duration-300`}>
                    {step.title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-white/70 group-hover:text-white/90' : 'text-gray-600 group-hover:text-gray-800'} text-lg leading-relaxed transition-colors duration-300`}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-16">
            <div className="relative inline-block">
              <Button className="bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-6 shadow-2xl hover:scale-105 transition-all duration-300">
                <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                Começar Análise Gratuita
              </Button>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-30 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`relative z-10 py-20 ${theme === 'dark' ? 'bg-gradient-to-br from-black/30 to-purple-900/30' : 'bg-gradient-to-br from-white/30 to-blue-100/30'} backdrop-blur-xl`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
              Preços Transparentes
            </h2>
            <p className={`text-2xl ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
              Pague apenas pelo que usar, sem mensalidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Análise de Matrícula',
                subtitle: 'Urbana e Rural',
                price: 14.99,
                tipo: 'analise-matricula',
                icon: FileText,
                gradient: 'from-[#1E5AA8] to-[#2B6BC0]',
                features: ['Análise completa de ônus', 'Relatório em PDF', 'Resultado em segundos'],
                popular: false
              },
              {
                title: 'Análise de Contrato',
                subtitle: 'Todos os tipos',
                price: 9.99,
                tipo: 'analise-contrato',
                icon: FileCheck,
                gradient: 'from-green-500 to-emerald-500',
                features: ['Análise de cláusulas perigosas', 'Identificação de riscos', 'GRÁTIS 1x por dia!'],
                popular: true
              },
              {
                title: 'Análise de Transcrição de Matricula',
                subtitle: 'Análise especializada',
                price: 19.99,
                tipo: 'analise-transcricao',
                icon: FileText,
                gradient: 'from-purple-500 to-pink-500',
                features: ['Análise histórica', 'Verificação de origem', 'Relatório especializado'],
                popular: false
              }
            ].map((plan, index) => {
              const Icon = plan.icon
              return (
                <Card 
                  key={index}
                  className={`relative border-0 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/80 hover:bg-white/90'} backdrop-blur-xl transition-all duration-500 hover:scale-105 shadow-2xl ${
                    plan.popular ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 shadow-lg">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto shadow-2xl`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className={`absolute -inset-3 bg-gradient-to-r ${plan.gradient} rounded-3xl blur opacity-30`} />
                    </div>
                    <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {plan.title}
                    </CardTitle>
                    <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                      {plan.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        R$ {plan.price.toFixed(2)}
                      </span>
                      <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
                        Por análise
                      </p>
                      {plan.popular && (
                        <p className="text-green-400 font-semibold mt-2 text-lg">
                          GRÁTIS 1x por dia!
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-center ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handlePlanClick(plan)}
                      disabled={isGeneratingPayment}
                      className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 shadow-lg text-lg py-6 hover:scale-105 transition-all duration-300`}
                    >
                      {isGeneratingPayment ? 'Gerando pagamento...' : 'Começar Agora'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 ${theme === 'dark' ? 'bg-black/40 text-white' : 'bg-white/80 text-gray-900'} backdrop-blur-xl py-16 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-10 h-10 rounded-xl shadow-2xl" />
                <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  E-Confere
                </span>
              </div>
              <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} leading-relaxed`}>
                Análise inteligente de documentos imobiliários com Inteligência Artificial
              </p>
            </div>
            
            <div>
              <h3 className={`font-bold text-xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Acesso Rápido</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/login?redirect=/" className={`${theme === 'dark' ? 'text-white/70 hover:text-[#2B6BC0]' : 'text-gray-600 hover:text-[#1E5AA8]'} transition-colors duration-300 flex items-center`}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Login / Cadastro
                  </Link>
                </li>
                <li>
                  <button onClick={handleMeuPainelClick} className={`${theme === 'dark' ? 'text-white/70 hover:text-[#2B6BC0]' : 'text-gray-600 hover:text-[#1E5AA8]'} transition-colors duration-300 flex items-center`}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Meu Painel
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-bold text-xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Serviços</h3>
              <ul className="space-y-3">
                <li className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Análise de Matrícula</li>
                <li className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Análise de Contrato</li>
                <li className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Transcrição</li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-bold text-xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contato</h3>
              <ul className="space-y-3">
                <li className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>contato@e-confere.com</li>
                <li className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>(11) 9999-9999</li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} mt-12 pt-8 text-center ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
            <p>&copy; 2024 E-Confere. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Dialog de Login/Cadastro */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className={theme === 'dark' ? 'bg-gray-900 text-white' : ''}>
          <DialogHeader>
            <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
              Login ou Cadastro
            </DialogTitle>
            <DialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
              Faça login ou crie uma conta para continuar
            </DialogDescription>
          </DialogHeader>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className={`w-full h-12 ${theme === 'dark' ? 'text-white border-white/20 hover:bg-white/10' : 'text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm transition-all duration-200`}
          >
            {isLoadingGoogle ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                <span>Carregando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </div>
            )}
          </Button>

          {googleError && (
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
              <p className="text-sm">{googleError}</p>
            </div>
          )}

          <div className="relative">
            <div className={`absolute inset-0 flex items-center ${theme === 'dark' ? 'border-white/20' : 'border-gray-300'}`}>
              <div className={`w-full border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === 'dark' ? 'bg-gray-900 text-white/70' : 'bg-white text-gray-500'}`}>ou</span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <Label htmlFor="name" className={theme === 'dark' ? 'text-white' : ''}>
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegisterMode}
                  className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}
                  placeholder="Seu nome completo"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className={theme === 'dark' ? 'text-white' : ''}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className={theme === 'dark' ? 'text-white' : ''}>
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}
                placeholder="Sua senha"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-[#1E5AA8] hover:bg-[#164A96] text-white"
              >
                {isRegisterMode ? 'Cadastrar' : 'Login'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                variant="outline"
                className="flex-1"
              >
                {isRegisterMode ? 'Já tenho conta' : 'Criar conta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de QR Code */}
      <Dialog open={showQrCodeDialog} onOpenChange={setShowQrCodeDialog}>
        <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
          <DialogHeader>
            <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
              Pagamento via PIX
            </DialogTitle>
            <DialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
              Escaneie o QR code ou copie o código PIX para pagar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeData && (
              <>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    R$ {qrCodeData.amount.toFixed(2)}
                  </p>
                </div>
                {qrCodeData.qrCode && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img 
                      src={`data:image/png;base64,${qrCodeData.qrCode}`} 
                      alt="QR Code PIX" 
                      className="w-64 h-64"
                    />
                  </div>
                )}
                {qrCodeData.pixCopyPaste && (
                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-white' : ''}>
                      Código PIX (Copiar e Colar)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={qrCodeData.pixCopyPaste}
                        readOnly
                        className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}
                      />
                      <Button
                        onClick={copyPixCode}
                        variant="outline"
                        size="icon"
                        className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
                  Após realizar o pagamento, clique no botão abaixo para confirmar
                </p>
                <Button
                  onClick={checkPaymentStatus}
                  disabled={isCheckingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isCheckingPayment ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verificando pagamento...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Já paguei - Confirmar pagamento
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
