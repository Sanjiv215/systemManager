import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { User } from '../models/User'
import { ApiError } from '../utils/http'
import { audit } from '../services/audit.service'

function sign(user: { _id: unknown; role: string }) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export async function setupAdmin(req: Request, res: Response) {
  const count = await User.countDocuments({ deletedAt: null })
  if (count > 0) throw new ApiError(409, 'Initial admin already exists')
  const passwordHash = await bcrypt.hash(req.body.password, 12)
  const user = await User.create({ name: req.body.name, email: req.body.email, passwordHash, role: 'admin' })
  await audit('setup_admin', 'User', user._id, String(user._id), {}, req.ip)
  res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
}

export async function login(req: Request, res: Response) {
  const user = await User.findOne({ email: req.body.email, deletedAt: null }).select('+passwordHash')
  if (!user) throw new ApiError(401, 'Invalid email or password')
  const valid = await bcrypt.compare(req.body.password, user.passwordHash)
  if (!valid) throw new ApiError(401, 'Invalid email or password')
  user.lastLoginAt = new Date()
  await user.save()
  await audit('login', 'User', user._id, String(user._id), {}, req.ip)
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
}
