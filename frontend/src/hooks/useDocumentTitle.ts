import { useEffect } from 'react'

const SUFFIX = 'NAWE'

/** Sets the browser tab title, e.g. "Marketplace | NAWE". */
export function useDocumentTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} | ${SUFFIX}` : `${SUFFIX} — Second-Hand Marketplace & Shelter / Gueto Platform`
    }, [title])
}
