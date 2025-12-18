import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

export const api = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 segundos (2 minutos) de timeout
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Verificar se está no navegador antes de acessar localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Ignorar erros de localStorage durante build
      }
      // Não definir Content-Type para FormData, deixar o axios definir automaticamente
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar se já estiver na página de login ou se for rota admin (o layout admin já trata)
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname === '/login';
        const isAdminPage = window.location.pathname.startsWith('/admin');
        
        // Não redirecionar se for página admin (o layout admin já trata isso)
        if (!isLoginPage && !isAdminPage) {
          // Verificar se o token ainda existe (pode ser que tenha expirado)
          const token = localStorage.getItem('token');
          if (!token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);