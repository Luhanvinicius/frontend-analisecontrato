'use client'

// Forçar renderização dinâmica (sem prerendering)
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, CreditCard, Shield, Clock, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'

const serviceTypes = [
  { id: 'matricula-urbana', name: 'Análise de Matrícula Urbana', price: 14.99, gradient: 'from-[#1E5AA8] to-[#2B6BC0]' },
  { id: 'matricula-rural', name: 'Análise de Matrícula Rural', price: 14.99, gradient: 'from-green-500 to-emerald-500' },
  { id: 'contrato-urbano', name: 'Análise de Contrato Urbano', price: 9.99, gradient: 'from-purple-500 to-pink-500' },
  { id: 'contrato-rural', name: 'Análise de Contrato Rural', price: 9.99, gradient: 'from-emerald-500 to-green-500' },
  { id: 'contrato-aluguel', name: 'Análise de Contrato de Aluguel', price: 9.99, gradient: 'from-orange-500 to-red-500' },
  { id: 'contrato-permuta', name: 'Análise de Contrato de Permuta', price: 9.99, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'transcricao-matricula', name: 'Análise de Transcrição de Matrícula', price: 19.99, gradient: 'from-red-500 to-pink-500' }
]

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service')
  const fileName = searchParams.get('file')
  const { theme } = useTheme()

  const service = serviceTypes.find(s => s.id === serviceId)

  if (!service) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>Serviço não encontrado</h1>
          <Link href="/">
            <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      router.push(`/painel?payment=success&service=${serviceId}`)
    }, 3000)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background animado */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`} />
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
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

      {/* Header */}
      <header className={`relative z-50 border-b ${theme === 'dark' ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white/80'} backdrop-blur-xl`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo-econfere-nova.jpeg" alt="E-Confere" className="w-10 h-10 rounded-xl shadow-2xl" />
            <span className="text-2xl font-bold text-white">
              E-Confere
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
              Finalizar Pagamento
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
              Complete o pagamento para processar sua análise
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl`}>
                  <FileText className="w-6 h-6 mr-3 text-[#1E5AA8]" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`bg-gradient-to-r ${service.gradient} bg-opacity-10 rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 text-xl`}>
                    {service.name}
                  </h3>
                  
                  {fileName && (
                    <div className="mb-4">
                      <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-2`}>Arquivo:</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{fileName}</p>
                    </div>
                  )}

                  <div className={`flex justify-between items-center pt-4 border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                    <span className={`${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} text-lg`}>Valor:</span>
                    <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-green-400">
                    <Clock className="w-6 h-6 mr-3" />
                    <span>Resultado em segundos</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <Shield className="w-6 h-6 mr-3" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Relatório em PDF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Pagamento */}
            <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl`}>
                  <CreditCard className="w-6 h-6 mr-3 text-[#1E5AA8]" />
                  Dados do Cartão
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                  Seus dados estão protegidos com criptografia SSL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Nome no cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome como está no cartão"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      required
                      className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Número do cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
                        setPaymentData({...paymentData, cardNumber: value})
                      }}
                      maxLength={19}
                      required
                      className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Validade</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        value={paymentData.expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
                          setPaymentData({...paymentData, expiryDate: value})
                        }}
                        maxLength={5}
                        required
                        className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          setPaymentData({...paymentData, cvv: value})
                        }}
                        maxLength={4}
                        required
                        className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} backdrop-blur-sm`}
                      />
                    </div>
                  </div>

                  <Separator className={theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'} />

                  <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl p-6 mb-8 border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Total a pagar:</span>
                      <span className="text-[#1E5AA8]">R$ {service.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full h-16 bg-[#1E5AA8] hover:bg-[#164A96] text-white text-xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300 border-0"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="md" />
                          <span className="ml-3">Processando pagamento...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-3" />
                          Pagar R$ {service.price.toFixed(2)}
                        </>
                      )}
                    </Button>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
                  </div>

                  <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} text-center mt-6`}>
                    Ao confirmar o pagamento, você concorda com nossos termos de uso.
                    Seus dados estão protegidos.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
