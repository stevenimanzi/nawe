import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BadgeCheck, Clock, ShieldX } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useKyc } from '@/hooks/queries'
import api, { errorMessage, fieldErrors } from '@/services/api'
import type { KycVerification } from '@/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'
import { Spinner } from '@/components/ui/States'

const TODAY = new Date().toISOString().slice(0, 10)

const DOCUMENTS = [
    { value: 'national_id', label: 'National ID card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving licence' },
    { value: 'student_id', label: 'Student ID' },
]

const REASONS = [
    { title: 'Buyers and tenants trust you', text: 'A verified badge shows people they are dealing with a real person.' },
    { title: 'Fewer scams for everyone', text: 'Anyone who posts on NAWE has shown a valid ID, so fraud has nowhere to hide.' },
    { title: 'Private and secure', text: 'Your documents are only seen by the NAWE review team. They are never shown on your listings.' },
]

const FileInput: React.FC<{
    label: string
    hint: string
    file: File | null
    onChange: (f: File | null) => void
    error?: string
    required?: boolean
}> = ({ label, hint, file, onChange, error, required }) => (
    <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">
            {label}
            {required && <span className="text-slate-400"> *</span>}
        </label>
        <label
            className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-canvas/70 px-4 py-3 ring-1 transition-shadow hover:ring-white/30 ${
                error ? 'ring-[#b3261e]' : 'ring-white/10'
            }`}
        >
            <span className="min-w-0 truncate text-[15px] text-slate-300">{file ? file.name : hint}</span>
            <span className="shrink-0 rounded-full border border-white/25 px-4 py-1.5 text-sm font-semibold text-white">{file ? 'Change' : 'Choose file'}</span>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
        </label>
        {error && (
            <p role="alert" className="mt-1.5 text-sm text-[#f0827a]">
                {error}
            </p>
        )}
    </div>
)

const StatusCard: React.FC<{ kyc: KycVerification }> = ({ kyc }) => {
    const content = {
        approved: {
            icon: <BadgeCheck className="size-10 text-gold" strokeWidth={1.5} aria-hidden />,
            title: 'You are verified',
            text: 'Your ID has been approved. You can now post items and list rooms, and your listings show the verified badge.',
        },
        pending: {
            icon: <Clock className="size-10 text-slate-300" strokeWidth={1.5} aria-hidden />,
            title: 'Your documents are being reviewed',
            text: 'We will approve your account as soon as the review is done, usually within one working day.',
        },
        in_review: {
            icon: <Clock className="size-10 text-slate-300" strokeWidth={1.5} aria-hidden />,
            title: 'A reviewer is checking your documents',
            text: 'This should only take a little longer.',
        },
        rejected: {
            icon: <ShieldX className="size-10 text-[#f0827a]" strokeWidth={1.5} aria-hidden />,
            title: 'We could not approve your ID',
            text: kyc.rejection_reason ? `Reason: ${kyc.rejection_reason}` : 'Please submit clear photos of a valid ID.',
        },
    }[kyc.status]

    return (
        <div className="rounded-3xl bg-panel p-8 text-center ring-1 ring-white/10 sm:p-10">
            <div className="flex justify-center">{content.icon}</div>
            <h2 className="mt-5 text-2xl font-semibold text-white">{content.title}</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-300">{content.text}</p>
            <p className="mt-4 text-sm text-slate-400">
                {DOCUMENTS.find((d) => d.value === kyc.document_type)?.label} · {kyc.full_name}
            </p>
            {kyc.status === 'approved' && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <ButtonLink to="/post/item">Post an item</ButtonLink>
                    <ButtonLink to="/post/housing" variant="secondary">
                        List a room
                    </ButtonLink>
                </div>
            )}
        </div>
    )
}

export const KycView: React.FC = () => {
    const { user, refresh } = useAuth()
    const toast = useToast()
    const queryClient = useQueryClient()
    const { data: kyc, isLoading } = useKyc()

    const [resubmit, setResubmit] = useState(false)
    const [documentType, setDocumentType] = useState('national_id')
    const [idNumber, setIdNumber] = useState('')
    const [fullName, setFullName] = useState(user?.name ?? '')
    const [dob, setDob] = useState('')
    const [front, setFront] = useState<File | null>(null)
    const [back, setBack] = useState<File | null>(null)
    const [selfie, setSelfie] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setFormError('')

        if (!front) {
            setErrors({ id_front_image: 'Please add a photo of the front of your ID.' })
            return
        }

        const body = new FormData()
        body.append('document_type', documentType)
        body.append('id_number', idNumber.trim())
        body.append('full_name', fullName.trim())
        if (dob) body.append('date_of_birth', dob)
        body.append('id_front_image', front)
        if (back) body.append('id_back_image', back)
        if (selfie) body.append('selfie_with_id', selfie)

        setBusy(true)
        try {
            await api.post('/v1/kyc', body)
            await queryClient.invalidateQueries({ queryKey: ['kyc'] })
            await refresh()
            setResubmit(false)
            toast.success('Documents submitted. We will review them shortly.')
        } catch (err) {
            setErrors(fieldErrors(err))
            setFormError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    const showForm = !kyc || (kyc.status === 'rejected' && resubmit)

    return (
        <>
            <PageHeader
                title="Verify your ID"
                subtitle="NAWE is built on trust. Every seller and landlord shows a valid ID before they post."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Verify your ID' }]}
            />
            <Container className="py-10">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div>
                        {isLoading ? (
                            <Spinner />
                        ) : showForm ? (
                            <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl bg-panel p-8 ring-1 ring-white/10 sm:p-10">
                                <h2 className="text-2xl font-semibold text-white">Your documents</h2>
                                <SelectField label="Document type" value={documentType} options={DOCUMENTS} onChange={(e) => setDocumentType(e.target.value)} error={errors.document_type} />
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <TextField label="ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} error={errors.id_number} maxLength={50} required />
                                    <TextField label="Full name on the ID" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.full_name} required />
                                </div>
                                <TextField label="Date of birth (optional)" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={TODAY} error={errors.date_of_birth} />

                                <FileInput label="Front of your ID" hint="JPG, PNG or WebP, up to 8 MB" file={front} onChange={setFront} error={errors.id_front_image} required />
                                <FileInput label="Back of your ID (optional)" hint="JPG, PNG or WebP, up to 8 MB" file={back} onChange={setBack} error={errors.id_back_image} />
                                <FileInput label="Selfie holding your ID (optional)" hint="Helps us approve you faster" file={selfie} onChange={setSelfie} error={errors.selfie_with_id} />

                                {formError && Object.keys(errors).length === 0 && (
                                    <p role="alert" className="text-sm text-[#f0827a]">
                                        {formError}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <Button type="submit" size="lg" loading={busy} disabled={!idNumber || !fullName}>
                                        Submit for review
                                    </Button>
                                    {resubmit && (
                                        <Button variant="ghost" size="lg" onClick={() => setResubmit(false)}>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            kyc && (
                                <div className="space-y-5">
                                    <StatusCard kyc={kyc} />
                                    {kyc.status === 'rejected' && (
                                        <div className="text-center">
                                            <Button size="lg" onClick={() => setResubmit(true)}>
                                                Submit again
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <aside className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Why we ask</h2>
                        <ul className="space-y-5">
                            {REASONS.map((r) => (
                                <li key={r.title} className="border-t border-white/15 pt-4">
                                    <h3 className="text-[15px] font-semibold text-white">{r.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{r.text}</p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </Container>
        </>
    )
}
