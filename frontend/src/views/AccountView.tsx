import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { BadgeCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useMyListings } from '@/hooks/queries'
import { useUrlState } from '@/hooks/useUrlState'
import api, { errorMessage, fieldErrors } from '@/services/api'
import { formatRwf, itemPrice, rentPerMonth, timeAgo } from '@/lib/format'
import type { HousingListing, MarketplaceItem } from '@/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States'

const TABS = [
    { key: 'listings', label: 'My listings' },
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Password' },
]

export const AccountView: React.FC = () => {
    const { user } = useAuth()
    const { params, update } = useUrlState()
    const tab = TABS.some((t) => t.key === params.get('tab')) ? (params.get('tab') as string) : 'listings'

    if (!user) return null

    return (
        <>
            <PageHeader
                title={`Hello, ${user.name.split(' ')[0]}`}
                subtitle={user.email}
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]}
                actions={
                    user.is_kyc_verified || user.role === 'admin' ? (
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                            <BadgeCheck className="size-5 text-gold" aria-hidden />
                            {user.role === 'admin' ? 'Administrator' : 'ID verified'}
                        </p>
                    ) : (
                        <ButtonLink to="/kyc" size="sm">
                            Verify your ID
                        </ButtonLink>
                    )
                }
            />

            <Container className="py-10">
                <div role="tablist" aria-label="Account sections" className="mb-8 flex gap-2 overflow-x-auto border-b border-white/10">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            role="tab"
                            type="button"
                            aria-selected={tab === t.key}
                            onClick={() => update({ tab: t.key === 'listings' ? undefined : t.key })}
                            className={`-mb-px shrink-0 cursor-pointer border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
                                tab === t.key ? 'border-white text-white' : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'listings' && <MyListings />}
                {tab === 'profile' && <ProfileForm />}
                {tab === 'security' && <PasswordForm />}
            </Container>
        </>
    )
}

/* ---------------- My listings ---------------- */

const STATUS_STYLE: Record<string, string> = {
    active: 'bg-white text-[#111111]',
    available: 'bg-white text-[#111111]',
    sold: 'bg-panel-2 text-slate-200',
    rented: 'bg-panel-2 text-slate-200',
    paused: 'bg-panel-2 text-slate-200',
    archived: 'bg-panel-2 text-slate-200',
    pending: 'bg-panel-2 text-slate-200',
}

interface RowProps {
    thumb?: string
    title: string
    price: string
    status: string
    viewTo: string
    editTo: string
    meta: string
    actions: { label: string; status: string }[]
    onStatus: (status: string) => Promise<void>
    onDelete: () => Promise<void>
}

const ListingRow: React.FC<RowProps> = ({ thumb, title, price, status, viewTo, editTo, meta, actions, onStatus, onDelete }) => {
    const [confirming, setConfirming] = useState(false)
    const [busy, setBusy] = useState(false)

    const run = async (fn: () => Promise<void>) => {
        setBusy(true)
        try {
            await fn()
        } finally {
            setBusy(false)
            setConfirming(false)
        }
    }

    return (
        <li className="flex flex-col gap-5 rounded-3xl bg-panel p-5 ring-1 ring-white/10 sm:flex-row sm:items-center">
            <Link to={viewTo} className="block size-24 shrink-0 overflow-hidden rounded-2xl bg-panel-2" aria-label={`View ${title}`}>
                {thumb ? <img src={thumb} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-xs text-slate-400">No photo</span>}
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <Link to={viewTo} className="truncate text-[17px] font-semibold text-white hover:underline">
                        {title}
                    </Link>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status] ?? STATUS_STYLE.pending}`}>{status}</span>
                </div>
                <p className="mt-1 text-[15px] font-bold text-white">{price}</p>
                <p className="mt-1 text-sm text-slate-400">{meta}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {confirming ? (
                    <>
                        <span className="mr-1 text-sm text-slate-300">Delete this listing?</span>
                        <Button size="sm" variant="danger" loading={busy} onClick={() => run(onDelete)}>
                            Yes, delete
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                            Keep it
                        </Button>
                    </>
                ) : (
                    <>
                        {actions.map((a) => (
                            <Button key={a.status} size="sm" variant="secondary" disabled={busy} onClick={() => run(() => onStatus(a.status))}>
                                {a.label}
                            </Button>
                        ))}
                        <ButtonLink to={editTo} size="sm" variant="secondary">
                            Edit
                        </ButtonLink>
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </li>
    )
}

