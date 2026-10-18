import React from 'react'
import { BadgeCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'

interface GateProps {
    title: string
    text: string
    action: { label: string; to: string }
}

/** Shown instead of a form when the person has a step to finish first. */
export const Gate: React.FC<GateProps> = ({ title, text, action }) => (
    <div className="mx-auto max-w-xl rounded-3xl bg-panel p-8 text-center ring-1 ring-white/10 sm:p-12">
        <BadgeCheck className="mx-auto size-10 text-gold" strokeWidth={1.5} aria-hidden />
        <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{text}</p>
        <ButtonLink to={action.to} size="lg" className="mt-8">
            {action.label}
        </ButtonLink>
    </div>
)
