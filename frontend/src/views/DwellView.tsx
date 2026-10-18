import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocateFixed, List, MapIcon } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { useListings, type ListingFilters } from '@/hooks/queries'
import { useUrlState } from '@/hooks/useUrlState'
import { loadCoords, locateMe, PLACE_NAMES, type Coords } from '@/lib/locations'
import { formatDistance, formatRwf, rentPerMonth } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { ToggleChip } from '@/components/ui/Chips'
import { SelectField, TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'
import { Pagination } from '@/components/ui/Pagination'
import { CardSkeleton, EmptyState, ErrorState } from '@/components/ui/States'
import { HousingCard } from '@/components/listings/HousingCard'
import { ListingsMap, type MapMarker } from '@/components/map/ListingsMap'

const AMENITIES = [
    { key: 'water', label: 'Water' },
    { key: 'electricity', label: 'Electricity' },
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'furnished', label: 'Furnished' },
    { key: 'parking', label: 'Parking' },
]

const ROOMS = [
    { value: '', label: 'Any rooms' },
    { value: '1', label: '1 room' },
    { value: '2', label: '2 rooms' },
    { value: '3', label: '3 rooms' },
    { value: '4', label: '4+ rooms' },
]

const TYPES = [
    { value: '', label: 'Any type' },
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
]

const SORTS = [
    { value: 'latest', label: 'Newest first' },
    { value: 'nearest', label: 'Nearest to me' },
    { value: 'rent_asc', label: 'Rent: low to high' },
    { value: 'rent_desc', label: 'Rent: high to low' },
]

const RADII = [
    { value: '2', label: 'Within 2 km' },
    { value: '5', label: 'Within 5 km' },
    { value: '10', label: 'Within 10 km' },
    { value: '25', label: 'Within 25 km' },
    { value: '50', label: 'Within 50 km' },
]

const PLACE_OPTIONS = [{ value: '', label: 'All Rwanda' }, ...PLACE_NAMES.map((n) => ({ value: n, label: n }))]

