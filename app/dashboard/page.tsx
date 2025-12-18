'use client'

// Forçar renderização dinâmica (sem prerendering)
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle, Plus, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

const mockAnalyses = [
  {
    id: '1',
    type: 'Matrícula Urbana',
    fileName: 'matricula_apartamento_centro.pdf',
    date: '2024-01-15',
    status: 'completed',
    result: 'Aprovado - Sem ônus encontrados',
    downloadUrl: '#'
  },
  {
    id: '2',
    type: 'Contrato Rural',
    fileName: 'contrato_fazenda_interior.pdf',
    date: '2024-01-14',
    status: 'completed',
    result: 'Atenção - Cláusula de revisão identificada',
    downloadUrl: '#'
  },
  {
    id: '3',
    type: 'Transcrição de Matrícula',
    fileName: 'transcricao_casa_praia.pdf',
    date: '2024-01-13',
    status: 'processing',
    result: 'Processando...',
    downloadUrl: null
  }
]

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState(mockAnalyses)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const { isAdmin } = useAuth()
  
  const searchParams = useSearchParams()
  const paymentSuccess = searchParams.get('payment') === 'success'
  const processedService = searchParams.get('processed')

  useEffect(() => {
    if (paymentSuccess || processedService) {
      setShowSuccessMessage(true)
      // Adicionar nova análise à lista
      const newAnalysis = {
        id: Date.now().toString(),
        type: processedService ? 'Análise Gratuita' : 'Análise Paga',
        fileName: 'documento_recente.pdf',
        date: new Date().toISOString().split('T')[0],
        status: 'processing' as const,
        result: 'Processando...',
        downloadUrl: null
      }
      setAnalyses(prev => [newAnalysis, ...prev])

      // Simular conclusão do processamento
      setTimeout(() => {
        setAnalyses(prev => prev.map(analysis => 
          analysis.id === newAnalysis.id 
            ? { ...analysis, status: 'completed' as const, result: 'Análise concluída com sucesso', downloadUrl: '#' }
            : analysis
        ))
      }, 5000)
    }
  }, [paymentSuccess, processedService])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-700">Processando</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700">Erro</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Confere
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/upload">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Análise
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
              </Link>
            )}
            <Button variant="outline">Sair</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">
                {paymentSuccess ? 'Pagamento realizado com sucesso!' : 'Análise gratuita iniciada!'} 
                Sua análise está sendo processada.
              </p>
            </div>
          </div>
        )}

        {/* Header do Dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meu Dashboard
          </h1>
          <p className="text-gray-600">
            Acompanhe suas análises e baixe os relatórios
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Análises</p>
                  <p className="text-3xl font-bold text-gray-800">{analyses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-3xl font-bold text-green-600">
                    {analyses.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Processamento</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {analyses.filter(a => a.status === 'processing').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Análises */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Histórico de Análises
            </CardTitle>
            <CardDescription>
              Todas as suas análises realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma análise encontrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Faça sua primeira análise para começar
                </p>
                <Link href="/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Análise
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(analysis.status)}
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {analysis.type}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {analysis.fileName}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(analysis.date).toLocaleDateString('pt-BR')}
                            </div>
                            {getStatusBadge(analysis.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            {analysis.result}
                          </p>
                        </div>
                        {analysis.downloadUrl && analysis.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Simular download
                              const link = document.createElement('a')
                              link.href = '/placeholder.pdf'
                              link.download = `relatorio_${analysis.id}.pdf`
                              link.click()
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar PDF
                          </Button>
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
