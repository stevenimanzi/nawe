import React from 'react'
import { useFavorites } from '@/hooks/queries'
import { Container, PageHeader } from '@/components/ui/Layout'
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States'
import { HousingCard } from '@/components/listings/HousingCard'
import { ItemCard } from '@/components/listings/ItemCard'

export const WishlistView: React.FC = () => {
    const { data, isLoading, isError, refetch } = useFavorites()

    return (
        <>
            <PageHeader title="Wishlist" subtitle="Items and places you saved. Tap the heart again to remove one." crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
            <Container className="py-10">
                {isLoading ? (
                    <Spinner />
                ) : isError || !data ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : data.items.length === 0 && data.listings.length === 0 ? (
                    <EmptyState
                        title="Nothing saved yet"
                        text="Tap the heart on any listing to keep it here."
                        action={{ label: 'Browse the marketplace', to: '/trade' }}
                    />
                ) : (
                    <div className="space-y-14">
                        {data.items.length > 0 && (
                            <section>
                                <h2 className="mb-6 text-2xl font-semibold text-white">Items ({data.items.length})</h2>
                                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {data.items.map((item) => (
                                        <li key={item.id}>
                                            <ItemCard item={item} />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        {data.listings.length > 0 && (
                            <section>
                                <h2 className="mb-6 text-2xl font-semibold text-white">Rooms and houses ({data.listings.length})</h2>
                                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {data.listings.map((l) => (
                                        <li key={l.id}>
                                            <HousingCard listing={l} />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </Container>
        </>
    )
}
