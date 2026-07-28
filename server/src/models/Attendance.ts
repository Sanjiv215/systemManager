import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ['present', 'absent', 'half_day', 'leave'], required: true, index: true },
    note: { type: String, trim: true, default: '' },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true })

export const Attendance = mongoose.model('Attendance', attendanceSchema)
