"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000/api/v1"

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`POST ${path} failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<T>
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${path} failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<T>
}

interface AuthContextType {
  user: { email: string; name: string } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await apiGet<{
        success: boolean
        user: { fullName?: string; email: string }
      }>("/user/me")

      if (res.success) {
        setUser({
          email: res.user.email,
          name: res.user.fullName || "Admin",
        })
      }
    } catch (e) {
      // User not authenticated - this is expected on public pages
      // Silently set user to null without logging error
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only check auth if we're on an admin page
    const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
    if (isAdminPage) {
      checkAuth()
    } else {
      // On public pages, skip auth check
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiPost<{
        success: boolean
        user: { fullName?: string; email: string }
      }>("/user/login", { email, password })

      if (res.success) {
        setUser({
          email: res.user.email,
          name: res.user.fullName || "Admin",
        })
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiGet("/user/logout")
    } catch (e) {
      console.error("Logout error:", e)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
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
