import api from "@/lib/api";

export async function enviarDocumento(tipo: string, file: File) {
  const formData = new FormData();
  formData.append("arquivo", file); // nome TEM QUE SER "arquivo"
  formData.append("tipo", tipo);

  // durante os testes, adiciona ?force=true
  return api.post("/api/analise?force=true", formData, { responseType: "blob" });
}.