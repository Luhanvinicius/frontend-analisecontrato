/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Desabilitar geração estática para evitar erros de prerendering
  output: undefined, // Não usar 'export' para evitar static export
  // Forçar renderização dinâmica em todas as rotas
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
