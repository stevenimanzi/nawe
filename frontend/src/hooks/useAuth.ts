import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { KycVerification, User } from '@/types';

export function useAuthUser() {
    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: async () => {
            const token = localStorage.getItem('nawe_token');
            if (!token) return null;
            try {
                const response = await api.get('/v1/auth/me');
                return response.data.data as User;
            } catch {
                return null;
            }
        },
        retry: false,
    });
}

export function useKycStatus() {
    return useQuery({
        queryKey: ['auth', 'kyc'],
        queryFn: async () => {
            const token = localStorage.getItem('nawe_token');
            if (!token) return null;
            try {
                const response = await api.get('/v1/kyc');
                return response.data.data as KycVerification;
            } catch {
                return null;
            }
        },
        retry: false,
    });
}
