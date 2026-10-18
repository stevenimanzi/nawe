import React from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin } from 'lucide-react'
import { CONDITION_LABEL, formatDistance, itemPrice, timeAgo } from '@/lib/format'
import type { MarketplaceItem } from '@/types'
import { FavoriteButton } from './FavoriteButton'

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light' }> = ({ children, tone = 'dark' }) => (
    <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
            tone === 'light' ? 'bg-white text-[#111111]' : 'bg-black/65 text-white backdrop-blur-sm'
        }`}
    >
        {children}
    </span>
)

export const NoPhoto: React.FC = () => (
    <div className="grid size-full place-items-center bg-panel-2 text-sm text-slate-400">No photo yet</div>
)

export const ItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
    const photo = item.images?.[0]
    const distance = formatDistance(item.distance_km)

    return (
        <article className="group relative overflow-hidden rounded-xl bg-[#181B22] border border-white/15 shadow-md transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-[#1E222B]">
            <Link to={`/trade/${item.id}`} className="block focus-visible:outline-2 focus-visible:outline-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
                    {photo ? (
                        <img
                            src={photo.url}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <NoPhoto />
                    )}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {item.listing_type === 'rent' && <Pill tone="light">For rent</Pill>}
                        {item.is_urgent && <Pill>Urgent</Pill>}
                    </div>
                    {distance && (
                        <div className="absolute bottom-3 left-3">
                            <Pill>{distance}</Pill>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 p-4.5">
                    <p className="text-lg font-black text-white">{itemPrice(item)}</p>
                    <h3 className="line-clamp-1 text-base font-bold leading-snug text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-400">
                        {CONDITION_LABEL[item.condition]} · {item.listing_type === 'rent' ? 'For Rent' : 'Direct Sale'}
                    </p>
                    <div className="flex items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-white/5">
                        <span className="flex min-w-0 items-center gap-1">
                            <MapPin className="size-3.5 shrink-0" aria-hidden />
                            <span className="truncate">{item.location ?? 'Rwanda'}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5">
                            {item.seller?.is_kyc_verified && (
                                <BadgeCheck className="size-4 text-gold" aria-label="ID-verified seller" />
                            )}
                            {timeAgo(item.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
            <FavoriteButton type="marketplace_item" id={item.id} className="absolute right-3 top-3" />
        </article>
    )
}
