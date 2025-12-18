'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle, Plus, Sparkles, Zap, TrendingUp, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth-context'
import { buscarHistoricoAnalises } from '@/services/analise'
import { api } from '@/services/api'

export default function PainelPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const { logout, isAdmin } = useAuth()
  
  const searchParams = useSearchParams()
  const paymentSuccess = searchParams.get('payment') === 'success'
  const processedService = searchParams.get('processed')

  useEffect(() => {
    carregarAnalises()
  }, [])

  const carregarAnalises = async () => {
    try {
      setIsLoading(true)
      const dados = await buscarHistoricoAnalises()
      setAnalyses(dados)
    } catch (error) {
      console.error('Erro ao carregar análises:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (analysisId: string) => {
    try {
      const response = await api.get(`/api/analise/${analysisId}/download`, {
        responseType: 'blob',
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio_${analysisId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar relatório:', error)
      alert('Erro ao baixar relatório')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  useEffect(() => {
    if (paymentSuccess || processedService) {
      setShowSuccessMessage(true)
      carregarAnalises()
      setTimeout(() => {
        setShowSuccessMessage(false)
        // Limpar parâmetro da URL após mostrar mensagem
        if (paymentSuccess) {
          window.history.replaceState({}, '', '/painel')
        }
      }, 5000)
    }
  }, [paymentSuccess, processedService])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-400 animate-spin" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border border-green-400/30">Concluído</Badge>
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">Processando</Badge>
      case 'error':
        return <Badge className="bg-red-500/20 text-red-300 border border-red-400/30">Erro</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border border-gray-400/30">Pendente</Badge>
    }
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
              className={`absolute w-1 h-1 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#1E5AA8]/20'} rounded-full animate-pulse`}
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
            <Link href="/upload">
              <div className="relative">
                <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white shadow-lg hover:scale-110 transition-all duration-300 border-0">
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Análise
                </Button>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <div className="relative">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:scale-110 transition-all duration-300 border-0">
                    <Shield className="w-5 h-5 mr-2" />
                    Painel Admin
                  </Button>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
                </div>
              </Link>
            )}
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className={`relative overflow-hidden transition-all duration-300 border-0 bg-red-500 hover:bg-red-600 text-white hover:scale-110 hover:shadow-xl`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <LogOut className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Sair</span>
              </Button>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className={`mb-8 p-6 ${theme === 'dark' ? 'bg-green-500/10 border-green-400/30' : 'bg-green-50 border-green-200'} border rounded-2xl backdrop-blur-sm`}>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <p className={`${theme === 'dark' ? 'text-green-300' : 'text-green-700'} font-medium text-lg`}>
                {paymentSuccess ? 'Pagamento realizado com sucesso!' : 'Análise gratuita iniciada!'} 
                Sua análise está sendo processada.
              </p>
            </div>
          </div>
        )}

        {/* Header do Painel */}
        <div className="mb-12 text-center">
          <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Meu Painel
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
            Acompanhe suas análises e baixe os relatórios
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/15' : 'bg-white/90 hover:bg-white'} backdrop-blur-xl transition-all duration-300`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Total de Análises</p>
                  <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{analyses.length}</p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-2xl flex items-center justify-center shadow-2xl">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-2xl blur opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/15' : 'bg-white/90 hover:bg-white'} backdrop-blur-xl transition-all duration-300`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Concluídas</p>
                  <p className="text-4xl font-bold text-green-400">
                    {analyses.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/15' : 'bg-white/90 hover:bg-white'} backdrop-blur-xl transition-all duration-300`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Em Processamento</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {analyses.filter(a => a.status === 'processing').length}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Clock className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Análises */}
        <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl`}>
              <TrendingUp className="w-6 h-6 mr-3 text-[#1E5AA8]" />
              Histórico de Análises
            </CardTitle>
            <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
              Todas as suas análises realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5AA8] mx-auto"></div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Carregando análises...</p>
              </div>
            ) : analyses.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <FileText className={`w-20 h-20 ${theme === 'dark' ? 'text-white/30' : 'text-gray-300'} mx-auto`} />
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-full blur opacity-20" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Nenhuma análise encontrada
                </h3>
                <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-8 text-lg`}>
                  Faça sua primeira análise para começar
                </p>
                <Link href="/upload">
                  <div className="relative inline-block">
                    <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white text-lg px-8 py-4 hover:scale-105 transition-all duration-300">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Nova Análise
                    </Button>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`border ${theme === 'dark' ? 'border-white/20 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          {getStatusIcon(analysis.status)}
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-full blur opacity-20" />
                        </div>
                        <div>
                          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl`}>
                            {analysis.tipo || analysis.type}
                          </h3>
                          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                            {analysis.file_name || analysis.fileName}
                          </p>
                          <div className="flex items-center space-x-6 mt-3">
                            <div className={`flex items-center ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                              <Calendar className="w-5 h-5 mr-2" />
                              {new Date(analysis.created_at || analysis.date).toLocaleDateString('pt-BR')}
                            </div>
                            {getStatusBadge(analysis.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {analysis.status === 'completed' ? 'Análise concluída' : analysis.status === 'processing' ? 'Processando...' : analysis.status || 'Pendente'}
                          </p>
                        </div>
                        {analysis.status === 'completed' && (
                          <div className="relative">
                            <Button
                              className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover:scale-105 transition-all duration-300"
                              onClick={() => handleDownload(analysis.id)}
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Baixar PDF
                            </Button>
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
