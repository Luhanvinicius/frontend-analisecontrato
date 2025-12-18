'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, X, Sparkles, Zap, Shield, Loader2, QrCode, Copy } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth-context'
import { enviarDocumento } from "@/services/analise"   // <-- import único, no topo
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { api } from '@/services/api'

// MAPEAMENTO (UI -> enum do back)
const tipoMap: Record<string, string> = {
  "matricula-urbana": "MATRICULA_URBANA",
  "matricula-rural": "MATRICULA_RURAL",
  "contrato-urbano": "CONTRATO_IMOVEL_URBANO",
  "contrato-rural": "CONTRATO_IMOVEL_RURAL",
  "contrato-aluguel": "CONTRATO_ALUGUEL",
  "contrato-permuta": "PERMUTA",
  "transcricao-matricula": "TRANSCRICAO"
}

const serviceTypes = [
  { id: 'matricula-urbana', name: 'Matrícula Urbana', price: 39.99, gradient: 'from-[#1E5AA8] to-[#2B6BC0]' },
  { id: 'matricula-rural', name: 'Matrícula Rural', price: 39.99, gradient: 'from-green-500 to-emerald-500' },
  { id: 'contrato-urbano', name: 'Contrato Urbano', price: 29.99, free: true, gradient: 'from-purple-500 to-pink-500' },
  { id: 'contrato-rural', name: 'Contrato Rural', price: 29.99, free: true, gradient: 'from-emerald-500 to-green-500' },
  { id: 'contrato-aluguel', name: 'Contrato de Aluguel', price: 29.99, free: true, gradient: 'from-orange-500 to-red-500' },
  { id: 'contrato-permuta', name: 'Contrato de Permuta', price: 29.99, free: true, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'transcricao-matricula', name: 'Transcrição de Matrícula', price: 49.99, gradient: 'from-red-500 to-pink-500' }
]

