import React from 'react'
import { Loader2 } from 'lucide-react'
import { ButtonLink } from './Button'

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading' }) => (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-300">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="text-sm">{label}…</span>
    </div>
)

interface EmptyStateProps {
    title: string
    text?: string
    action?: { label: string; to: string }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, text, action }) => (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {text && <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>}
        {action && (
            <ButtonLink to={action.to} className="mt-6">
                {action.label}
            </ButtonLink>
        )}
    </div>
)

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
    message = 'We could not load this right now.',
    onRetry,
}) => (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{message}</p>
        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="mt-6 cursor-pointer rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111111]"
            >
                Try again
            </button>
        )}
    </div>
)

export const CardSkeleton: React.FC = () => (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-panel ring-1 ring-white/10" aria-hidden>
        <div className="aspect-[4/3] bg-white/5" />
        <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
    </div>
)
