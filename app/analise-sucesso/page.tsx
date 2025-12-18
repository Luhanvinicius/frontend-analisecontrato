'use client'

// Forçar renderização dinâmica (sem prerendering)
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, CreditCard, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth-context'

export default function AnaliseSucessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const { user } = useAuth()
  
  const tipo = searchParams.get('tipo')
  const valor = searchParams.get('valor')
  const fileName = searchParams.get('fileName')
  
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState(0)

  useEffect(() => {
    // Mapear tipo para nome do serviço
    const tipoMap: Record<string, { name: string; price: number }> = {
      'MATRICULA_URBANA': { name: 'Matrícula Urbana', price: 39.99 },
      'MATRICULA_RURAL': { name: 'Matrícula Rural', price: 39.99 },
      'CONTRATO_IMOVEL_URBANO': { name: 'Contrato Urbano', price: 29.99 },
      'CONTRATO_IMOVEL_RURAL': { name: 'Contrato Rural', price: 29.99 },
      'CONTRATO_ALUGUEL': { name: 'Contrato de Aluguel', price: 29.99 },
      'PERMUTA': { name: 'Contrato de Permuta', price: 29.99 },
      'TRANSCRICAO': { name: 'Transcrição de Matrícula', price: 49.99 },
    }

    if (tipo) {
      const service = tipoMap[tipo] || { name: tipo, price: parseFloat(valor || '0') }
      setServiceName(service.name)
      setServicePrice(service.price)
    } else if (valor) {
      setServicePrice(parseFloat(valor))
    }
  }, [tipo, valor])

  const handlePayment = () => {
    // Mapear tipo do backend para ID do frontend
    const tipoToIdMap: Record<string, string> = {
      'MATRICULA_URBANA': 'matricula-urbana',
      'MATRICULA_RURAL': 'matricula-rural',
      'CONTRATO_IMOVEL_URBANO': 'contrato-urbano',
      'CONTRATO_IMOVEL_RURAL': 'contrato-rural',
      'CONTRATO_ALUGUEL': 'contrato-aluguel',
      'PERMUTA': 'contrato-permuta',
      'TRANSCRICAO': 'transcricao-matricula',
    }
    
    const serviceId = tipo ? tipoToIdMap[tipo] || tipo.toLowerCase().replace(/_/g, '-') : ''
    
    // Redirecionar para página principal com o serviço selecionado e abrir modal de pagamento
    if (serviceId) {
      router.push(`/?service=${serviceId}&payment=true`)
    } else {
      router.push('/?payment=true')
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background animado */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`} />
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
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-10 h-10 rounded-xl shadow-2xl" />
            <span className="text-2xl font-bold text-white">
              E-Confere
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/painel">
              <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white">
                Meu Painel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'} flex items-center justify-center`}>
                  <CheckCircle className={`w-16 h-16 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`}>
                Relatório Gerado com Sucesso!
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                Seu documento foi analisado e o relatório foi baixado automaticamente
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informações do Download */}
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center mb-4">
                  <Download className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Download Efetuado
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                    <strong>Arquivo:</strong> {fileName || 'relatorio.pdf'}
                  </p>
                  <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                    <strong>Serviço:</strong> {serviceName || tipo}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                    O arquivo foi salvo na pasta de downloads do seu navegador.
                  </p>
                </div>
              </div>

              {/* Informações de Pagamento */}
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-400/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center mb-4">
                  <CreditCard className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Pagamento Pendente
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      Valor do serviço:
                    </span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      R$ {servicePrice.toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                    Para continuar utilizando nossos serviços, realize o pagamento do valor acima.
                  </p>
                  <Button
                    onClick={handlePayment}
                    className="w-full h-12 bg-[#1E5AA8] hover:bg-[#164A96] text-white text-lg font-semibold"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Realizar Pagamento
                  </Button>
                </div>
              </div>

              {/* Resumo do Serviço */}
              {serviceName && (
                <div className={`bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] bg-opacity-10 rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'} backdrop-blur-sm`}>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 text-xl flex items-center`}>
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                    Resumo do Serviço
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} text-lg`}>
                        Serviço:
                      </span>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg`}>
                        {serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} text-lg`}>
                        Valor:
                      </span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl`}>
                        R$ {servicePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handlePayment}
                  className="flex-1 h-12 bg-[#1E5AA8] hover:bg-[#164A96] text-white text-lg font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagar Agora
                </Button>
                <Link href="/painel" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao Painel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

