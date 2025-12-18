// services/analise.ts
import { api } from "./api";

export async function enviarParaAnalise(tipo: string, arquivo: File, force = false) {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  formData.append("tipo", tipo);

  const url = `/api/analise${force ? "?force=true" : ""}`;

  const resp = await api.post(url, formData, {
    responseType: "blob",
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return resp.data as Blob;
}

export async function enviarDocumento(tipo: string, file: File, force = false) {
  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append("tipo", tipo);

  console.log('Enviando documento para análise:', { tipo, fileName: file.name, fileSize: file.size, force });

  const url = force ? "/api/analise?force=true" : "/api/analise";
  
  return api.post(url, formData, { 
    responseType: "blob",
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 120 segundos (2 minutos) para esta requisição específica
  });
}

export async function buscarHistoricoAnalises() {
  const response = await api.get("/api/analise");
  return response.data.analyses || [];
}

export async function buscarAnalise(id: string) {
  const response = await api.get(`/api/analise/${id}`);
  return response.data.analysis;
}

export async function verificarAnaliseGratuita() {
  const response = await api.get("/api/analise/check-free");
  return response.data;
}