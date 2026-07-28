import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { ApiError } from '../utils/http'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    if (!result.success) return next(new ApiError(422, 'Validation failed', result.error.flatten()))
    req.body = result.data.body ?? req.body
    req.query = result.data.query ?? req.query
    req.params = result.data.params ?? req.params
    next()
  }
}
