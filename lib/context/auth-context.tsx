"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "parent" | "tutor" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface SignupData {
  email: string
  password: string
  name: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("tutorHub_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      role,
      avatar: `/placeholder.svg?height=100&width=100&query=${role} avatar`,
      phone: "+1 (555) 123-4567",
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("tutorHub_user", JSON.stringify(mockUser))
    setUser(mockUser)
    setIsLoading(false)
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: `/placeholder.svg?height=100&width=100&query=${data.role} avatar`,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("tutorHub_user", JSON.stringify(newUser))
    setUser(newUser)
    setIsLoading(false)
  }

  const logout = () => {
    localStorage.removeItem("tutorHub_user")
    setUser(null)
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      localStorage.setItem("tutorHub_user", JSON.stringify(updated))
      setUser(updated)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
