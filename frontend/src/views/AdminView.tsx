import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/context/ToastContext'
import { useAdminKyc, useAdminReports, useAdminStats } from '@/hooks/queries'
import { useUrlState } from '@/hooks/useUrlState'
import api, { errorMessage } from '@/services/api'
import { timeAgo } from '@/lib/format'
import type { AdminKycRecord, AdminReport } from '@/types'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'
import { EmptyState, Spinner } from '@/components/ui/States'

const REASON_LABEL: Record<string, string> = {
    scam: 'Looks like a scam',
    prohibited: 'Not allowed on NAWE',
    wrong_info: 'Wrong or misleading details',
    offensive: 'Offensive content',
    duplicate: 'Duplicate listing',
    other: 'Something else',
}

export const AdminView: React.FC = () => {
    const { params, update } = useUrlState()
    const tab = params.get('tab') === 'reports' ? 'reports' : 'kyc'
    const { data: stats } = useAdminStats()

    const cards = [
        { label: 'ID checks waiting', value: stats?.pending_kyc },
        { label: 'Open reports', value: stats?.open_reports },
        { label: 'Items listed', value: stats?.items },
        { label: 'Rooms listed', value: stats?.listings },
    ]

    return (
        <>
            <PageHeader title="Admin" subtitle="Review ID checks and listing reports." crumbs={[{ label: 'Home', to: '/' }, { label: 'Admin' }]} />
            <Container className="py-10">
                <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {cards.map((c) => (
                        <div key={c.label} className="rounded-3xl bg-panel p-6 ring-1 ring-white/10">
                            <dt className="text-sm text-slate-400">{c.label}</dt>
                            <dd className="mt-2 text-3xl font-bold tabular-nums text-white">{c.value ?? '–'}</dd>
                        </div>
                    ))}
                </dl>

                <div role="tablist" className="mb-8 mt-10 flex gap-2 border-b border-white/10">
                    {[
                        { key: 'kyc', label: 'ID checks' },
                        { key: 'reports', label: 'Reports' },
                    ].map((t) => (
                        <button
                            key={t.key}
                            role="tab"
                            type="button"
                            aria-selected={tab === t.key}
                            onClick={() => update({ tab: t.key === 'kyc' ? undefined : t.key })}
                            className={`-mb-px cursor-pointer border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
                                tab === t.key ? 'border-white text-white' : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'kyc' ? <KycQueue /> : <ReportQueue />}
            </Container>
        </>
    )
}

const KycQueue: React.FC = () => {
    const [status, setStatus] = useState('pending')
    const { data, isLoading } = useAdminKyc(status)

    return (
        <section>
            <div className="mb-6 flex gap-2">
                {['pending', 'approved', 'rejected', 'all'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        aria-pressed={status === s}
                        onClick={() => setStatus(s)}
                        className={`h-9 cursor-pointer rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
                            status === s ? 'border-white bg-white text-[#111111]' : 'border-white/20 text-slate-200 hover:border-white/50'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <Spinner />
            ) : !data || data.length === 0 ? (
                <EmptyState title="Nothing here" text="No ID checks match this filter." />
            ) : (
                <ul className="space-y-5">
                    {data.map((k) => (
                        <KycCard key={k.id} record={k} />
                    ))}
                </ul>
            )}
        </section>
    )
}

const KycCard: React.FC<{ record: AdminKycRecord }> = ({ record: k }) => {
    const queryClient = useQueryClient()
    const toast = useToast()
    const [reason, setReason] = useState('')
    const [rejecting, setRejecting] = useState(false)
    const [busy, setBusy] = useState(false)

    const review = async (status: 'approved' | 'rejected') => {
        setBusy(true)
        try {
            await api.post(`/v1/kyc/${k.id}/review`, { status, rejection_reason: status === 'rejected' ? reason : undefined })
            toast.success(status === 'approved' ? `${k.user.name} is now verified` : 'ID rejected')
            await queryClient.invalidateQueries({ queryKey: ['admin-kyc'] })
            await queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
        } catch (err) {
            toast.error(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    const images = [
        { label: 'Front', url: k.id_front_image_url },
        { label: 'Back', url: k.id_back_image_url },
        { label: 'Selfie', url: k.selfie_with_id_url },
    ].filter((i) => i.url)

    return (
        <li className="rounded-3xl bg-panel p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{k.user.name}</h3>
                    <p className="text-sm text-slate-400">
                        {k.user.email}
                        {k.user.phone ? ` · ${k.user.phone}` : ''}
                    </p>
                    <p className="mt-3 text-sm text-slate-300">
                        {k.document_type.replace('_', ' ')} · <span className="font-semibold text-white">{k.id_number}</span> · name on ID: {k.full_name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Submitted {timeAgo(k.submitted_at)}</p>
                </div>
                <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-semibold capitalize text-white">{k.status.replace('_', ' ')}</span>
            </div>

            {images.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-3">
                    {images.map((i) => (
                        <li key={i.label}>
                            <a href={i.url!} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={i.url!} alt={`${i.label} of ID`} className="h-28 w-40 rounded-xl object-cover ring-1 ring-white/15" />
                                <span className="mt-1 block text-xs text-slate-400">{i.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            {k.status === 'rejected' && k.rejection_reason && <p className="mt-4 text-sm text-slate-300">Reason: {k.rejection_reason}</p>}

            {(k.status === 'pending' || k.status === 'in_review') && (
                <div className="mt-6">
                    {rejecting ? (
                        <div className="max-w-md space-y-3">
                            <TextField label="Reason for rejecting" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The photo is blurry" />
                            <div className="flex gap-3">
                                <Button size="sm" variant="danger" loading={busy} disabled={!reason.trim()} onClick={() => review('rejected')}>
                                    Reject ID
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setRejecting(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Button size="sm" loading={busy} onClick={() => review('approved')}>
                                Approve
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setRejecting(true)}>
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </li>
    )
}

const ReportQueue: React.FC = () => {
    const [status, setStatus] = useState('open')
    const { data, isLoading } = useAdminReports(status)

    return (
        <section>
            <div className="mb-6 flex gap-2">
                {['open', 'reviewed', 'dismissed', 'all'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        aria-pressed={status === s}
                        onClick={() => setStatus(s)}
                        className={`h-9 cursor-pointer rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
                            status === s ? 'border-white bg-white text-[#111111]' : 'border-white/20 text-slate-200 hover:border-white/50'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <Spinner />
            ) : !data || data.length === 0 ? (
                <EmptyState title="No reports" text="Nothing has been reported with this status." />
            ) : (
                <ul className="space-y-5">
                    {data.map((r) => (
                        <ReportCard key={r.id} report={r} />
                    ))}
                </ul>
            )}
        </section>
    )
}

const ReportCard: React.FC<{ report: AdminReport }> = ({ report: r }) => {
    const queryClient = useQueryClient()
    const toast = useToast()
    const [busy, setBusy] = useState(false)

    const done = async (fn: () => Promise<unknown>, message: string) => {
        setBusy(true)
        try {
            await fn()
            toast.success(message)
            await queryClient.invalidateQueries()
        } catch (err) {
            toast.error(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    const listingUrl = r.entity_type === 'housing_listing' ? `/dwell/${r.entity_id}` : `/trade/${r.entity_id}`
    const apiUrl = r.entity_type === 'housing_listing' ? `/v1/dwell/listings/${r.entity_id}` : `/v1/trade/items/${r.entity_id}`

    return (
        <li className="rounded-3xl bg-panel p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Link to={listingUrl} className="text-lg font-semibold text-white hover:underline">
                        {r.entity_title}
                    </Link>
                    <p className="mt-1 text-sm text-slate-300">
                        {REASON_LABEL[r.reason] ?? r.reason} · reported by {r.reporter.name} · {timeAgo(r.created_at)}
                    </p>
                    {r.details && <p className="mt-3 text-sm leading-relaxed text-slate-300">“{r.details}”</p>}
                </div>
                <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-semibold capitalize text-white">{r.status}</span>
            </div>

            {r.status === 'open' && (
                <div className="mt-5 flex flex-wrap gap-3">
                    <Button size="sm" variant="danger" disabled={busy} onClick={() => done(async () => { await api.delete(apiUrl); await api.patch(`/v1/admin/reports/${r.id}`, { status: 'reviewed' }) }, 'Listing removed')}>
                        Remove listing
                    </Button>
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => done(() => api.patch(`/v1/admin/reports/${r.id}`, { status: 'reviewed' }), 'Marked as reviewed')}>
                        Mark reviewed
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => done(() => api.patch(`/v1/admin/reports/${r.id}`, { status: 'dismissed' }), 'Report dismissed')}>
                        Dismiss
                    </Button>
                </div>
            )}
        </li>
    )
}
