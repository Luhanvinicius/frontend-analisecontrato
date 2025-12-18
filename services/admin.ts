import { api } from './api'

export interface AdminStats {
  stats: {
    totalUsers: number
    totalPayments: number
    totalAnalyses: number
    totalRevenue: number
  }
  recentUsers: Array<{
    id: string
    name: string
    email: string
    created_at: string
  }>
  recentPayments: Array<{
    id: string
    amount: number
    status: string
    created_at: string
    user_name: string
    user_email: string
  }>
  monthlyStats: Array<{
    month: string
    count: number
    revenue: number
  }>
}

export interface User {
  id: string
  name: string
  email: string
  email_verified: boolean
  role: 'user' | 'admin'
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  user_name: string
  user_email: string
  analysis_type?: string
  amount: number
  currency: string
  payment_method: string
  payment_gateway: string
  status: string
  created_at: string
}

export interface Analysis {
  id: string
  user_id: string
  user_name: string
  user_email: string
  tipo: string
  file_name: string
  status: string
  is_free: boolean
  created_at: string
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/api/admin/stats')
    return response.data
  },

  async getUsers(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (search) params.append('search', search)
    
    const response = await api.get(`/api/admin/users?${params}`)
    return response.data
  },

  async getUserById(id: string) {
    const response = await api.get(`/api/admin/users/${id}`)
    return response.data
  },

  async updateUserRole(id: string, role: 'user' | 'admin') {
    const response = await api.patch(`/api/admin/users/${id}/role`, { role })
    return response.data
  },

  async deleteUser(id: string) {
    const response = await api.delete(`/api/admin/users/${id}`)
    return response.data
  },

  async getPayments(page: number = 1, limit: number = 20, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (status) params.append('status', status)
    
    const response = await api.get(`/api/admin/payments?${params}`)
    return response.data
  },

  async getAnalyses(page: number = 1, limit: number = 20, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (status) params.append('status', status)
    
    const response = await api.get(`/api/admin/analyses?${params}`)
    return response.data
  },
}