export default function UploadPage() {
  const [selectedService, setSelectedService] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportProgress, setReportProgress] = useState(0)
  const [hasFreeAnalysis, setHasFreeAnalysis] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; pixCopyPaste: string; amount: number; tipo: string; paymentId?: string; gatewayPaymentId?: string; paymentGateway?: string } | null>(null)
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service')
  const { theme } = useTheme()
  const { isAdmin, isAuthenticated } = useAuth()

  // Preseleciona serviço vindo da query string
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService)
    }
  }, [preSelectedService])

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
      simulateUpload()
    } else {
      alert('Envie um arquivo PDF.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  })

  // Apenas visual: barra de "upload" simulada
  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Gerar pagamento e QR code
  const generatePayment = async () => {
    if (!selectedService) return
    
    const tipoParaBack = tipoMap[selectedService] ?? selectedService
    
    setIsGeneratingPayment(true)
    try {
      const response = await api.post('/api/payment/intent', {
        tipo: tipoParaBack,
        paymentGateway: 'asaas'
      })

      console.log('Resposta do pagamento:', {
        hasQrCode: !!response.data.qrCode,
        qrCodeType: response.data.qrCode ? (response.data.qrCode.startsWith('data:') ? 'data-uri' : 'raw') : 'null',
        qrCodePreview: response.data.qrCode ? response.data.qrCode.substring(0, 50) + '...' : 'null',
        hasPixCopyPaste: !!response.data.pixCopyPaste,
        amount: response.data.amount
      });

      if (response.data.qrCode || response.data.pixCopyPaste) {
        // Garantir que o QR code está no formato correto (data:image/png;base64,...)
        let qrCodeFormatted = response.data.qrCode || '';
        if (qrCodeFormatted && !qrCodeFormatted.startsWith('data:image')) {
          // Se não tem o prefixo, adicionar
          qrCodeFormatted = `data:image/png;base64,${qrCodeFormatted}`;
        }

        setQrCodeData({
          qrCode: qrCodeFormatted,
          pixCopyPaste: response.data.pixCopyPaste || '',
          amount: response.data.amount,
          tipo: tipoParaBack,
          paymentId: response.data.paymentId,
          gatewayPaymentId: response.data.gatewayPaymentId || response.data.clientSecret || response.data.paymentId,
          paymentGateway: response.data.paymentGateway || 'asaas'
        })
        setShowPaymentDialog(true)
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

  // Confirmar pagamento
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
        toast.success('Pagamento confirmado! Agora você pode gerar o relatório.')
        setPaymentConfirmed(true)
        setShowPaymentDialog(false)
        setQrCodeData(null)
        // Gerar relatório automaticamente após pagamento confirmado
        handleAnalyzeAfterPayment()
      } else {
        toast.error('Pagamento ainda não confirmado. Aguarde alguns instantes e tente novamente.')
      }
    } catch (error: any) {
      console.error('Erro ao verificar pagamento:', error)
      toast.error('Erro ao verificar pagamento. Tente novamente.')
    } finally {
      setIsCheckingPayment(false)
    }
  }

  // Copiar código PIX
  const copyPixCode = () => {
    if (qrCodeData?.pixCopyPaste) {
      navigator.clipboard.writeText(qrCodeData.pixCopyPaste)
      toast.success('Código PIX copiado!')
    }
  }

  // Handler para gerar relatório após pagamento confirmado
  const handleAnalyzeAfterPayment = async () => {
    if (!selectedService || !uploadedFile) return
    
    const tipoParaBack = tipoMap[selectedService] ?? selectedService
    
    try {
      setIsGeneratingReport(true)
      setReportProgress(0)

      const progressInterval = setInterval(() => {
        setReportProgress(prev => {
          if (prev >= 90) {
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Após pagamento, sempre enviar com force=true
      const res = await enviarDocumento(tipoParaBack, uploadedFile, true)

      clearInterval(progressInterval)
      setReportProgress(95)

      const pdfBlob = new Blob([res.data], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      
      setReportProgress(100)
      setUploadComplete(true)
      
      setTimeout(async () => {
        setIsGeneratingReport(false)
        setReportProgress(0)
        
        const selectedServiceData = serviceTypes.find(s => s.id === selectedService)
        const valor = selectedServiceData?.price || 0
        
        router.push(`/analise-sucesso?tipo=${encodeURIComponent(tipoParaBack)}&valor=${valor}&fileName=${encodeURIComponent(uploadedFile.name)}`)
      }, 1500)
    } catch (e: any) {
      setIsGeneratingReport(false)
      setReportProgress(0)
      toast.error("Não foi possível gerar o relatório. Tente novamente.")
    }
  }

  // === Handler que chama o backend e baixa o PDF ===
  const handleAnalyze = async () => {
    if (!selectedService) {
      alert("Selecione o tipo de documento.")
      return
    }
    if (!uploadedFile) {
      alert("Envie um arquivo PDF.")
      return
    }

    const tipoParaBack = tipoMap[selectedService] ?? selectedService
    const selectedServiceData = serviceTypes.find(s => s.id === selectedService)

    // Verificar se o serviço é gratuito e se o usuário já usou a análise gratuita
    if (selectedServiceData?.free && hasFreeAnalysis) {
      // Se já usou a análise gratuita, abrir modal de pagamento
      toast.error('Você já usou sua análise gratuita desta semana. Realize o pagamento para continuar.')
      generatePayment()
      return
    }

    try {
      setIsGeneratingReport(true)
      setReportProgress(0)

      // Simular progresso enquanto a requisição está sendo feita
      const progressInterval = setInterval(() => {
        setReportProgress(prev => {
          if (prev >= 90) {
            return 90 // Para em 90% até a requisição terminar
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Se o serviço é gratuito e o usuário ainda não usou, enviar sem force=true
      // Se não é gratuito ou já usou, enviar com force=true (requer pagamento)
      const forcePayment = !selectedServiceData?.free || hasFreeAnalysis
      
      const res = await enviarDocumento(tipoParaBack, uploadedFile, forcePayment)

      clearInterval(progressInterval)
      setReportProgress(95)

      // Monta blob a partir do arraybuffer/blob e baixa
      const pdfBlob = new Blob([res.data], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      
      setReportProgress(100)
      setUploadComplete(true)
      
      // Fechar modal e redirecionar para página de sucesso
      setTimeout(async () => {
        setIsGeneratingReport(false)
        setReportProgress(0)
        
        // Atualizar status de análise gratuita após gerar
        if (isAuthenticated) {
          try {
            const { verificarAnaliseGratuita } = await import('@/services/analise')
            const data = await verificarAnaliseGratuita()
            // hasFreeAnalysis do backend retorna true se PODE usar (não usou ainda)
            // Então invertemos para saber se JÁ usou
            setHasFreeAnalysis(!data.hasFreeAnalysis)
          } catch (error) {
            console.error('Erro ao verificar análise gratuita:', error)
          }
        }
        
        // Obter dados do serviço selecionado
        const selectedServiceData = serviceTypes.find(s => s.id === selectedService)
        const valor = selectedServiceData?.price || 0
        
        // Redirecionar para página de sucesso
        router.push(`/analise-sucesso?tipo=${encodeURIComponent(tipoParaBack)}&valor=${valor}&fileName=${encodeURIComponent(uploadedFile.name)}`)
      }, 1500)
    } catch (e: any) {
      setIsGeneratingReport(false)
      setReportProgress(0)
      
      // Se o erro for 402 (Payment Required), redirecionar para pagamento
      if (e?.response?.status === 402 && e?.response?.data?.requiresPayment) {
        toast.error('Análise gratuita já utilizada esta semana. Realize o pagamento para continuar.')
        router.push(`/?service=${selectedService}&payment=true`)
        return
      }
      
      try {
        const raw = e?.response?.data
        let msg = "Não foi possível gerar o relatório."
        if (raw instanceof Blob) {
          msg = await new Response(raw).text()
        } else if (raw instanceof ArrayBuffer) {
          msg = new TextDecoder().decode(new Uint8Array(raw))
        } else if (typeof raw === "string") {
          msg = raw
        } else if (e?.message) {
          msg = e.message
        }
        toast.error(msg)
      } catch {
        toast.error("Não foi possível gerar o relatório. Verifique o backend e tente novamente.")
      }
    }
  }

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService)

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
            <Link href="/painel">
              <div className="relative">
                <Button className="bg-[#1E5AA8] hover:bg-[#164A96] text-white shadow-lg hover:scale-110 transition-all duration-300 border-0">
                  Meu Painel
                </Button>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
              Upload do Documento
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
              Envie seu documento em PDF para análise com IA
            </p>
          </div>

          <Card className={`border-0 shadow-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'} backdrop-blur-xl`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl flex items-center`}>
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                Dados da Análise
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                Selecione o tipo de documento e faça o upload
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Seleção do Serviço */}
              <div className="space-y-3">
                <label className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Tipo de Documento
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className={`h-14 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'} backdrop-blur-sm`}>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent className={`${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} w-full`}>
                    {serviceTypes.map(service => (
                      <SelectItem 
                        key={service.id} 
                        value={service.id} 
                        className={`${theme === 'dark' ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-100'} cursor-pointer`}
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="flex-1">{service.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="font-semibold whitespace-nowrap">R$ {service.price.toFixed(2)}</span>
                            {service.free && !hasFreeAnalysis && (
                              <span className={`text-xs px-2 py-1 rounded border whitespace-nowrap ${
                                theme === 'dark' 
                                  ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                                  : 'bg-green-600 text-white border-green-700'
                              }`}>
                                Grátis 1x/semana
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Area */}
              <div className="space-y-3">
                <label className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Documento PDF
                </label>
                
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive 
                        ? 'border-[#1E5AA8] bg-[#1E5AA8]/10 scale-105' 
                        : theme === 'dark'
                          ? 'border-white/30 hover:border-[#1E5AA8]/50 hover:bg-white/5'
                          : 'border-gray-300 hover:border-[#1E5AA8]/50 hover:bg-[#1E5AA8]/5'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="relative">
                      <Upload className={`w-16 h-16 ${theme === 'dark' ? 'text-white/60' : 'text-gray-400'} mx-auto mb-6`} />
                      <div className="absolute -inset-4 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-full blur opacity-20 animate-pulse" />
                    </div>
                    {isDragActive ? (
                      <p className="text-[#1E5AA8] font-medium text-xl">
                        Solte o arquivo aqui...
                      </p>
                    ) : (
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium mb-3 text-xl`}>
                          Clique para selecionar ou arraste o arquivo
                        </p>
                        <p className={`${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} text-lg`}>
                          Apenas arquivos PDF são aceitos
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`border ${theme === 'dark' ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-gray-50'} rounded-2xl p-6 backdrop-blur-sm`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <FileText className="w-12 h-12 text-[#1E5AA8]" />
                          <div className="absolute -inset-2 bg-[#1E5AA8] rounded-lg blur opacity-20" />
                        </div>
                        <div>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg`}>
                            {uploadedFile.name}
                          </p>
                          <p className={theme === 'dark' ? 'text-white/60' : 'text-gray-500'}>
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null)
                          setUploadProgress(0)
                          setUploadComplete(false)
                        }}
                        className={`${theme === 'dark' ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    {isUploading && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>Enviando...</span>
                          <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className={`h-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                      </div>
                    )}

                    {uploadComplete && (
                      <div className="mt-6 flex items-center text-green-400">
                        <CheckCircle className="w-6 h-6 mr-3" />
                        <span className="font-medium text-lg">Upload concluído!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resumo do Serviço */}
              {selectedServiceData && (
                <div className={`bg-gradient-to-r ${selectedServiceData.gradient} bg-opacity-10 rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'} backdrop-blur-sm`}>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 text-xl flex items-center`}>
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                    Resumo do Serviço
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} text-lg`}>Serviço:</span>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg`}>
                        {selectedServiceData.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} text-lg`}>Valor:</span>
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl`}>
                          R$ {selectedServiceData.price.toFixed(2)}
                        </span>
                        {selectedServiceData.free && !hasFreeAnalysis && (
                          <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
                            Grátis esta semana!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Envio */}
              <div className="relative">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedService || !uploadedFile}
                  className="w-full h-16 bg-[#1E5AA8] hover:bg-[#164A96] text-white text-xl font-semibold shadow-2xl disabled:opacity-50 hover:scale-105 transition-all duration-300 border-0"
                >
                  {(!selectedService || !uploadedFile) ? (
                    'Selecione o serviço e faça upload do arquivo'
                  ) : (
                    'Gerar Relatório'
                  )}
                </Button>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1E5AA8] to-[#2B6BC0] rounded-lg blur opacity-0 hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Loading para Geração do Relatório */}
      <Dialog open={isGeneratingReport} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Gerando Relatório
            </DialogTitle>
            <DialogDescription className={`text-base ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              Processando seu documento com inteligência artificial...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <Loader2 className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-[#1E5AA8]'} animate-spin`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                  Progresso
                </span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(reportProgress)}%
                </span>
              </div>
              <Progress 
                value={reportProgress} 
                className={`h-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}
              />
            </div>
            <div className={`text-center text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
              {reportProgress < 30 && "Iniciando processamento..."}
              {reportProgress >= 30 && reportProgress < 60 && "Analisando documento..."}
              {reportProgress >= 60 && reportProgress < 90 && "Gerando relatório..."}
              {reportProgress >= 90 && reportProgress < 100 && "Finalizando..."}
              {reportProgress >= 100 && "Relatório gerado com sucesso!"}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento PIX */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Pagamento via PIX
            </DialogTitle>
            <DialogDescription className={`text-base ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              Escaneie o QR Code ou copie o código PIX para realizar o pagamento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {isGeneratingPayment ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-[#1E5AA8]'} animate-spin mb-4`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                  Gerando QR Code...
                </p>
              </div>
            ) : qrCodeData ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white' : 'bg-gray-50'}`}>
                    {qrCodeData.qrCode ? (
                      <img 
                        src={qrCodeData.qrCode} 
                        alt="QR Code PIX" 
                        className="w-64 h-64"
                        onError={(e) => {
                          console.error('Erro ao carregar QR code:', e);
                          console.error('QR Code data:', qrCodeData.qrCode?.substring(0, 100));
                          toast.error('Erro ao exibir QR code. Use o código PIX para copiar e colar.');
                        }}
                      />
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                        <p>QR Code não disponível</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div>
                      <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                        Valor: R$ {qrCodeData.amount.toFixed(2)}
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                        Código PIX (Copiar e Colar)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={qrCodeData.pixCopyPaste}
                          readOnly
                          className={`flex-1 font-mono text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
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
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={checkPaymentStatus}
                    disabled={isCheckingPayment}
                    className="w-full bg-[#1E5AA8] hover:bg-[#164A96] text-white"
                  >
                    {isCheckingPayment ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verificando pagamento...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Já paguei - Confirmar pagamento
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowPaymentDialog(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}