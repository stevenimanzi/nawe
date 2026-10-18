import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/States'
import { EmptyState } from '@/components/ui/States'

interface ProtectedRouteProps {
    children: React.ReactNode
    /** Restrict the page to admins. */
    adminOnly?: boolean
}

/** Sends visitors to sign in first, then brings them back to where they were going. */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) return <Spinner label="Checking your session" />

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
    }

    if (adminOnly && user.role !== 'admin') {
        return <EmptyState title="Admins only" text="You do not have access to this page." action={{ label: 'Go home', to: '/' }} />
    }

    return <>{children}</>
}
