import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number
    lastPage: number
    onChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ page, lastPage, onChange }) => {
    if (lastPage <= 1) return null

    // Always show first, last and the neighbours of the current page.
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1,
    )

    const btn =
        'grid h-10 min-w-10 cursor-pointer place-items-center rounded-full px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40'

    return (
        <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                className={`${btn} text-slate-300 hover:text-white`}
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                aria-label="Previous page"
            >
                <ChevronLeft className="size-5" aria-hidden />
            </button>
            {pages.map((p, i) => (
                <React.Fragment key={p}>
                    {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-slate-500">…</span>}
                    <button
                        type="button"
                        onClick={() => onChange(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={`${btn} ${p === page ? 'bg-white text-[#111111]' : 'text-slate-300 hover:text-white'}`}
                    >
                        {p}
                    </button>
                </React.Fragment>
            ))}
            <button
                type="button"
                className={`${btn} text-slate-300 hover:text-white`}
                disabled={page >= lastPage}
                onClick={() => onChange(page + 1)}
                aria-label="Next page"
            >
                <ChevronRight className="size-5" aria-hidden />
            </button>
        </nav>
    )
}
