import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: null },
    address: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true, default: null },
  },
  { timestamps: true },
)

customerSchema.index({ name: 'text', phone: 'text', email: 'text', gstNumber: 'text' })
softDeleteFields(customerSchema)

export const Customer = mongoose.model('Customer', customerSchema)
