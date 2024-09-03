"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  const latestSpecificToast = toasts.filter(toast => toast.itemID === "401").slice(-1)[0]

  return (
    <ToastProvider>
      {toasts.map(function (toast) {
        // If the toast is of the specific type, only show the latest one
        if (toast.itemID === "401" && toast !== latestSpecificToast) {
          return null
        }
        return (
          <Toast key={toast.id} {...toast}>
            <div className="grid gap-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            {toast.action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
