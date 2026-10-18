import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import type {
    AdminKycRecord,
    AdminReport,
    Conversation,
    EntityType,
    HousingListing,
    KycVerification,
    MarketplaceItem,
    Message,
    Paginated,
} from '@/types'

type Params = Record<string, string | number | boolean | undefined | null>

/** Drops empty values so they never reach the query string. */
function clean(params: Params) {
    return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false))
}

/* ---------------- Marketplace ---------------- */

export interface ItemFilters extends Params {
    category?: string
    type?: string
    location?: string
    q?: string
    max_price?: number | string
    condition?: string
    urgent?: boolean
    sort?: string
    page?: number
    lat?: number
    lng?: number
    radius?: number | string
}

export function useItems(filters: ItemFilters) {
    return useQuery({
        queryKey: ['items', filters],
        queryFn: async () => (await api.get('/v1/trade/items', { params: clean(filters) })).data as Paginated<MarketplaceItem>,
        placeholderData: keepPreviousData,
    })
}

export function useItem(id: string | undefined) {
    return useQuery({
        queryKey: ['item', id],
        queryFn: async () => (await api.get(`/v1/trade/items/${id}`)).data.data as MarketplaceItem,
        enabled: Boolean(id),
        retry: false,
    })
}

/* ---------------- Housing ---------------- */

export interface ListingFilters extends Params {
    location?: string
    rooms?: number | string
    max_rent?: number | string
    amenities?: string
    property_type?: string
    q?: string
    sort?: string
    page?: number
    per_page?: number
    lat?: number
    lng?: number
    radius?: number | string
}

export function useListings(filters: ListingFilters) {
    return useQuery({
        queryKey: ['listings', filters],
        queryFn: async () => (await api.get('/v1/dwell/listings', { params: clean(filters) })).data as Paginated<HousingListing>,
        placeholderData: keepPreviousData,
    })
}

export function useListing(id: string | undefined) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: async () => (await api.get(`/v1/dwell/listings/${id}`)).data.data as HousingListing,
        enabled: Boolean(id),
        retry: false,
    })
}

export function useMyListings() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['my-listings'],
        queryFn: async () =>
            (await api.get('/v1/me/listings')).data.data as { items: MarketplaceItem[]; listings: HousingListing[] },
        enabled: Boolean(user),
    })
}

/* ---------------- Favorites ---------------- */

export function useFavoriteIds() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['favorite-ids'],
        queryFn: async () => (await api.get('/v1/favorites/ids')).data.data as { type: EntityType; id: number }[],
        enabled: Boolean(user),
        staleTime: 60_000,
    })
}

export function useFavorites() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['favorites'],
        queryFn: async () =>
            (await api.get('/v1/favorites')).data.data as { items: MarketplaceItem[]; listings: HousingListing[] },
        enabled: Boolean(user),
    })
}

export function useToggleFavorite() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ type, id, saved }: { type: EntityType; id: number; saved: boolean }) => {
            if (saved) await api.delete(`/v1/favorites/${type}/${id}`)
            else await api.post('/v1/favorites', { type, id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorite-ids'] })
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

/* ---------------- Messages ---------------- */

export function useConversations() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => (await api.get('/v1/messages/conversations')).data.data as Conversation[],
        enabled: Boolean(user),
        refetchInterval: 20_000,
    })
}

export function useThread(params: { with: number; entity_type: EntityType; entity_id: number } | null) {
    return useQuery({
        queryKey: ['thread', params],
        queryFn: async () => (await api.get('/v1/messages/thread', { params })).data.data as Message[],
        enabled: Boolean(params),
        refetchInterval: 8_000,
    })
}

export function useUnreadCount() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['unread-count'],
        queryFn: async () => (await api.get('/v1/messages/unread-count')).data.data.count as number,
        enabled: Boolean(user),
        refetchInterval: 30_000,
    })
}

export function useSendMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: {
            receiver_id: number
            messageable_type: EntityType
            messageable_id: number
            content: string
        }) => (await api.post('/v1/messages', payload)).data.data as Message,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thread'] })
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
            queryClient.invalidateQueries({ queryKey: ['unread-count'] })
        },
    })
}

/* ---------------- Verification (KYC) ---------------- */

export function useKyc() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['kyc'],
        queryFn: async () => {
            try {
                return (await api.get('/v1/kyc')).data.data as KycVerification
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) return null
                throw error
            }
        },
        enabled: Boolean(user),
    })
}

/* ---------------- Admin ---------------- */

export function useAdminKyc(status: string) {
    return useQuery({
        queryKey: ['admin-kyc', status],
        queryFn: async () => (await api.get('/v1/admin/kyc', { params: { status } })).data.data as AdminKycRecord[],
    })
}

export function useAdminReports(status: string) {
    return useQuery({
        queryKey: ['admin-reports', status],
        queryFn: async () => (await api.get('/v1/admin/reports', { params: { status } })).data.data as AdminReport[],
    })
}

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () =>
            (await api.get('/v1/admin/stats')).data.data as {
                items: number
                listings: number
                pending_kyc: number
                open_reports: number
            },
    })
}
