import mongoose, { Schema } from 'mongoose'

const salaryRunSchema = new Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'approved', 'paid'], default: 'draft', index: true },
    totalGross: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    totalNet: { type: Number, default: 0 },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

salaryRunSchema.index({ month: 1, year: 1 }, { unique: true })

const salaryPaymentSchema = new Schema(
  {
    salaryRun: { type: Schema.Types.ObjectId, ref: 'SalaryRun', required: true, index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    basicSalary: { type: Number, required: true, min: 0 },
    payableDays: { type: Number, required: true, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    advancePaid: { type: Number, default: 0, min: 0 },
    netPay: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending', index: true },
    paidAt: { type: Date, default: null },
    pdfUrl: { type: String, default: null },
  },
  { timestamps: true },
)

salaryPaymentSchema.index({ salaryRun: 1, employee: 1 }, { unique: true })

export const SalaryRun = mongoose.model('SalaryRun', salaryRunSchema)
export const SalaryPayment = mongoose.model('SalaryPayment', salaryPaymentSchema)
