import React, { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext, type ToastApi, type ToastKind } from './ToastContext'

interface Toast {
    id: number
    message: string
    kind: ToastKind
}

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }
const TONES = { success: 'text-emerald-400', error: 'text-red-400', info: 'text-sky-300' }

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([])
    const nextId = useRef(1)

    const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

    const show = useCallback(
        (message: string, kind: ToastKind = 'info') => {
            const id = nextId.current++
            setToasts((all) => [...all.slice(-3), { id, message, kind }])
            window.setTimeout(() => dismiss(id), 5000)
        },
        [dismiss],
    )

    const api = useMemo<ToastApi>(
        () => ({
            show,
            success: (m) => show(m, 'success'),
            error: (m) => show(m, 'error'),
        }),
        [show],
    )

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div
                aria-live="polite"
                className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-3"
            >
                {toasts.map((t) => {
                    const Icon = ICONS[t.kind]
                    return (
                        <div
                            key={t.id}
                            role={t.kind === 'error' ? 'alert' : 'status'}
                            className="pointer-events-auto flex animate-pop items-start gap-3 rounded-2xl bg-panel-2 p-4 text-sm text-white shadow-2xl ring-1 ring-white/10"
                        >
                            <Icon className={`mt-0.5 size-5 shrink-0 ${TONES[t.kind]}`} aria-hidden />
                            <p className="flex-1 leading-relaxed">{t.message}</p>
                            <button
                                type="button"
                                onClick={() => dismiss(t.id)}
                                aria-label="Dismiss"
                                className="cursor-pointer text-slate-400 transition-colors hover:text-white"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}
