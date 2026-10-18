import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapPin, Pencil } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useItem } from '@/hooks/queries'
import { CATEGORY_LABEL, CONDITION_LABEL, itemPrice, timeAgo } from '@/lib/format'
import { Container, PageHeader } from '@/components/ui/Layout'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, Spinner } from '@/components/ui/States'
import { FavoriteButton } from '@/components/listings/FavoriteButton'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { OwnerPanel } from '@/components/listings/OwnerPanel'
import { CopyLinkButton, Fact, SafetyNote } from '@/components/listings/DetailBits'
import { Pill } from '@/components/listings/ItemCard'
import { ListingsMap } from '@/components/map/ListingsMap'

export const ItemView: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { data: item, isLoading, isError } = useItem(id)

    if (isLoading) return <Spinner />
    if (isError || !item) {
        return (
            <EmptyState
                title="We could not find that listing"
                text="It may have been removed by the seller."
                action={{ label: 'Browse the marketplace', to: '/trade' }}
            />
        )
    }

    const isOwner = user?.id === item.seller?.id
    // Round to about a kilometre: the seller's exact spot is shared in a message, not on a public map.
    const area =
        item.latitude != null && item.longitude != null
            ? [{ id: item.id, lat: Number(item.latitude.toFixed(2)), lng: Number(item.longitude.toFixed(2)), title: item.title, subtitle: item.location ?? 'Approximate area', href: '' }]
            : []

    return (
        <>
            <PageHeader
                title={item.title}
                crumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Marketplace', to: '/trade' },
                    { label: CATEGORY_LABEL[item.category], to: `/trade?category=${item.category}` },
                    { label: item.title },
                ]}
            />

            <Container className="py-10">
                {item.status !== 'active' && (
                    <p role="status" className="mb-6 rounded-2xl bg-panel-2 px-5 py-4 text-sm font-medium text-white ring-1 ring-white/15">
                        {item.status === 'sold' ? 'This item has been sold.' : 'This listing is no longer available.'}
                    </p>
                )}

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="space-y-8">
                        <ImageGallery images={item.images} title={item.title} />

                        <section>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-3xl font-bold text-white">{itemPrice(item)}</p>
                                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-4" aria-hidden />
                                            {item.location ?? 'Rwanda'}
                                        </span>
                                        <span>Posted {timeAgo(item.created_at)}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <FavoriteButton type="marketplace_item" id={item.id} withLabel />
                                    <CopyLinkButton />
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.listing_type === 'rent' && <Pill tone="light">For rent</Pill>}
                                {item.is_urgent && <Pill>Urgent</Pill>}
                            </div>

                            {isOwner && (
                                <ButtonLink to={`/account/edit/item/${item.id}`} variant="secondary" size="sm" className="mt-5">
                                    <Pencil className="size-4" aria-hidden />
                                    Edit listing
                                </ButtonLink>
                            )}
                        </section>

                        <dl className="grid grid-cols-2 gap-6 rounded-3xl bg-panel p-6 ring-1 ring-white/10 sm:grid-cols-4">
                            <Fact label="Category" value={CATEGORY_LABEL[item.category]} />
                            <Fact label="Condition" value={CONDITION_LABEL[item.condition]} />
                            <Fact label="Type" value={item.listing_type === 'rent' ? 'For rent' : 'For sale'} />
                            <Fact label="Location" value={item.location ?? 'Rwanda'} />
                        </dl>

                        <section>
                            <h2 className="text-xl font-semibold text-white">Description</h2>
                            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-300">{item.description}</p>
                        </section>

                        {area.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white">Approximate area</h2>
                                <p className="mt-1 text-sm text-slate-400">The seller shares the exact spot when you message them.</p>
                                <ListingsMap markers={area} onOpen={() => undefined} className="mt-4 h-72 w-full rounded-3xl" />
                            </section>
                        )}

                        <SafetyNote kind="meet" />
                    </div>

                    <OwnerPanel
                        owner={item.seller}
                        entityType="marketplace_item"
                        entityId={item.id}
                        subject={item.title}
                        ownerLabel="Seller"
                    />
                </div>

                <p className="mt-12 text-sm text-slate-400">
                    <button type="button" onClick={() => navigate(-1)} className="cursor-pointer underline underline-offset-2 hover:text-white">
                        Back to results
                    </button>{' '}
                    or{' '}
                    <Link to="/trade" className="underline underline-offset-2 hover:text-white">
                        browse the marketplace
                    </Link>
                    .
                </p>
            </Container>
        </>
    )
}
