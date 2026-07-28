const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export type ApiList<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApiErrorBody = {
  message: string
  details?: unknown
}

export class ApiClientError extends Error {
  status: number
  details?: unknown

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.status = status
    this.details = body.details
  }
}

export function getToken() {
  return window.localStorage.getItem('woodwise_token')
}

export function setToken(token: string) {
  window.localStorage.setItem('woodwise_token', token)
}

export function clearToken() {
  window.localStorage.removeItem('woodwise_token')
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ message: 'Request failed' }))) as ApiErrorBody
    throw new ApiClientError(response.status, body)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const text = query.toString()
  return text ? `?${text}` : ''
}
