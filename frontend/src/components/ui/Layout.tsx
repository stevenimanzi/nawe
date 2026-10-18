import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`w-full px-[30px] ${className}`}>{children}</div>
)

interface PageHeaderProps {
    title: string
    subtitle?: string
    crumbs?: { label: string; to?: string }[]
    actions?: React.ReactNode
}

/** Title block used at the top of every inner page. Also sets the browser tab title. */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, crumbs, actions }) => {
    useDocumentTitle(title)
    return (
        <header className="border-b border-white/10 bg-panel/60">
            <Container className="py-10 lg:py-14">
                {crumbs && (
                    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-400">
                        {crumbs.map((c, i) => (
                            <React.Fragment key={c.label}>
                                {i > 0 && <ChevronRight className="size-4" aria-hidden />}
                                {c.to ? (
                                    <Link to={c.to} className="transition-colors hover:text-white">
                                        {c.label}
                                    </Link>
                                ) : (
                                    <span className="text-slate-300">{c.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1>
                        {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>}
                    </div>
                    {actions}
                </div>
            </Container>
        </header>
    )
}
