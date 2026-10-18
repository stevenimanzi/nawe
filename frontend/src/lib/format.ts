import type { Condition, HousingAmenity, HousingListing, ItemCategory, MarketplaceItem, PropertyType, RentPeriod } from '@/types'

export const formatRwf = (amount: number) => `RWF ${amount.toLocaleString('en-US')}`

const PERIOD_LABEL: Record<RentPeriod, string> = { day: 'day', week: 'week', month: 'month' }

/** "RWF 150,000" for sales, "RWF 8,000 / day" for rentals. */
export function itemPrice(item: Pick<MarketplaceItem, 'price' | 'listing_type' | 'rent_period'>) {
    return item.listing_type === 'rent' && item.rent_period
        ? `${formatRwf(item.price)} / ${PERIOD_LABEL[item.rent_period]}`
        : formatRwf(item.price)
}

export const rentPerMonth = (listing: Pick<HousingListing, 'monthly_rent'>) => `${formatRwf(listing.monthly_rent)} / month`

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
    phones: 'Phones',
    electronics: 'Laptops & Electronics',
    furniture: 'Furniture & Beds',
    appliances: 'Room Appliances',
    vehicles: 'Motos & Bikes',
    tools: 'Workshop Tools',
    clothing: 'Clothing & Shoes',
    books: 'Books',
    essentials: 'Household Essentials',
    other: 'Other',
    tvet_tools: 'Workshop Tools',
}

export const CONDITION_LABEL: Record<Condition, string> = {
    new: 'New',
    like_new: 'Like new',
    good: 'Good',
    fair: 'Fair',
}

export const PROPERTY_LABEL: Record<PropertyType, string> = {
    room: 'Room',
    studio: 'Studio',
    house: 'House',
    apartment: 'Apartment',
}

export function timeAgo(iso?: string) {
    if (!iso) return ''
    const seconds = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
    const units: [number, string][] = [
        [60 * 60 * 24 * 30, 'month'],
        [60 * 60 * 24 * 7, 'week'],
        [60 * 60 * 24, 'day'],
        [60 * 60, 'hour'],
        [60, 'minute'],
    ]
    for (const [size, name] of units) {
        if (seconds >= size) {
            const n = Math.floor(seconds / size)
            return `${n} ${name}${n > 1 ? 's' : ''} ago`
        }
    }
    return 'Just now'
}

export const formatDistance = (km: number | null | undefined) =>
    km == null ? null : km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`

export const amenityLabels = (a?: HousingAmenity) =>
    a
        ? [
              a.has_water && 'Water',
              a.has_electricity && 'Electricity',
              a.has_wifi && 'Wi-Fi',
              a.is_furnished && 'Furnished',
              a.has_parking && 'Parking',
          ].filter((x): x is string => Boolean(x))
        : []
