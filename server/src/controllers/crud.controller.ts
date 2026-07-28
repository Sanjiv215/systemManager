import type { Response } from 'express'
import type { Model } from 'mongoose'
import { audit } from '../services/audit.service'
import { activeOnly, pagination, sort } from '../utils/http'
import type { AuthRequest } from '../middleware/auth'

export function crudController(model: Model<unknown>, entity: string, searchable: string[] = []) {
  return {
    async list(req: AuthRequest, res: Response) {
      const { page, limit, skip } = pagination(req.query)
      const query: Record<string, unknown> = activeOnly()
      if (req.query.status) query.status = req.query.status
      if (req.query.search && searchable.length) {
        query.$or = searchable.map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } }))
      }
      const [items, total] = await Promise.all([
        model.find(query).sort(sort(req.query)).skip(skip).limit(limit).lean(),
        model.countDocuments(query),
      ])
      res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) })
    },
    async create(req: AuthRequest, res: Response) {
      const item = await model.create({ ...req.body, createdBy: req.user?.id })
      await audit('create', entity, item._id, req.user?.id, {}, req.ip)
      res.status(201).json(item)
    },
    async update(req: AuthRequest, res: Response) {
      const item = await model.findOneAndUpdate(activeOnly({ _id: req.params.id }), req.body, { new: true, runValidators: true })
      if (!item) return res.status(404).json({ message: `${entity} not found` })
      await audit('update', entity, item._id, req.user?.id, {}, req.ip)
      res.json(item)
    },
    async remove(req: AuthRequest, res: Response) {
      const item = await model.findOneAndUpdate(activeOnly({ _id: req.params.id }), { deletedAt: new Date(), deletedBy: req.user?.id }, { new: true })
      if (!item) return res.status(404).json({ message: `${entity} not found` })
      await audit('soft_delete', entity, item._id, req.user?.id, {}, req.ip)
      res.status(204).send()
    },
  }
}
