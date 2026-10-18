import React from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, BedDouble, MapPin } from 'lucide-react'
import { PROPERTY_LABEL, amenityLabels, formatDistance, rentPerMonth, timeAgo } from '@/lib/format'
import type { HousingListing } from '@/types'
import { FavoriteButton } from './FavoriteButton'
import { NoPhoto, Pill } from './ItemCard'

export const HousingCard: React.FC<{ listing: HousingListing; highlighted?: boolean }> = ({ listing, highlighted }) => {
    const photo = listing.images?.[0]
    const distance = formatDistance(listing.distance_km)
    const amenities = amenityLabels(listing.amenities)

    return (
        <article
            className={`group relative overflow-hidden rounded-xl bg-[#181B22] border transition-all hover:-translate-y-1 hover:bg-[#1E222B] shadow-md ${
                highlighted ? 'border-white/50' : 'border-white/15 hover:border-white/30'
            }`}
        >
            <Link to={`/dwell/${listing.id}`} className="block focus-visible:outline-2 focus-visible:outline-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
                    {photo ? (
                        <img
                            src={photo.url}
                            alt={listing.title}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <NoPhoto />
                    )}
                    <div className="absolute left-3 top-3">
                        <Pill tone="light">{PROPERTY_LABEL[listing.property_type]}</Pill>
                    </div>
                    {distance && (
                        <div className="absolute bottom-3 left-3">
                            <Pill>{distance}</Pill>
                        </div>
                    )}
                </div>

                <div className="space-y-2 p-5">
                    <p className="text-lg font-bold text-white">{rentPerMonth(listing)}</p>
                    <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug text-white">{listing.title}</h3>
                    <p className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="flex items-center gap-1.5">
                            <BedDouble className="size-4" aria-hidden />
                            {listing.rooms} {listing.rooms === 1 ? 'room' : 'rooms'}
                        </span>
                        <span className="flex min-w-0 items-center gap-1.5">
                            <MapPin className="size-4 shrink-0" aria-hidden />
                            <span className="truncate">{listing.address ?? listing.location ?? 'Rwanda'}</span>
                        </span>
                    </p>
                    {amenities.length > 0 && (
                        <p className="line-clamp-1 text-xs text-slate-400">{amenities.join(' · ')}</p>
                    )}
                    <p className="flex items-center gap-1.5 pt-1 text-xs text-slate-400">
                        {listing.landlord?.is_kyc_verified && (
                            <BadgeCheck className="size-4 text-gold" aria-label="ID-verified landlord" />
                        )}
                        {timeAgo(listing.created_at)}
                    </p>
                </div>
            </Link>
            <FavoriteButton type="housing_listing" id={listing.id} className="absolute right-3 top-3" />
        </article>
    )
}
