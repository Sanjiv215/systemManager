import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    quotation: { type: Schema.Types.ObjectId, ref: 'Quotation', default: null },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    items: { type: [Schema.Types.Mixed], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'unpaid', index: true },
    dueDate: { type: Date, required: true, index: true },
    qrPayload: { type: String, default: null },
    pdfUrl: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

invoiceSchema.index({ createdAt: -1, status: 1 })
softDeleteFields(invoiceSchema)

export const Invoice = mongoose.model('Invoice', invoiceSchema)
