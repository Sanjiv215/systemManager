import { AuditLog } from '../models/AuditLog'

export async function audit(action: string, entity: string, entityId: unknown, actor?: string, metadata: Record<string, unknown> = {}, ipAddress?: string) {
  await AuditLog.create({
    action,
    entity,
    entityId,
    actor: actor || null,
    metadata,
    ipAddress,
  })
}
