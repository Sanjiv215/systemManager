import type { Response } from 'express'
import mongoose from 'mongoose'
import ExcelJS from 'exceljs'
import { Attendance } from '../models/Attendance'
import { Employee } from '../models/Employee'
import { Transaction } from '../models/Finance'
import { Invoice } from '../models/Invoice'
import { Quotation } from '../models/Quotation'
import { SalaryPayment, SalaryRun } from '../models/Salary'
import { dashboardSummary } from '../services/dashboard.service'
import { nextInvoiceNumber, nextQuotationNumber } from '../services/numbering.service'
import { calculateDocument, calculateLine } from '../services/totals.service'
import { audit } from '../services/audit.service'
import { writeBusinessPdf } from '../utils/pdf'
import { ApiError, activeOnly } from '../utils/http'
import type { AuthRequest } from '../middleware/auth'

export async function dashboard(_req: AuthRequest, res: Response) {
  res.json(await dashboardSummary())
}

export async function createQuotation(req: AuthRequest, res: Response) {
  const totals = calculateDocument(req.body.items)
  const items = req.body.items.map((item: never) => ({ ...item, total: calculateLine(item).total }))
  const quotation = await Quotation.create({
    ...req.body,
    quotationNumber: await nextQuotationNumber(),
    items,
    ...totals,
    createdBy: req.user?.id,
  })
  await audit('create', 'Quotation', quotation._id, req.user?.id, {}, req.ip)
  res.status(201).json(quotation)
}

export async function createInvoice(req: AuthRequest, res: Response) {
  const totals = calculateDocument(req.body.items)
  const items = req.body.items.map((item: never) => ({ ...item, total: calculateLine(item).total }))
  const status = req.body.paidAmount >= totals.total ? 'paid' : req.body.paidAmount > 0 ? 'partial' : 'unpaid'
  const invoice = await Invoice.create({
    ...req.body,
    invoiceNumber: await nextInvoiceNumber(),
    items,
    ...totals,
    status,
    qrPayload: `invoice:${totals.total}`,
    createdBy: req.user?.id,
  })
  await audit('create', 'Invoice', invoice._id, req.user?.id, {}, req.ip)
  res.status(201).json(invoice)
}

export async function convertQuotation(req: AuthRequest, res: Response) {
  const session = await mongoose.startSession()
  try {
    let createdInvoice: unknown
    await session.withTransaction(async () => {
      const quotation = await Quotation.findOne(activeOnly({ _id: req.params.id })).session(session)
      if (!quotation) throw new ApiError(404, 'Quotation not found')
      if (quotation.status === 'converted') throw new ApiError(409, 'Quotation is already converted')
      const invoice = await Invoice.create(
        [
          {
            invoiceNumber: await nextInvoiceNumber(),
            quotation: quotation._id,
            customer: quotation.customer,
            items: quotation.items,
            subtotal: quotation.subtotal,
            gstAmount: quotation.gstAmount,
            discountAmount: quotation.discountAmount,
            total: quotation.total,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            qrPayload: `invoice:${quotation.total}`,
            createdBy: req.user?.id,
          },
        ],
        { session },
      )
      quotation.status = 'converted'
      await quotation.save({ session })
      createdInvoice = invoice[0]
    })
    await audit('convert_to_invoice', 'Quotation', req.params.id, req.user?.id, {}, req.ip)
    res.status(201).json(createdInvoice)
  } finally {
    await session.endSession()
  }
}

export async function generateQuotationPdf(req: AuthRequest, res: Response) {
  const quotation = await Quotation.findOne(activeOnly({ _id: req.params.id })).populate('customer').lean()
  if (!quotation) throw new ApiError(404, 'Quotation not found')
  const pdfUrl = await writeBusinessPdf('quotations', `${quotation.quotationNumber}.pdf`, [
    `Quotation: ${quotation.quotationNumber}`,
    `Total: ${quotation.total}`,
    `Valid until: ${quotation.validUntil.toISOString().slice(0, 10)}`,
  ])
  await Quotation.updateOne({ _id: quotation._id }, { pdfUrl })
  await audit('generate_pdf', 'Quotation', quotation._id, req.user?.id, {}, req.ip)
  res.json({ pdfUrl })
}

