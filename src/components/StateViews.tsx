import { AlertCircle, Loader2, PackageOpen } from 'lucide-react'
import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading data' }: { label?: string }) {
  return (
    <div className="state-view">
      <Loader2 className="spin" size={22} />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="state-view empty">
      <PackageOpen size={26} />
      <strong>{title}</strong>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-view error">
      <AlertCircle size={24} />
      <strong>{message}</strong>
      <button className="secondary-button compact" type="button" onClick={onRetry}>Retry</button>
    </div>
  )
}
