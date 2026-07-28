import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

export type UserRole = 'admin' | 'manager' | 'worker'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'manager', 'worker'], required: true, default: 'worker', index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
)

softDeleteFields(userSchema)

export const User = mongoose.model('User', userSchema)