export async function generateInvoicePdf(req: AuthRequest, res: Response) {
  const invoice = await Invoice.findOne(activeOnly({ _id: req.params.id })).populate('customer').lean()
  if (!invoice) throw new ApiError(404, 'Invoice not found')
  const pdfUrl = await writeBusinessPdf('invoices', `${invoice.invoiceNumber}.pdf`, [
    `Invoice: ${invoice.invoiceNumber}`,
    `Total: ${invoice.total}`,
    `Paid: ${invoice.paidAmount}`,
    `Status: ${invoice.status}`,
  ])
  await Invoice.updateOne({ _id: invoice._id }, { pdfUrl })
  await audit('generate_pdf', 'Invoice', invoice._id, req.user?.id, {}, req.ip)
  res.json({ pdfUrl })
}

export async function generateSalary(req: AuthRequest, res: Response) {
  const session = await mongoose.startSession()
  try {
    let runId: unknown
    await session.withTransaction(async () => {
      const employees = await Employee.find({ deletedAt: null, status: 'active' }).session(session)
      const run = await SalaryRun.create([{ month: req.body.month, year: req.body.year, generatedBy: req.user?.id }], { session })
      const daysInMonth = new Date(req.body.year, req.body.month, 0).getDate()
      const start = new Date(req.body.year, req.body.month - 1, 1)
      const end = new Date(req.body.year, req.body.month, 1)
      const payments = []

      for (const employee of employees) {
        const attendance = await Attendance.find({ employee: employee._id, date: { $gte: start, $lt: end } }).session(session)
        const payableDays = attendance.reduce((total, row) => total + (row.status === 'present' ? 1 : row.status === 'half_day' ? 0.5 : 0), 0)
        const bonus = req.body.bonuses[String(employee._id)] || 0
        const deductions = req.body.deductions[String(employee._id)] || 0
        const advancePaid = req.body.advances[String(employee._id)] || 0
        const gross = (employee.monthlySalary / daysInMonth) * payableDays + bonus
        payments.push({
          salaryRun: run[0]._id,
          employee: employee._id,
          basicSalary: employee.monthlySalary,
          payableDays,
          bonus,
          deductions,
          advancePaid,
          netPay: Math.max(gross - deductions - advancePaid, 0),
        })
      }

      const created = payments.length ? await SalaryPayment.create(payments, { session }) : []
      run[0].totalGross = created.reduce((sum, item) => sum + item.basicSalary, 0)
      run[0].totalDeductions = created.reduce((sum, item) => sum + item.deductions + item.advancePaid, 0)
      run[0].totalNet = created.reduce((sum, item) => sum + item.netPay, 0)
      await run[0].save({ session })
      runId = run[0]._id
    })
    await audit('generate_salary', 'SalaryRun', runId, req.user?.id, {}, req.ip)
    res.status(201).json({ id: runId })
  } finally {
    await session.endSession()
  }
}

export async function exportReport(req: AuthRequest, res: Response) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Transactions')
  sheet.columns = [
    { header: 'Date', key: 'date', width: 18 },
    { header: 'Type', key: 'type', width: 12 },
    { header: 'Category', key: 'category', width: 24 },
    { header: 'Amount', key: 'amount', width: 14 },
    { header: 'Mode', key: 'mode', width: 14 },
  ]
  const transactions = await Transaction.find(activeOnly()).sort({ occurredAt: -1 }).lean()
  transactions.forEach((transaction) => {
    sheet.addRow({
      date: transaction.occurredAt.toISOString().slice(0, 10),
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      mode: transaction.mode,
    })
  })
  await audit('export_excel', 'Report', null, req.user?.id, {}, req.ip)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename="woodwise-report.xlsx"')
  await workbook.xlsx.write(res)
  res.end()
}
