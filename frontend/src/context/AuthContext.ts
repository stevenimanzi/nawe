import { createContext, useContext } from 'react'
import type { Role, User } from '@/types'

export interface RegisterPayload {
    name: string
    email: string
    phone?: string
    role: Extract<Role, 'member' | 'landlord'>
    password: string
    password_confirmation: string
}

export interface AuthState {
    user: User | null
    /** True while a saved session is being checked on first load. */
    loading: boolean
    login: (email: string, password: string) => Promise<User>
    register: (payload: RegisterPayload) => Promise<User>
    logout: () => Promise<void>
    refresh: () => Promise<void>
    setUser: (user: User) => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
