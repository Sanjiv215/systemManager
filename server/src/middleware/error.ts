import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/http'
import { logger } from '../utils/logger'

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500
  const details = error instanceof ApiError ? error.details : undefined

  if (statusCode >= 500) {
    logger.error(error.message, { path: req.originalUrl, stack: error.stack })
  }

  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal server error' : error.message,
    ...(details ? { details } : {}),
  })
}
