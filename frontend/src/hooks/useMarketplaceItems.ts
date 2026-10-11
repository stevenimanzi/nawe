import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { MarketplaceItem } from '@/types';

interface MarketplaceFilterParams {
    category?: string;
    condition?: string;
    max_price?: number;
}

export function useMarketplaceItems(filters: MarketplaceFilterParams = {}) {
    return useQuery({
        queryKey: ['trade', 'items', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.category && filters.category !== 'all') {
                params.append('category', filters.category);
            }
            if (filters.condition) params.append('condition', filters.condition);
            if (filters.max_price) params.append('max_price', filters.max_price.toString());

            const response = await api.get(`/v1/trade/items?${params.toString()}`);
            return response.data.data as MarketplaceItem[];
        },
        staleTime: 1000 * 60 * 5,
    });
}
