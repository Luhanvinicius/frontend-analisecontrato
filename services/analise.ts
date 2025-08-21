// services/analise.ts
import { api } from "./api";


export async function enviarParaAnalise(tipo: string, arquivo: File, force = false) {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  formData.append("tipo", tipo); // <-- seu controller espera assim

  const url = `/api/analise${force ? "?force=true" : ""}`;

  const resp = await api.post(url, formData, {
    responseType: "blob",
  });

  return resp.data as Blob;
}
export async function enviarDocumento(tipo: string, file: File) {
  const formData = new FormData();
  formData.append("arquivo", file); // nome TEM QUE SER "arquivo"
  formData.append("tipo", tipo);

  // durante os testes, adiciona ?force=true
  return api.post("/api/analise?force=true", formData, { responseType: "blob" });
}