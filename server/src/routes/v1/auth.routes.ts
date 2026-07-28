import { Router } from 'express'
import { login, setupAdmin } from '../../controllers/auth.controller'
import { validate } from '../../middleware/validate'
import { loginSchema, setupSchema } from '../../validators/auth'

export const authRoutes = Router()

authRoutes.post('/setup-admin', validate(setupSchema), setupAdmin)
authRoutes.post('/login', validate(loginSchema), login)