const MyListings: React.FC = () => {
    const { data, isLoading, isError, refetch } = useMyListings()
    const queryClient = useQueryClient()
    const toast = useToast()

    const refresh = () => queryClient.invalidateQueries()

    const patch = (url: string) => async (status: string) => {
        try {
            await api.patch(url, { status })
            await refresh()
            toast.success('Listing updated')
        } catch (err) {
            toast.error(errorMessage(err))
        }
    }

    const remove = (url: string) => async () => {
        try {
            await api.delete(url)
            await refresh()
            toast.success('Listing deleted')
        } catch (err) {
            toast.error(errorMessage(err))
        }
    }

    if (isLoading) return <Spinner />
    if (isError || !data) return <ErrorState onRetry={() => refetch()} />

    if (data.items.length === 0 && data.listings.length === 0) {
        return (
            <EmptyState
                title="You have not posted anything yet"
                text="List an item to sell or rent out, or put a room on the map for people nearby."
                action={{ label: 'Post a listing', to: '/post' }}
            />
        )
    }

    const itemActions = (i: MarketplaceItem) =>
        i.status === 'active' ? [{ label: i.listing_type === 'rent' ? 'Mark unavailable' : 'Mark sold', status: 'sold' }] : [{ label: 'Relist', status: 'active' }]

    const homeActions = (l: HousingListing) =>
        l.status === 'available'
            ? [
                  { label: 'Mark rented', status: 'rented' },
                  { label: 'Pause', status: 'paused' },
              ]
            : [{ label: 'Make available', status: 'available' }]

    return (
        <div className="space-y-12">
            <div className="flex flex-wrap gap-3">
                <ButtonLink to="/post/item" size="sm">
                    Post an item
                </ButtonLink>
                <ButtonLink to="/post/housing" size="sm" variant="secondary">
                    List a room or house
                </ButtonLink>
            </div>

            {data.items.length > 0 && (
                <section>
                    <h2 className="mb-5 text-xl font-semibold text-white">Items ({data.items.length})</h2>
                    <ul className="space-y-4">
                        {data.items.map((i) => (
                            <ListingRow
                                key={i.id}
                                thumb={i.images?.[0]?.url}
                                title={i.title}
                                price={itemPrice(i)}
                                status={i.status}
                                viewTo={`/trade/${i.id}`}
                                editTo={`/account/edit/item/${i.id}`}
                                meta={`${i.listing_type === 'rent' ? 'For rent' : 'For sale'} · posted ${timeAgo(i.created_at)}`}
                                actions={itemActions(i)}
                                onStatus={patch(`/v1/trade/items/${i.id}`)}
                                onDelete={remove(`/v1/trade/items/${i.id}`)}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {data.listings.length > 0 && (
                <section>
                    <h2 className="mb-5 text-xl font-semibold text-white">Rooms and houses ({data.listings.length})</h2>
                    <ul className="space-y-4">
                        {data.listings.map((l) => (
                            <ListingRow
                                key={l.id}
                                thumb={l.images?.[0]?.url}
                                title={l.title}
                                price={rentPerMonth(l)}
                                status={l.status}
                                viewTo={`/dwell/${l.id}`}
                                editTo={`/account/edit/housing/${l.id}`}
                                meta={`${l.rooms} ${l.rooms === 1 ? 'room' : 'rooms'} · deposit ${l.deposit > 0 ? formatRwf(l.deposit) : 'none'} · posted ${timeAgo(l.created_at)}`}
                                actions={homeActions(l)}
                                onStatus={patch(`/v1/dwell/listings/${l.id}`)}
                                onDelete={remove(`/v1/dwell/listings/${l.id}`)}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}

/* ---------------- Profile ---------------- */

const ProfileForm: React.FC = () => {
    const { user, setUser, logout } = useAuth()
    const toast = useToast()
    const [name, setName] = useState(user?.name ?? '')
    const [phone, setPhone] = useState(user?.phone ?? '')
    const [role, setRole] = useState(user?.role === 'landlord' ? 'landlord' : 'member')
    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!user) return null

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setErrors({})
        try {
            const { data } = await api.patch('/v1/auth/profile', {
                name: name.trim(),
                phone: phone.trim() || null,
                ...(user.role === 'admin' ? {} : { role }),
            })
            setUser(data.data)
            toast.success('Profile saved')
        } catch (err) {
            const fields = fieldErrors(err)
            setErrors(fields)
            if (Object.keys(fields).length === 0) toast.error(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="max-w-xl">
            <form onSubmit={submit} noValidate className="space-y-6">
                <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
                <TextField label="Email" value={user.email} disabled hint="Your email is your sign-in and cannot be changed here." readOnly />
                <TextField
                    label="Phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 7XX XXX XXX"
                    hint="Shown only to signed-in members who view your listings."
                    error={errors.phone}
                />
                {user.role !== 'admin' && (
                    <SelectField
                        label="Account type"
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'member' | 'landlord')}
                        options={[
                            { value: 'member', label: 'Member (buy, sell, rent items)' },
                            { value: 'landlord', label: 'Landlord (also list rooms and houses)' },
                        ]}
                        error={errors.role}
                    />
                )}
                <Button type="submit" size="lg" loading={busy}>
                    Save changes
                </Button>
            </form>

            <div className="mt-12 border-t border-white/10 pt-8">
                <Button variant="secondary" onClick={() => void logout()}>
                    Sign out
                </Button>
            </div>
        </div>
    )
}

/* ---------------- Password ---------------- */

const PasswordForm: React.FC = () => {
    const toast = useToast()
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        if (next !== confirm) {
            setErrors({ password_confirmation: 'The two passwords do not match.' })
            return
        }
        setBusy(true)
        try {
            await api.post('/v1/auth/password', { current_password: current, password: next, password_confirmation: confirm })
            setCurrent('')
            setNext('')
            setConfirm('')
            toast.success('Password updated')
        } catch (err) {
            const fields = fieldErrors(err)
            setErrors(fields)
            if (Object.keys(fields).length === 0) toast.error(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <form onSubmit={submit} noValidate className="max-w-xl space-y-6">
            <TextField label="Current password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current_password} required />
            <TextField label="New password" type="password" autoComplete="new-password" hint="At least 8 characters." value={next} onChange={(e) => setNext(e.target.value)} error={errors.password} required />
            <TextField label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.password_confirmation} required />
            <Button type="submit" size="lg" loading={busy} disabled={!current || !next || !confirm}>
                Update password
            </Button>
        </form>
    )
}
