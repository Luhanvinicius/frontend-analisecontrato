'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Building, TreePine, Home, Key, RefreshCw, FileCheck, Upload, Zap, Shield, Clock, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    setIsVisible(true)
    
    // Rotacionar imagens de fundo
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleServiceClick = (serviceId: string) => {
    const isLoggedIn = false // Substituir por verificação real
    
    if (!isLoggedIn) {
      router.push(`/login?redirect=/upload?service=${serviceId}`)
    } else {
      router.push(`/upload?service=${serviceId}`)
    }
  }

  const handleMeuPainelClick = () => {
    const isLoggedIn = false // Substituir por verificação real de login
    
    if (!isLoggedIn) {
      router.push('/login?redirect=/painel')
    } else {
      router.push('/painel')
    }
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
                        {service.free ? (
                          <Badge className={`${
                            theme === 'dark' 
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                              : 'bg-green-600 text-white border border-green-700 shadow-lg'
                          }`}>
                            Grátis 1x/dia
                          </Badge>
                        ) : (
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
                icon: FileText,
                gradient: 'from-[#1E5AA8] to-[#2B6BC0]',
                features: ['Análise completa de ônus', 'Relatório em PDF', 'Resultado em segundos'],
                popular: false
              },
              {
                title: 'Análise de Contrato',
                subtitle: 'Todos os tipos',
                price: 9.99,
                icon: FileCheck,
                gradient: 'from-green-500 to-emerald-500',
                features: ['Análise de cláusulas perigosas', 'Identificação de riscos', 'GRÁTIS 1x por dia!'],
                popular: true
              },
              {
                title: 'Análise de Transcrição de Matricula',
                subtitle: 'Análise especializada',
                price: 19.99,
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
                    
                    <Button className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 shadow-lg text-lg py-6 hover:scale-105 transition-all duration-300`}>
                      Começar Agora
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
    </div>
  )
}
