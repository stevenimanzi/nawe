import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Filters that live in the address bar, so a search can be shared, bookmarked and
 * restored with the back button. Changing any filter sends the visitor back to page 1.
 */
export function useUrlState() {
    const [params, setParams] = useSearchParams()

    const update = useCallback(
        (changes: Record<string, string | undefined | null>) => {
            setParams(
                (current) => {
                    const next = new URLSearchParams(current)
                    for (const [key, value] of Object.entries(changes)) {
                        if (value) next.set(key, value)
                        else next.delete(key)
                    }
                    if (!('page' in changes)) next.delete('page')
                    return next
                },
                { replace: false },
            )
        },
        [setParams],
    )

    const clear = useCallback(() => setParams({}), [setParams])

    return { params, update, clear }
}
