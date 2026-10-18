import React, { useEffect, useState } from 'react'
import { LocateFixed, Search } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { useItems, type ItemFilters } from '@/hooks/queries'
import { useUrlState } from '@/hooks/useUrlState'
import { loadCoords, locateMe, PLACE_NAMES, type Coords } from '@/lib/locations'
import { Button } from '@/components/ui/Button'
import { ChipRow } from '@/components/ui/Chips'
import { SelectField, TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'
import { Pagination } from '@/components/ui/Pagination'
import { CardSkeleton, EmptyState, ErrorState } from '@/components/ui/States'
import { ItemCard } from '@/components/listings/ItemCard'

const CATEGORY_CHIPS = [
    { key: 'all', label: 'All' },
    { key: 'rentals', label: 'Rent from Neighbours' },
    { key: 'phones', label: 'Phones' },
    { key: 'electronics', label: 'Laptops & Electronics' },
    { key: 'furniture', label: 'Furniture & Beds' },
    { key: 'appliances', label: 'Room Appliances' },
    { key: 'vehicles', label: 'Motos & Bikes' },
    { key: 'tools', label: 'Workshop Tools' },
    { key: 'clothing', label: 'Clothing & Shoes' },
    { key: 'books', label: 'Books' },
    { key: 'essentials', label: 'Household' },
    { key: 'other', label: 'Other' },
]

const SORTS = [
    { value: 'latest', label: 'Newest first' },
    { value: 'nearest', label: 'Nearest to me' },
    { value: 'price_asc', label: 'Price: low to high' },
    { value: 'price_desc', label: 'Price: high to low' },
]

const CONDITIONS = [
    { value: '', label: 'Any condition' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like new' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
]

const TYPES = [
    { value: '', label: 'Buy or rent' },
    { value: 'sale', label: 'For sale' },
    { value: 'rent', label: 'For rent' },
]

const RADII = [
    { value: '', label: 'Any distance' },
    { value: '5', label: 'Within 5 km' },
    { value: '10', label: 'Within 10 km' },
    { value: '25', label: 'Within 25 km' },
    { value: '50', label: 'Within 50 km' },
]

const PLACE_OPTIONS = [{ value: '', label: 'All Rwanda' }, ...PLACE_NAMES.map((n) => ({ value: n, label: n }))]

export const TradeView: React.FC<{ urgentOnly?: boolean }> = ({ urgentOnly }) => {
    const { params, update, clear } = useUrlState()
    const toast = useToast()

    const category = params.get('category') ?? 'all'
    const sort = params.get('sort') ?? 'latest'
    const page = Number(params.get('page') ?? 1) || 1
    const q = params.get('q') ?? ''

    const [search, setSearch] = useState(q)
    const [coords, setCoords] = useState<Coords | null>(() => loadCoords())
    const [locating, setLocating] = useState(false)

    // Keep the box in step with the address bar (back button, header search).
    useEffect(() => setSearch(q), [q])

    // "Nearest" needs the visitor's position. Ask once; fall back to newest if they decline.
    useEffect(() => {
        if (sort !== 'nearest' || coords) return
        let cancelled = false
        setLocating(true)
        locateMe()
            .then((c) => !cancelled && setCoords(c))
            .catch((e: Error) => {
                if (cancelled) return
                toast.error(e.message)
                update({ sort: undefined })
            })
            .finally(() => !cancelled && setLocating(false))
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, coords])

    const nearest = sort === 'nearest'
    const filters: ItemFilters = {
        category: category === 'all' ? undefined : category,
        type: params.get('type') || undefined,
        location: params.get('location') || undefined,
        q: q || undefined,
        max_price: params.get('max_price') || undefined,
        condition: params.get('condition') || undefined,
        urgent: urgentOnly || params.get('urgent') === '1',
        sort: sort === 'latest' ? undefined : sort,
        page,
        lat: nearest ? coords?.lat : undefined,
        lng: nearest ? coords?.lng : undefined,
        radius: nearest ? params.get('radius') || undefined : undefined,
    }

    // Do not query "nearest" until we know where the visitor is.
    const waitingForLocation = nearest && !coords
    const { data, isLoading, isError, refetch, isFetching } = useItems(waitingForLocation ? { ...filters, sort: undefined } : filters)

    const activeFilters = ['type', 'location', 'q', 'max_price', 'condition', 'radius'].some((k) => params.get(k)) || category !== 'all'

    const title = urgentOnly
        ? 'Urgent Deals'
        : category === 'all'
          ? 'Marketplace'
          : (CATEGORY_CHIPS.find((c) => c.key === category)?.label ?? 'Marketplace')

    const useNearMe = async () => {
        setLocating(true)
        try {
            setCoords(await locateMe())
            update({ sort: 'nearest' })
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Could not get your location.')
        } finally {
            setLocating(false)
        }
    }

    return (
        <>
            <PageHeader
                title={title}
                subtitle={
                    urgentOnly
                        ? 'People who are moving or need to sell fast. Priced to go.'
                        : 'Second-hand goods and things to borrow, from ID-verified sellers near you.'
                }
                crumbs={[{ label: 'Home', to: '/' }, { label: title }]}
            />

            <Container className="py-10">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        update({ q: search.trim() || undefined })
                    }}
                    role="search"
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search phones, sofas, suits…"
                            aria-label="Search listings"
                            className="h-12 w-full rounded-full bg-panel pl-12 pr-5 text-[15px] text-white ring-1 ring-white/10 placeholder:text-slate-500 hover:ring-white/25 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                    <Button type="submit" size="lg">
                        Search
                    </Button>
                    <Button type="button" variant="secondary" size="lg" onClick={useNearMe} loading={locating && !nearest}>
                        <LocateFixed className="size-4" aria-hidden />
                        Near me
                    </Button>
                </form>

                {!urgentOnly && (
                    <div className="mt-6">
                        <ChipRow
                            label="Category"
                            chips={CATEGORY_CHIPS}
                            value={category}
                            onChange={(key) => update({ category: key === 'all' ? undefined : key })}
                        />
                    </div>
                )}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SelectField label="Location" value={params.get('location') ?? ''} options={PLACE_OPTIONS} onChange={(e) => update({ location: e.target.value || undefined })} />
                    <SelectField label="Type" value={params.get('type') ?? ''} options={TYPES} onChange={(e) => update({ type: e.target.value || undefined })} />
                    <SelectField label="Condition" value={params.get('condition') ?? ''} options={CONDITIONS} onChange={(e) => update({ condition: e.target.value || undefined })} />
                    <TextField
                        label="Max price"
                        prefix="RWF"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1000}
                        placeholder="Any"
                        value={params.get('max_price') ?? ''}
                        onChange={(e) => update({ max_price: e.target.value || undefined })}
                    />
                    <SelectField label="Sort by" value={sort} options={SORTS} onChange={(e) => update({ sort: e.target.value === 'latest' ? undefined : e.target.value })} />
                </div>

                {nearest && (
                    <div className="mt-4 max-w-xs">
                        <SelectField label="Distance" value={params.get('radius') ?? ''} options={RADII} onChange={(e) => update({ radius: e.target.value || undefined })} />
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4 text-sm text-slate-300">
                    <p aria-live="polite">
                        {isLoading || waitingForLocation ? 'Loading…' : `${data?.meta.total ?? 0} ${data?.meta.total === 1 ? 'listing' : 'listings'}`}
                        {nearest && coords && ' near you'}
                        {isFetching && !isLoading && <span className="ml-2 text-slate-500">Updating…</span>}
                    </p>
                    {activeFilters && (
                        <button type="button" onClick={clear} className="cursor-pointer font-semibold text-white underline underline-offset-2">
                            Clear all filters
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    {isLoading || waitingForLocation ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }, (_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState onRetry={() => refetch()} />
                    ) : data && data.data.length > 0 ? (
                        <>
                            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {data.data.map((item) => (
                                    <li key={item.id}>
                                        <ItemCard item={item} />
                                    </li>
                                ))}
                            </ul>
                            <Pagination
                                page={data.meta.current_page}
                                lastPage={data.meta.last_page}
                                onChange={(p) => {
                                    update({ page: p > 1 ? String(p) : undefined })
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                            />
                        </>
                    ) : (
                        <EmptyState
                            title="Nothing matches yet"
                            text={
                                activeFilters
                                    ? 'Try removing a filter or searching for something broader.'
                                    : 'Be the first to list something in your neighbourhood.'
                            }
                            action={activeFilters ? undefined : { label: 'Post a listing', to: '/post' }}
                        />
                    )}
                </div>
            </Container>
        </>
    )
}

export const DealsView: React.FC = () => <TradeView urgentOnly />
