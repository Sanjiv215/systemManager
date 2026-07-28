import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const employeeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: null },
    address: { type: String, trim: true, default: '' },
    position: { type: String, required: true, trim: true, index: true },
    joiningDate: { type: Date, required: true, index: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    documents: [{ name: String, url: String, uploadedAt: Date }],
  },
  { timestamps: true },
)

employeeSchema.index({ name: 'text', phone: 'text', position: 'text' })
softDeleteFields(employeeSchema)

export const Employee = mongoose.model('Employee', employeeSchema)
