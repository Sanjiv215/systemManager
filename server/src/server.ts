import { app } from './app'
import { connectDatabase } from './config/database'
import { env } from './config/env'
import { logger } from './utils/logger'

async function bootstrap() {
  await connectDatabase()
  app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`)
  })
}

bootstrap().catch((error) => {
  logger.error('Failed to start API', { message: error.message })
  process.exit(1)
})
