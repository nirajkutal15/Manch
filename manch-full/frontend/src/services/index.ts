import { apiClient } from './apiClient'
import type { AuthResponse, GigResponse, ApplicationResponse, Page, UserDto } from '@/types'

export const authService = {
  register: (d: Record<string,unknown>) => apiClient.post<AuthResponse>('/auth/register', d).then(r=>r.data),
  login: (email: string, password: string) => apiClient.post<AuthResponse>('/auth/login', {email,password}).then(r=>r.data),
  me: () => apiClient.get<UserDto>('/auth/me').then(r=>r.data),
  refresh: (token: string) => apiClient.post<AuthResponse>('/auth/refresh', {refreshToken:token}).then(r=>r.data),
  updateProfile: (id: string, data: Record<string,unknown>) => apiClient.patch<UserDto>(`/auth/profile/${id}`, data).then(r=>r.data),
}

export const gigService = {
  list: (p?: Record<string,unknown>) => apiClient.get<Page<GigResponse>>('/gigs', {params:p}).then(r=>r.data),
  get: (id: string) => apiClient.get<GigResponse>(`/gigs/${id}`).then(r=>r.data),
  create: (d: Record<string,unknown>) => apiClient.post<GigResponse>('/gigs', d).then(r=>r.data),
  update: (id: string, d: Record<string,unknown>) => apiClient.patch<GigResponse>(`/gigs/${id}`, d).then(r=>r.data),
  cancel: (id: string) => apiClient.delete(`/gigs/${id}`),
  mine: (p?: Record<string,unknown>) => apiClient.get<Page<GigResponse>>('/gigs/mine', {params:p}).then(r=>r.data),
  apply: (id: string, note?: string) => apiClient.post<ApplicationResponse>(`/gigs/${id}/apply`, {note}).then(r=>r.data),
  applications: (id: string) => apiClient.get<Page<ApplicationResponse>>(`/gigs/${id}/applications`).then(r=>r.data),
}

export const applicationService = {
  mine: (p?: Record<string,unknown>) => apiClient.get<Page<ApplicationResponse>>('/applications/mine', {params:p}).then(r=>r.data),
  review: (id: string, status: string, venueNote?: string) => apiClient.patch<ApplicationResponse>(`/applications/${id}/review`, {status,venueNote}).then(r=>r.data),
  withdraw: (id: string) => apiClient.patch<ApplicationResponse>(`/applications/${id}/withdraw`).then(r=>r.data),
}

export const artistService = {
  list: (p?: Record<string,unknown>) => apiClient.get<Page<UserDto>>('/artists', {params:p}).then(r=>r.data),
  get: (id: string) => apiClient.get<{profile:UserDto,reviews:unknown[]}>(`/artists/${id}`).then(r=>r.data),
}

export const waitlistService = {
  join: (d: Record<string,unknown>) => apiClient.post('/waitlist', d).then(r=>r.data),
}

export const contactService = {
  send: (d: Record<string,unknown>) => apiClient.post('/contact', d).then(r=>r.data),
}
