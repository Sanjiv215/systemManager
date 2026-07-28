export class ApiError extends Error {
  statusCode: number
  details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

export type PageQuery = {
  page?: string
  limit?: string
  search?: string
  sortBy?: string
  sortOrder?: string
  status?: string
  from?: string
  to?: string
}

export function pagination(query: PageQuery) {
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100)
  return { page, limit, skip: (page - 1) * limit }
}

export function sort(query: PageQuery, fallback = 'createdAt') {
  const sortBy = query.sortBy || fallback
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1
  return { [sortBy]: sortOrder as 1 | -1 }
}

export function activeOnly(extra: Record<string, unknown> = {}) {
  return { deletedAt: null, ...extra }
}
