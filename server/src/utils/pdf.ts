import fs from 'node:fs'
import path from 'node:path'
import PDFDocument from 'pdfkit'
import { env } from '../config/env'

export async function writeBusinessPdf(kind: string, fileName: string, rows: string[]) {
  const directory = path.join(env.UPLOAD_DIR, kind)
  await fs.promises.mkdir(directory, { recursive: true })
  const filePath = path.join(directory, fileName)

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 })
    const stream = fs.createWriteStream(filePath)
    stream.on('finish', resolve)
    stream.on('error', reject)
    doc.pipe(stream)
    doc.fontSize(18).text('WoodWise Furniture Solutions')
    doc.moveDown()
    rows.forEach((row) => doc.fontSize(11).text(row))
    doc.end()
  })

  return filePath
}
