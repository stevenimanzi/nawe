import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { errorMessage, fieldErrors } from '@/services/api'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { AuthCard } from '@/components/shared/AuthCard'

export const LoginView: React.FC = () => {
    useDocumentTitle('Sign in')
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const from = (location.state as { from?: string } | null)?.from ?? '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    if (user) return <Navigate to={from} replace />

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setErrors({})
        setFormError('')
        try {
            const signedIn = await login(email.trim(), password)
            toast.success(`Welcome back, ${signedIn.name.split(' ')[0]}`)
            navigate(from, { replace: true })
        } catch (err) {
            const fields = fieldErrors(err)
            setErrors(fields)
            if (Object.keys(fields).length === 0) setFormError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <AuthCard
            title="Sign in"
            subtitle="Welcome back. Sign in to message sellers, save listings and post your own."
            footer={
                <>
                    New to NAWE?{' '}
                    <Link to="/register" state={{ from }} className="font-semibold text-white underline underline-offset-2">
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate className="space-y-5">
                <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    required
                />
                {formError && (
                    <p role="alert" className="text-sm text-[#f0827a]">
                        {formError}
                    </p>
                )}
                <Button type="submit" size="lg" loading={busy} disabled={!email || !password} className="w-full">
                    Sign in
                </Button>
            </form>
        </AuthCard>
    )
}
