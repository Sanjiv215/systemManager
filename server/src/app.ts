import compression from 'compression'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error'
import { authRoutes } from './routes/v1/auth.routes'
import { resourceRoutes } from './routes/v1/resource.routes'
import { logger } from './utils/logger'

export const app = express()

app.use(helmet())
app.use(compression())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }))
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', resourceRoutes)

app.use(notFound)
app.use(errorHandler)
