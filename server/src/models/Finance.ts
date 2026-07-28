import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const transactionSchema = new Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, enum: ['cash', 'bank', 'upi', 'card', 'other'], required: true, index: true },
    occurredAt: { type: Date, required: true, index: true },
    description: { type: String, trim: true, default: '' },
    referenceModel: { type: String, default: null },
    referenceId: { type: Schema.Types.ObjectId, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

transactionSchema.index({ occurredAt: -1, type: 1 })
softDeleteFields(transactionSchema)

export const Transaction = mongoose.model('Transaction', transactionSchema)
