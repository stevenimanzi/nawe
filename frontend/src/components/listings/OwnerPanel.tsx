import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BadgeCheck, Flag, Phone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSendMessage } from '@/hooks/queries'
import api, { errorMessage } from '@/services/api'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SelectField, TextArea } from '@/components/ui/Field'
import type { EntityType, PublicUser } from '@/types'

interface OwnerPanelProps {
    owner?: PublicUser
    entityType: EntityType
    entityId: number
    /** What the person is asking about, used to pre-fill the message. */
    subject: string
    ownerLabel: 'Seller' | 'Landlord'
}

const memberSince = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ''

/** Who is behind the listing, how to reach them, and a way to report a problem. */
export const OwnerPanel: React.FC<OwnerPanelProps> = ({ owner, entityType, entityId, subject, ownerLabel }) => {
    const { user } = useAuth()
    const location = useLocation()
    const toast = useToast()
    const send = useSendMessage()
    const [message, setMessage] = useState(`Hello, is "${subject}" still available?`)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    if (!owner) return null

    const isOwner = user?.id === owner.id
    const signInState = { from: location.pathname }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        send.mutate(
            { receiver_id: owner.id, messageable_type: entityType, messageable_id: entityId, content: message.trim() },
            {
                onSuccess: () => {
                    setSent(true)
                    toast.success('Message sent')
                },
                onError: (err) => setError(errorMessage(err)),
            },
        )
    }

    return (
        <aside className="space-y-6">
            <section className="rounded-3xl bg-panel p-6 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{ownerLabel}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{owner.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    {owner.is_kyc_verified ? (
                        <>
                            <BadgeCheck className="size-5 text-gold" aria-hidden />
                            ID verified
                        </>
                    ) : (
                        'ID not verified yet'
                    )}
                </p>
                {owner.member_since && <p className="mt-1 text-sm text-slate-400">Member since {memberSince(owner.member_since)}</p>}

                <div className="mt-5 border-t border-white/10 pt-5">
                    {owner.phone ? (
                        <a
                            href={`tel:${owner.phone.replace(/\s/g, '')}`}
                            className="flex items-center gap-3 text-[15px] font-semibold text-white hover:underline"
                        >
                            <Phone className="size-5 text-slate-300" aria-hidden />
                            {owner.phone}
                        </a>
                    ) : user ? (
                        <p className="text-sm text-slate-400">No phone number shared. Send a message instead.</p>
                    ) : (
                        <p className="text-sm text-slate-400">
                            <Link to="/login" state={signInState} className="font-semibold text-white underline underline-offset-2">
                                Sign in
                            </Link>{' '}
                            to see the phone number.
                        </p>
                    )}
                </div>
            </section>

            <section className="rounded-3xl bg-panel p-6 ring-1 ring-white/10">
                {isOwner ? (
                    <p className="text-sm leading-relaxed text-slate-300">
                        This is your listing. Manage it from{' '}
                        <Link to="/account" className="font-semibold text-white underline underline-offset-2">
                            your account
                        </Link>
                        .
                    </p>
                ) : !user ? (
                    <div>
                        <h2 className="text-lg font-semibold text-white">Message the {ownerLabel.toLowerCase()}</h2>
                        <p className="mt-2 text-sm text-slate-300">Sign in to send a message and keep the conversation in one place.</p>
                        <ButtonLink to="/login" state={signInState} className="mt-5 w-full">
                            Sign in to message
                        </ButtonLink>
                    </div>
                ) : sent ? (
                    <div>
                        <h2 className="text-lg font-semibold text-white">Message sent</h2>
                        <p className="mt-2 text-sm text-slate-300">
                            {owner.name} will see it in their inbox. You will find the reply in your messages.
                        </p>
                        <ButtonLink
                            to={`/messages?with=${owner.id}&type=${entityType}&id=${entityId}`}
                            variant="secondary"
                            className="mt-5 w-full"
                        >
                            Open conversation
                        </ButtonLink>
                    </div>
                ) : (
                    <form onSubmit={submit} noValidate>
                        <h2 className="text-lg font-semibold text-white">Message the {ownerLabel.toLowerCase()}</h2>
                        <TextArea
                            label="Your message"
                            rows={4}
                            maxLength={2000}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            error={error}
                            className="mt-4"
                        />
                        <Button type="submit" loading={send.isPending} disabled={message.trim().length === 0} className="mt-4 w-full">
                            Send message
                        </Button>
                    </form>
                )}
            </section>

            {!isOwner && <ReportForm entityType={entityType} entityId={entityId} />}
        </aside>
    )
}

const REASONS = [
    { value: 'scam', label: 'Looks like a scam' },
    { value: 'wrong_info', label: 'Wrong or misleading details' },
    { value: 'prohibited', label: 'Not allowed on NAWE' },
    { value: 'offensive', label: 'Offensive content' },
    { value: 'duplicate', label: 'Duplicate listing' },
    { value: 'other', label: 'Something else' },
]

const ReportForm: React.FC<{ entityType: EntityType; entityId: number }> = ({ entityType, entityId }) => {
    const { user } = useAuth()
    const location = useLocation()
    const toast = useToast()
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState('scam')
    const [details, setDetails] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    if (!user) {
        return (
            <p className="text-center text-sm text-slate-400">
                <Link to="/login" state={{ from: location.pathname }} className="underline underline-offset-2 hover:text-white">
                    Sign in
                </Link>{' '}
                to report this listing.
            </p>
        )
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
            await api.post('/v1/reports', { type: entityType, id: entityId, reason, details: details || undefined })
            toast.success('Thank you. Our team will review this listing.')
            setOpen(false)
            setDetails('')
        } catch (err) {
            setError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div>
            {!open ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mx-auto flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                    <Flag className="size-4" aria-hidden />
                    Report this listing
                </button>
            ) : (
                <form onSubmit={submit} className="space-y-4 rounded-3xl bg-panel p-6 ring-1 ring-white/10" noValidate>
                    <h2 className="text-lg font-semibold text-white">Report this listing</h2>
                    <SelectField label="What is wrong?" value={reason} onChange={(e) => setReason(e.target.value)} options={REASONS} />
                    <TextArea
                        label="Details (optional)"
                        rows={3}
                        maxLength={2000}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        error={error}
                    />
                    <div className="flex gap-3">
                        <Button type="submit" size="sm" loading={busy}>
                            Send report
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
