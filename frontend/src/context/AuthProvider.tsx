import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api, { TOKEN_KEY, UNAUTHORIZED_EVENT } from '@/services/api'
import type { User } from '@/types'
import { AuthContext, type AuthState, type RegisterPayload } from './AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

    const refresh = useCallback(async () => {
        try {
            const { data } = await api.get('/v1/auth/me')
            setUser(data.data as User)
        } catch {
            localStorage.removeItem(TOKEN_KEY)
            setUser(null)
        }
    }, [])

    // Restore a saved session.
    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) return
        let active = true
        api.get('/v1/auth/me')
            .then(({ data }) => active && setUser(data.data as User))
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY)
                if (active) setUser(null)
            })
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [])

    // The API said our token is no longer valid.
    useEffect(() => {
        const onUnauthorized = () => {
            localStorage.removeItem(TOKEN_KEY)
            setUser(null)
            queryClient.clear()
        }
        window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    }, [queryClient])

    const finishSignIn = useCallback(
        (payload: { user: User; token: string }) => {
            localStorage.setItem(TOKEN_KEY, payload.token)
            queryClient.clear()
            setUser(payload.user)
            return payload.user
        },
        [queryClient],
    )

    const login = useCallback(
        async (email: string, password: string) => {
            const { data } = await api.post('/v1/auth/login', { email, password })
            return finishSignIn(data.data)
        },
        [finishSignIn],
    )

    const register = useCallback(
        async (payload: RegisterPayload) => {
            const { data } = await api.post('/v1/auth/register', payload)
            return finishSignIn(data.data)
        },
        [finishSignIn],
    )

    const logout = useCallback(async () => {
        try {
            await api.post('/v1/auth/logout')
        } catch {
            /* the token may already be gone; sign out locally either way */
        }
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        queryClient.clear()
    }, [queryClient])

    const value = useMemo<AuthState>(
        () => ({ user, loading, login, register, logout, refresh, setUser }),
        [user, loading, login, register, logout, refresh],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
