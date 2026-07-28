import mongoose, { Schema } from 'mongoose'

const auditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, default: null, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true },
)

export const AuditLog = mongoose.model('AuditLog', auditLogSchema)
