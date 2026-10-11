import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { HousingListing } from '@/types';

interface HousingFilterParams {
    max_rent?: number;
    rooms?: number;
}

export function useHousingListings(filters: HousingFilterParams = {}) {
    return useQuery({
        queryKey: ['dwell', 'listings', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.max_rent) params.append('max_rent', filters.max_rent.toString());
            if (filters.rooms) params.append('rooms', filters.rooms.toString());

            const response = await api.get(`/v1/dwell/listings?${params.toString()}`);
            return response.data.data as HousingListing[];
        },
        staleTime: 1000 * 60 * 5,
    });
}
