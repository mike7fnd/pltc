"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  read: boolean
  createdAt: string
}

interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
}

interface NotificationContextType {
  notifications: Notification[]
  toasts: Toast[]
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  showToast: (toast: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Welcome to TutorHub!",
      message: "Start by browsing tutors or completing your profile.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "success",
      title: "Session Confirmed",
      message: "Your tutoring session has been confirmed for tomorrow.",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ])
  const [toasts, setToasts] = useState<Toast[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const newToast: Toast = { ...toast, id: `toast_${Date.now()}` }
    setToasts((prev) => [...prev, newToast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        addNotification,
        markAsRead,
        markAllAsRead,
        showToast,
        dismissToast,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
