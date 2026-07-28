import { z } from 'zod'
import { amountItemSchema, objectId } from './common'

export const employeeSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().nullable(),
    address: z.string().optional().default(''),
    position: z.string().min(2),
    joiningDate: z.coerce.date(),
    monthlySalary: z.number().min(0),
    status: z.enum(['active', 'inactive']).optional(),
  }),
})

export const customerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().nullable(),
    address: z.string().min(1),
    gstNumber: z.string().optional().nullable(),
  }),
})

export const attendanceSchema = z.object({
  body: z.object({
    employee: objectId,
    date: z.coerce.date(),
    status: z.enum(['present', 'absent', 'half_day', 'leave']),
    note: z.string().optional().default(''),
  }),
})

export const transactionSchema = z.object({
  body: z.object({
    type: z.enum(['income', 'expense']),
    category: z.string().min(1),
    amount: z.number().min(0),
    mode: z.enum(['cash', 'bank', 'upi', 'card', 'other']),
    occurredAt: z.coerce.date(),
    description: z.string().optional().default(''),
  }),
})

export const inventorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    category: z.string().min(1),
    quantity: z.number().min(0),
    unit: z.string().min(1),
    reorderLevel: z.number().min(0),
    supplier: z.string().optional().default(''),
  }),
})

export const quotationSchema = z.object({
  body: z.object({
    customer: objectId,
    validUntil: z.coerce.date(),
    notes: z.string().optional().default(''),
    status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']).optional(),
    items: z.array(amountItemSchema).min(1),
  }),
})

export const invoiceSchema = z.object({
  body: z.object({
    customer: objectId,
    dueDate: z.coerce.date(),
    paidAmount: z.number().min(0).optional().default(0),
    items: z.array(amountItemSchema).min(1),
  }),
})

export const salaryGenerateSchema = z.object({
  body: z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
    bonuses: z.record(objectId, z.number().min(0)).optional().default({}),
    deductions: z.record(objectId, z.number().min(0)).optional().default({}),
    advances: z.record(objectId, z.number().min(0)).optional().default({}),
  }),
})
