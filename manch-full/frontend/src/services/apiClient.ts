import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string }>) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE}/auth/refresh`, { refreshToken: refresh })
          localStorage.setItem('accessToken', data.accessToken)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
          return apiClient(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (error.response?.status === 403) {
      toast.error('You do not have permission to do this')
      return Promise.reject(error)
    }

    if (error.response?.status === 404) {
      return Promise.reject(error)
    }

    if (error.response?.status === 409) {
      toast.error(error.response?.data?.message ?? 'Already exists')
      return Promise.reject(error)
    }

    if (error.response) {
      const msg = error.response?.data?.message ?? 'Something went wrong'
      toast.error(msg)
    } else if (error.request) {
      toast.error('Cannot reach server. Is the backend running?')
    }

    return Promise.reject(error)
  }
)