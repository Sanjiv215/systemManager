import mongoose, { Schema } from 'mongoose'
import { softDeleteFields } from './base'

const inventoryItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    reorderLevel: { type: Number, required: true, min: 0 },
    supplier: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
)

inventoryItemSchema.index({ name: 'text', sku: 'text', category: 'text' })
softDeleteFields(inventoryItemSchema)

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema)
