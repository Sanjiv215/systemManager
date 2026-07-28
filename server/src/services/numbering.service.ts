import { Invoice } from '../models/Invoice'
import { Quotation } from '../models/Quotation'

function pad(value: number) {
  return value.toString().padStart(5, '0')
}

export async function nextQuotationNumber() {
  const count = await Quotation.countDocuments()
  return `QTN-${new Date().getFullYear()}-${pad(count + 1)}`
}

export async function nextInvoiceNumber() {
  const count = await Invoice.countDocuments()
  return `INV-${new Date().getFullYear()}-${pad(count + 1)}`
}
