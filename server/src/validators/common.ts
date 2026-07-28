import { z } from 'zod'

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id')

export const listQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    status: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
})

export const idParamSchema = z.object({
  params: z.object({ id: objectId }),
})

export const amountItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  gstRate: z.number().min(0).max(100).optional().default(18),
  discount: z.number().min(0).optional().default(0),
})
