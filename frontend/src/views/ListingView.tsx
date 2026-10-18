import React from 'react'
import { useParams } from 'react-router-dom'
import { BedDouble, MapPin, Pencil } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useListing } from '@/hooks/queries'
import { PROPERTY_LABEL, amenityLabels, formatRwf, rentPerMonth, timeAgo } from '@/lib/format'
import { Container, PageHeader } from '@/components/ui/Layout'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, Spinner } from '@/components/ui/States'
import { FavoriteButton } from '@/components/listings/FavoriteButton'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { OwnerPanel } from '@/components/listings/OwnerPanel'
import { CopyLinkButton, Fact, SafetyNote } from '@/components/listings/DetailBits'
import { ListingsMap } from '@/components/map/ListingsMap'

export const ListingView: React.FC = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { data: listing, isLoading, isError } = useListing(id)

    if (isLoading) return <Spinner />
    if (isError || !listing) {
        return (
            <EmptyState
                title="We could not find that listing"
                text="It may have been rented or removed by the landlord."
                action={{ label: 'Find a room', to: '/dwell' }}
            />
        )
    }

    const isOwner = user?.id === listing.landlord?.id
    const amenities = amenityLabels(listing.amenities)
    const pin =
        listing.latitude != null && listing.longitude != null
            ? [
                  {
                      id: listing.id,
                      lat: listing.latitude,
                      lng: listing.longitude,
                      title: listing.title,
                      subtitle: rentPerMonth(listing),
                      href: '',
                  },
              ]
            : []

    return (
        <>
            <PageHeader
                title={listing.title}
                crumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Shelter & Gueto', to: '/dwell' },
                    { label: listing.title },
                ]}
            />

            <Container className="py-10">
                {listing.status !== 'available' && (
                    <p role="status" className="mb-6 rounded-2xl bg-panel-2 px-5 py-4 text-sm font-medium text-white ring-1 ring-white/15">
                        {listing.status === 'rented' ? 'This place has been rented.' : 'This listing is paused by the landlord.'}
                    </p>
                )}

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="space-y-8">
                        <ImageGallery images={listing.images} title={listing.title} />

                        <section>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-3xl font-bold text-white">{rentPerMonth(listing)}</p>
                                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <BedDouble className="size-4" aria-hidden />
                                            {listing.rooms} {listing.rooms === 1 ? 'room' : 'rooms'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-4" aria-hidden />
                                            {listing.address ?? listing.location ?? 'Rwanda'}
                                        </span>
                                        <span>Posted {timeAgo(listing.created_at)}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <FavoriteButton type="housing_listing" id={listing.id} withLabel />
                                    <CopyLinkButton />
                                </div>
                            </div>

                            {isOwner && (
                                <ButtonLink to={`/account/edit/housing/${listing.id}`} variant="secondary" size="sm" className="mt-5">
                                    <Pencil className="size-4" aria-hidden />
                                    Edit listing
                                </ButtonLink>
                            )}
                        </section>

                        <dl className="grid grid-cols-2 gap-6 rounded-3xl bg-panel p-6 ring-1 ring-white/10 sm:grid-cols-4">
                            <Fact label="Type" value={PROPERTY_LABEL[listing.property_type]} />
                            <Fact label="Rooms" value={listing.rooms} />
                            <Fact label="Deposit" value={listing.deposit > 0 ? formatRwf(listing.deposit) : 'None'} />
                            <Fact label="Location" value={listing.location ?? 'Rwanda'} />
                        </dl>

                        {amenities.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white">What is included</h2>
                                <ul className="mt-4 flex flex-wrap gap-3">
                                    {amenities.map((a) => (
                                        <li key={a} className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200">
                                            {a}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section>
                            <h2 className="text-xl font-semibold text-white">Description</h2>
                            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-300">{listing.description}</p>
                        </section>

                        {pin.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white">Location</h2>
                                <ListingsMap markers={pin} onOpen={() => undefined} className="mt-4 h-80 w-full rounded-3xl" />
                            </section>
                        )}

                        <SafetyNote kind="visit" />
                    </div>

                    <OwnerPanel
                        owner={listing.landlord}
                        entityType="housing_listing"
                        entityId={listing.id}
                        subject={listing.title}
                        ownerLabel="Landlord"
                    />
                </div>
            </Container>
        </>
    )
}
