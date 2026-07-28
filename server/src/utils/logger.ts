type Meta = Record<string, unknown>

function write(level: 'info' | 'warn' | 'error', message: string, meta?: Meta) {
  process.stdout.write(`${JSON.stringify({ level, message, ...(meta ? { meta } : {}), timestamp: new Date().toISOString() })}\n`)
}

export const logger = {
  info: (message: string, meta?: Meta) => write('info', message, meta),
  warn: (message: string, meta?: Meta) => write('warn', message, meta),
  error: (message: string, meta?: Meta) => write('error', message, meta),
}
