import { X } from 'lucide-react'

export type ToastMessage = {
  id: number
  message: string
  tone: 'success' | 'error'
}

export function ToastStack({ toasts, dismiss }: { toasts: ToastMessage[]; dismiss: (id: number) => void }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div className={`toast ${toast.tone}`} key={toast.id}>
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}>
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
