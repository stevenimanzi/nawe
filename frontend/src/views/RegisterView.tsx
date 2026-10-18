import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { errorMessage, fieldErrors } from '@/services/api'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { AuthCard } from '@/components/shared/AuthCard'

type Role = 'member' | 'landlord'

const ROLES: { value: Role; title: string; text: string }[] = [
    { value: 'member', title: 'Member', text: 'Buy, sell and rent items, and look for a room.' },
    { value: 'landlord', title: 'Landlord', text: 'List rooms and houses for rent, and sell or rent items too.' },
]

export const RegisterView: React.FC = () => {
    useDocumentTitle('Create account')
    const { user, register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const from = (location.state as { from?: string } | null)?.from ?? '/'

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
    const [role, setRole] = useState<Role>('member')
    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    if (user) return <Navigate to={from} replace />

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }))

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setFormError('')

        if (form.password !== form.password_confirmation) {
            setErrors({ password_confirmation: 'The two passwords do not match.' })
            return
        }

        setBusy(true)
        try {
            const created = await register({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                role,
                password: form.password,
                password_confirmation: form.password_confirmation,
            })
            toast.success(`Welcome to NAWE, ${created.name.split(' ')[0]}`)
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
            title="Create your account"
            subtitle="It is free. Verify your ID later, when you are ready to sell or rent out."
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" state={{ from }} className="font-semibold text-white underline underline-offset-2">
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate className="space-y-5">
                <fieldset>
                    <legend className="mb-2 text-sm font-medium text-slate-200">I want to join as</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {ROLES.map((r) => (
                            <label
                                key={r.value}
                                className={`cursor-pointer rounded-2xl p-4 ring-1 transition-colors ${
                                    role === r.value ? 'bg-panel-2 ring-2 ring-white' : 'bg-canvas/60 ring-white/10 hover:ring-white/30'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={r.value}
                                    checked={role === r.value}
                                    onChange={() => setRole(r.value)}
                                    className="sr-only"
                                />
                                <span className="block text-[15px] font-semibold text-white">{r.title}</span>
                                <span className="mt-1 block text-xs leading-relaxed text-slate-400">{r.text}</span>
                            </label>
                        ))}
                    </div>
                    {errors.role && <p className="mt-1.5 text-sm text-[#f0827a]">{errors.role}</p>}
                </fieldset>

                <TextField label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} required />
                <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    required
                />
                <TextField
                    label="Phone (optional)"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+250 7XX XXX XXX"
                    hint="Shown only to signed-in members who view your listings."
                    value={form.phone}
                    onChange={set('phone')}
                    error={errors.phone}
                />
                <TextField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    hint="At least 8 characters."
                    value={form.password}
                    onChange={set('password')}
                    error={errors.password}
                    required
                />
                <TextField
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password_confirmation}
                    onChange={set('password_confirmation')}
                    error={errors.password_confirmation}
                    required
                />

                {formError && (
                    <p role="alert" className="text-sm text-[#f0827a]">
                        {formError}
                    </p>
                )}

                <p className="text-xs leading-relaxed text-slate-400">
                    By creating an account you agree to our{' '}
                    <Link to="/terms" className="underline underline-offset-2 hover:text-white">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-white">
                        Privacy Policy
                    </Link>
                    .
                </p>

                <Button
                    type="submit"
                    size="lg"
                    loading={busy}
                    disabled={!form.name || !form.email || !form.password}
                    className="w-full"
                >
                    Create account
                </Button>
            </form>
        </AuthCard>
    )
}
