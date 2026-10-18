import React, { useId } from 'react'
import { ChevronDown } from 'lucide-react'

const control =
    'w-full rounded-xl bg-canvas/70 px-4 text-[15px] text-white ring-1 transition-shadow placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:opacity-60'

const ring = (error?: string) => (error ? 'ring-[#b3261e] focus:ring-[#e5645b]' : 'ring-white/10 hover:ring-white/25 focus:ring-white/50')

interface FieldShellProps {
    label: string
    error?: string
    hint?: string
    htmlFor: string
    children: React.ReactNode
    className?: string
}

const FieldShell: React.FC<FieldShellProps> = ({ label, error, hint, htmlFor, children, className = '' }) => (
    <div className={className}>
        <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-200">
            {label}
        </label>
        {children}
        {error ? (
            <p role="alert" className="mt-1.5 text-sm text-[#f0827a]">
                {error}
            </p>
        ) : (
            hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        )}
    </div>
)

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    hint?: string
    prefix?: string
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, hint, prefix, className = '', ...rest }) => {
    const id = useId()
    return (
        <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
            <div className="relative">
                {prefix && (
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    aria-invalid={Boolean(error)}
                    className={`${control} h-12 ${ring(error)} ${prefix ? 'pl-14' : ''}`}
                    {...rest}
                />
            </div>
        </FieldShell>
    )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    hint?: string
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, hint, className = '', ...rest }) => {
    const id = useId()
    return (
        <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
            <textarea
                id={id}
                aria-invalid={Boolean(error)}
                rows={5}
                className={`${control} resize-y py-3 leading-relaxed ${ring(error)}`}
                {...rest}
            />
        </FieldShell>
    )
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    hint?: string
    options: { value: string; label: string }[]
}

/** Native select (best for forms and phones), styled to match. */
export const SelectField: React.FC<SelectFieldProps> = ({ label, error, hint, options, className = '', ...rest }) => {
    const id = useId()
    return (
        <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
            <div className="relative">
                <select
                    id={id}
                    aria-invalid={Boolean(error)}
                    className={`${control} h-12 cursor-pointer appearance-none pr-10 ${ring(error)} [&>option]:bg-[#0f2850] [&>option]:text-white`}
                    {...rest}
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            </div>
        </FieldShell>
    )
}

interface CheckFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string
    description?: string
}

export const CheckField: React.FC<CheckFieldProps> = ({ label, description, className = '', ...rest }) => {
    const id = useId()
    return (
        <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 ${className}`}>
            <input
                id={id}
                type="checkbox"
                className="mt-1 size-5 shrink-0 cursor-pointer accent-[#0b6e4f]"
                {...rest}
            />
            <span>
                <span className="block text-[15px] font-medium text-white">{label}</span>
                {description && <span className="mt-0.5 block text-sm text-slate-400">{description}</span>}
            </span>
        </label>
    )
}
