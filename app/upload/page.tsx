'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, X, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useTheme } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/theme-toggle'
import { enviarDocumento } from "@/services/analise"   // <-- import único, no topo

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

  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service')
  const { theme } = useTheme()

  // Preseleciona serviço vindo da query string
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService)
    }
  }, [preSelectedService])

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

    try {
      setIsUploading(true)

      const res = await enviarDocumento(tipoParaBack, uploadedFile)

      // Monta blob a partir do arraybuffer/blob e baixa
      const pdfBlob = new Blob([res.data], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${Date.now()}.pdf` // <-- usa crase
      a.click()
      URL.revokeObjectURL(url)
      setUploadComplete(true)
    } catch (e: any) {
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
        alert(msg)
      } catch {
        alert("Não foi possível gerar o relatório. Verifique o backend e tente novamente.")
      }
    } finally {
      setIsUploading(false)
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
                  <SelectContent className={`${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
                    {serviceTypes.map(service => (
                      <SelectItem key={service.id} value={service.id} className={`${theme === 'dark' ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-100'}`}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <div className="flex items-center space-x-3 ml-6">
                            <span className="font-semibold">R$ {service.price.toFixed(2)}</span>
                            {service.free && (
                              <span className={`text-xs px-2 py-1 rounded border ${
                                theme === 'dark' 
                                  ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                                  : 'bg-green-600 text-white border-green-700'
                              }`}>
                                Grátis 1x/dia
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
                        {selectedServiceData.free && (
                          <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
                            Grátis hoje!
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
    </div>
  )
}