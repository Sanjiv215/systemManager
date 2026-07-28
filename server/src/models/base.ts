import { Schema } from 'mongoose'

export function softDeleteFields(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null, index: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  })
}
