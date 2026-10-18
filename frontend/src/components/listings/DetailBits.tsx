import React from 'react'
import { Link } from 'react-router-dom'
import { Link2, ShieldAlert } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const CopyLinkButton: React.FC = () => {
    const toast = useToast()
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied')
                } catch {
                    toast.error('Could not copy the link')
                }
            }}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-slate-300"
        >
            <Link2 className="size-5" aria-hidden />
            Share
        </button>
    )
}

export const SafetyNote: React.FC<{ kind: 'meet' | 'visit' }> = ({ kind }) => (
    <div className="flex gap-4 rounded-2xl bg-panel p-5 ring-1 ring-white/10">
        <ShieldAlert className="mt-0.5 size-6 shrink-0 text-slate-300" aria-hidden />
        <p className="text-sm leading-relaxed text-slate-300">
            {kind === 'meet'
                ? 'Meet in a public place and check the item before you pay. Never send money in advance.'
                : 'Visit the place and meet the landlord before you pay any deposit. Never send money in advance.'}{' '}
            <Link to="/safety" className="font-semibold text-white underline underline-offset-2">
                Read our safety tips
            </Link>
            .
        </p>
    </div>
)

export const Fact: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
        <dd className="mt-1 text-[15px] font-medium text-white">{value}</dd>
    </div>
)
