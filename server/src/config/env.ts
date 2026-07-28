import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/woodwise'),
  JWT_SECRET: z.string().default('woodwise-development-secret-key-that-is-long-enough'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5173'),
  UPLOAD_DIR: z.string().default('storage'),
})

export const env = envSchema.parse(process.env)
