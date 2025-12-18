'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { adminService, Analysis } from '@/services/admin'
import { api } from '@/services/api'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminAnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadAnalyses()
  }, [page, statusFilter])

  const loadAnalyses = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAnalyses(
        page, 
        20, 
        statusFilter === 'all' ? undefined : statusFilter
      )
      setAnalyses(data.analyses)
      setTotalPages(data.pagination.totalPages)
    } catch (error: any) {
      console.error('Erro ao carregar análises:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      
      toast.success('Download iniciado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao baixar relatório:', error)
      const errorMessage = error.response?.data?.error || 'Erro ao baixar relatório'
      toast.error(errorMessage)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: any }> = {
      completed: { 
        className: 'bg-green-100 text-green-700', 
        label: 'Concluída',
        icon: CheckCircle
      },
      processing: { 
        className: 'bg-yellow-100 text-yellow-700', 
        label: 'Processando',
        icon: Clock
      },
      failed: { 
        className: 'bg-red-100 text-red-700', 
        label: 'Falhou',
        icon: XCircle
      },
    }
    const variant = variants[status] || variants.processing
    const Icon = variant.icon
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    )
  }

  const stats = {
    total: analyses.length,
    completed: analyses.filter(a => a.status === 'completed').length,
    processing: analyses.filter(a => a.status === 'processing').length,
    failed: analyses.filter(a => a.status === 'failed').length,
    free: analyses.filter(a => a.is_free).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Análises</h1>
        <p className="text-gray-600">Visualize e gerencie todas as análises do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Processando</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Falhas</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Gratuitas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.free}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Análises */}
      <Card>
        <CardHeader>
          <CardTitle>Análises</CardTitle>
          <CardDescription>Lista de todas as análises realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma análise encontrada</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{analysis.tipo}</p>
                          {getStatusBadge(analysis.status)}
                          {analysis.is_free && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Gratuita
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{analysis.file_name}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{analysis.user_name}</span>
                          <span>•</span>
                          <span>{analysis.user_email}</span>
                          <span>•</span>
                          <span>{formatDate(analysis.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {analysis.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(analysis.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

