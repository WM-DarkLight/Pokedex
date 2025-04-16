"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-md shadow-lg flex items-start gap-3 animate-slide-up",
              toast.variant === "destructive" && "bg-destructive text-destructive-foreground",
              toast.variant === "success" && "bg-green-600 text-white",
              toast.variant === "default" && "bg-background border",
            )}
          >
            <div className="flex-1">
              <h4 className="font-medium">{toast.title}</h4>
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
