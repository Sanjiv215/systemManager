import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { env } from './env'
import { logger } from '../utils/logger'

export async function connectDatabase() {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 3000,
    })
    logger.info('MongoDB connected')
  } catch (error) {
    if (env.NODE_ENV === 'production') {
      throw error
    }

    logger.warn('Falling back to embedded MongoDB for local development', {
      message: error instanceof Error ? error.message : String(error),
    })

    const memoryServer = await MongoMemoryServer.create({ instance: { dbName: 'woodwise' } })
    await mongoose.connect(memoryServer.getUri(), {
      dbName: 'woodwise',
      autoIndex: true,
    })
    logger.info('Embedded MongoDB connected')
  }
}