export const DwellView: React.FC = () => {
    const { params, update, clear } = useUrlState()
    const navigate = useNavigate()
    const toast = useToast()

    const sort = params.get('sort') ?? 'latest'
    const nearest = sort === 'nearest'
    const radius = params.get('radius') ?? ''
    const page = Number(params.get('page') ?? 1) || 1
    const view = params.get('view') === 'map' ? 'map' : 'list'
    const amenities = (params.get('amenities') ?? '').split(',').filter(Boolean)
    const q = params.get('q') ?? ''

    const [coords, setCoords] = useState<Coords | null>(() => loadCoords())
    const [locating, setLocating] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [search, setSearch] = useState(q)

    useEffect(() => setSearch(q), [q])

    // "Nearest" and the radius filter both need the visitor's position.
    useEffect(() => {
        if ((!nearest && !radius) || coords) return
        let cancelled = false
        setLocating(true)
        locateMe()
            .then((c) => !cancelled && setCoords(c))
            .catch((e: Error) => {
                if (cancelled) return
                toast.error(e.message)
                update({ sort: undefined, radius: undefined })
            })
            .finally(() => !cancelled && setLocating(false))
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nearest, radius, coords])

    const waitingForLocation = (nearest || Boolean(radius)) && !coords
    const useCoords = !waitingForLocation && (nearest || radius) ? coords : null

    const base: ListingFilters = {
        location: params.get('location') || undefined,
        rooms: params.get('rooms') || undefined,
        max_rent: params.get('max_rent') || undefined,
        amenities: amenities.join(',') || undefined,
        property_type: params.get('property_type') || undefined,
        q: q || undefined,
        sort: sort === 'latest' ? undefined : sort,
        lat: useCoords?.lat,
        lng: useCoords?.lng,
        radius: useCoords && radius ? radius : undefined,
    }

    const listQuery = useListings({ ...base, sort: waitingForLocation ? undefined : base.sort, page })
    const mapQuery = useListings({ ...base, sort: waitingForLocation ? undefined : base.sort, per_page: 100 })

    const markers = useMemo<MapMarker[]>(
        () =>
            (mapQuery.data?.data ?? [])
                .filter((l) => l.latitude != null && l.longitude != null)
                .map((l) => ({
                    id: l.id,
                    lat: l.latitude as number,
                    lng: l.longitude as number,
                    title: l.title,
                    subtitle: `${rentPerMonth(l)}${l.distance_km != null ? ` · ${formatDistance(l.distance_km)}` : ''}`,
                    image: l.images?.[0]?.url,
                    href: `/dwell/${l.id}`,
                })),
        [mapQuery.data],
    )

    const toggleAmenity = (key: string) =>
        update({ amenities: (amenities.includes(key) ? amenities.filter((a) => a !== key) : [...amenities, key]).join(',') || undefined })

    const nearMe = async () => {
        setLocating(true)
        try {
            setCoords(await locateMe())
            update({ sort: 'nearest', radius: radius || '10' })
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Could not get your location.')
        } finally {
            setLocating(false)
        }
    }

    const activeFilters = ['location', 'rooms', 'max_rent', 'amenities', 'property_type', 'q', 'radius'].some((k) => params.get(k)) || nearest
    const total = listQuery.data?.meta.total ?? 0
    const loading = listQuery.isLoading || waitingForLocation

    return (
        <>
            <PageHeader
                title="Shelter & Gueto"
                subtitle="Rooms, studios and houses from landlords you can contact directly. Use the map to see what is around you."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Shelter & Gueto' }]}
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
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by area, street or keyword…"
                        aria-label="Search housing"
                        className="h-12 flex-1 rounded-full bg-panel px-6 text-[15px] text-white ring-1 ring-white/10 placeholder:text-slate-500 hover:ring-white/25 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Button type="submit" size="lg">
                        Search
                    </Button>
                    <Button type="button" variant="secondary" size="lg" onClick={nearMe} loading={locating && !nearest}>
                        <LocateFixed className="size-4" aria-hidden />
                        Houses around me
                    </Button>
                </form>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SelectField label="Where" value={params.get('location') ?? ''} options={PLACE_OPTIONS} onChange={(e) => update({ location: e.target.value || undefined })} />
                    <SelectField label="Rooms" value={params.get('rooms') ?? ''} options={ROOMS} onChange={(e) => update({ rooms: e.target.value || undefined })} />
                    <SelectField label="Type" value={params.get('property_type') ?? ''} options={TYPES} onChange={(e) => update({ property_type: e.target.value || undefined })} />
                    <TextField
                        label="Max rent per month"
                        prefix="RWF"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={5000}
                        placeholder="Any"
                        value={params.get('max_rent') ?? ''}
                        onChange={(e) => update({ max_rent: e.target.value || undefined })}
                    />
                    <SelectField label="Sort by" value={sort} options={SORTS} onChange={(e) => update({ sort: e.target.value === 'latest' ? undefined : e.target.value })} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Must have">
                    <span className="mr-1 text-sm text-slate-400">Must have</span>
                    {AMENITIES.map((a) => (
                        <ToggleChip key={a.key} label={a.label} pressed={amenities.includes(a.key)} onChange={() => toggleAmenity(a.key)} />
                    ))}
                </div>

                {(nearest || radius) && (
                    <div className="mt-5 flex flex-wrap items-end gap-4">
                        <SelectField
                            label="Distance from me"
                            className="w-56"
                            value={radius || '10'}
                            options={RADII}
                            onChange={(e) => update({ radius: e.target.value, sort: 'nearest' })}
                        />
                        <button
                            type="button"
                            onClick={() => update({ radius: undefined, sort: undefined })}
                            className="mb-3 cursor-pointer text-sm text-slate-300 underline underline-offset-2 hover:text-white"
                        >
                            Stop filtering by distance
                        </button>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-slate-300" aria-live="polite">
                        {loading ? 'Loading…' : `${total} ${total === 1 ? 'place' : 'places'}`}
                        {useCoords && radius && ` within ${radius} km of you`}
                        {activeFilters && !loading && (
                            <button type="button" onClick={clear} className="ml-4 cursor-pointer font-semibold text-white underline underline-offset-2">
                                Clear all filters
                            </button>
                        )}
                    </p>

                    {/* Phones and tablets show one view at a time. */}
                    <div className="flex rounded-full bg-panel p-1 ring-1 ring-white/10 lg:hidden" role="group" aria-label="View">
                        {(['list', 'map'] as const).map((v) => (
                            <button
                                key={v}
                                type="button"
                                aria-pressed={view === v}
                                onClick={() => update({ view: v === 'list' ? undefined : 'map' }) }
                                className={`flex h-9 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
                                    view === v ? 'bg-white text-[#111111]' : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {v === 'list' ? <List className="size-4" aria-hidden /> : <MapIcon className="size-4" aria-hidden />}
                                {v === 'list' ? 'List' : 'Map'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                    <div className={view === 'map' ? 'hidden lg:block' : ''}>
                        {loading ? (
                            <div className="grid gap-5 sm:grid-cols-2">
                                {Array.from({ length: 4 }, (_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : listQuery.isError ? (
                            <ErrorState onRetry={() => listQuery.refetch()} />
                        ) : listQuery.data && listQuery.data.data.length > 0 ? (
                            <>
                                <ul className="grid gap-5 sm:grid-cols-2">
                                    {listQuery.data.data.map((l) => (
                                        <li key={l.id} onMouseEnter={() => setSelectedId(l.id)} onMouseLeave={() => setSelectedId(null)}>
                                            <HousingCard listing={l} highlighted={selectedId === l.id} />
                                        </li>
                                    ))}
                                </ul>
                                <Pagination
                                    page={listQuery.data.meta.current_page}
                                    lastPage={listQuery.data.meta.last_page}
                                    onChange={(p) => {
                                        update({ page: p > 1 ? String(p) : undefined })
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                />
                            </>
                        ) : (
                            <EmptyState
                                title="No places match yet"
                                text={
                                    activeFilters
                                        ? 'Try a wider distance, fewer must-haves or a higher budget.'
                                        : 'No rooms or houses have been listed yet.'
                                }
                                action={activeFilters ? undefined : { label: 'List a place', to: '/post/housing' }}
                            />
                        )}
                    </div>

                    <div className={view === 'list' ? 'hidden lg:block' : ''}>
                        <div className="sticky top-44">
                            <ListingsMap
                                markers={markers}
                                me={useCoords}
                                radiusKm={useCoords && radius ? Number(radius) : null}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onOpen={(href) => navigate(href)}
                                className="h-[70vh] min-h-[420px] w-full rounded-3xl ring-1 ring-white/10"
                            />
                            <p className="mt-3 text-xs text-slate-400">
                                {markers.length} of {mapQuery.data?.meta.total ?? 0} places have a pinned location
                                {useCoords ? ' · the blue dot is you' : ''}
                                {params.get('max_rent') ? ` · under ${formatRwf(Number(params.get('max_rent')))}` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}
