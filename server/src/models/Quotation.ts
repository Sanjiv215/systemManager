import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const lineItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
    gstRate: { type: Number, default: 18, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const quotationSchema = new Schema(
  {
    quotationNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'], default: 'draft', index: true },
    items: { type: [lineItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true, default: '' },
    validUntil: { type: Date, required: true, index: true },
    pdfUrl: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

softDeleteFields(quotationSchema)

export const Quotation = mongoose.model('Quotation', quotationSchema)
