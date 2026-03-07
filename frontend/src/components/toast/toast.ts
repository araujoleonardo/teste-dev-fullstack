import { ref } from 'vue'
import type { Ref } from 'vue'

export type ToastType = "primary" | "success" | "info" | "warning" | "error" | "default";

export interface ToastItem {
  id: number
  type: ToastType
  message: string
  title?: string
  duration?: number
}

// Estado global reativo
export const toasts: Ref<ToastItem[]> = ref([])

// criar o toast
function addToast(type: ToastType, message: string, title?: string, duration = 5000) {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, type, message, title, duration })
}

// Funções globais — agora aceitam (message) OU (title, message)
export const toast = {
  success: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('success', messageOrTitle, maybeMessage, duration)
  },
  error: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('error', messageOrTitle, maybeMessage, duration)
  },
  warning: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('warning', messageOrTitle, maybeMessage, duration)
  },
  info: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('info', messageOrTitle, maybeMessage, duration)
  },
  primary: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('primary', messageOrTitle, maybeMessage, duration)
  },
  default: (messageOrTitle: string, maybeMessage?: string, duration = 5000) => {
    handleToast('default', messageOrTitle, maybeMessage, duration)
  }
}

// Função utilitária para decidir se há título
function handleToast(type: ToastType, messageOrTitle: string, maybeMessage?: string, duration = 5000) {
  if (maybeMessage) {
    addToast(type, maybeMessage, messageOrTitle, duration)
  } else {
    addToast(type, messageOrTitle, undefined, duration)
  }
}

export function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) toasts.value.splice(index, 1)
}
