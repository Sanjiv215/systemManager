import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { User, type UserRole } from '../models/User'
import { ApiError } from '../utils/http'

export type AuthRequest = Request & {
  user?: {
    id: string
    role: UserRole
    name: string
    email: string
  }
}

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace('Bearer ', '')
  if (!token) return next(new ApiError(401, 'Authentication required'))

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: UserRole }
    const user = await User.findOne({ _id: payload.sub, deletedAt: null }).lean()
    if (!user) return next(new ApiError(401, 'Invalid authentication token'))
    req.user = {
      id: String(user._id),
      role: user.role as UserRole,
      name: user.name,
      email: user.email,
    }
    next()
  } catch {
    next(new ApiError(401, 'Invalid authentication token'))
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'))
    if (!roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have permission for this action'))
    next()
  }
}
