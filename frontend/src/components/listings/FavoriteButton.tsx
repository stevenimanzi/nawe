import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useFavoriteIds, useToggleFavorite } from '@/hooks/queries'
import { errorMessage } from '@/services/api'
import type { EntityType } from '@/types'

interface FavoriteButtonProps {
    type: EntityType
    id: number
    className?: string
    /** Show the word next to the heart (detail pages). */
    withLabel?: boolean
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ type, id, className = '', withLabel }) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const { data: ids } = useFavoriteIds()
    const toggle = useToggleFavorite()

    const saved = ids?.some((f) => f.type === type && f.id === id) ?? false

    const onClick = (e: React.MouseEvent) => {
        // The button sits on top of a card link; do not follow it.
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            navigate('/login', { state: { from: location.pathname + location.search } })
            return
        }

        toggle.mutate(
            { type, id, saved },
            {
                onSuccess: () => toast.success(saved ? 'Removed from your wishlist' : 'Saved to your wishlist'),
                onError: (error) => toast.error(errorMessage(error)),
            },
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            disabled={toggle.isPending}
            className={`flex cursor-pointer items-center gap-2 text-white transition-transform hover:scale-110 disabled:opacity-60 ${className}`}
        >
            <Heart
                className={`size-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] ${saved ? 'fill-white' : ''}`}
                strokeWidth={2}
                aria-hidden
            />
            {withLabel && <span className="text-sm font-semibold">{saved ? 'Saved' : 'Save'}</span>}
        </button>
    )
}
