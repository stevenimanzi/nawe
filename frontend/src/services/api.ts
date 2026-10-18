import axios, { AxiosError } from 'axios'

export const TOKEN_KEY = 'nawe_token'
export const UNAUTHORIZED_EVENT = 'nawe:unauthorized'

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Let the browser set the multipart boundary for file uploads.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // An expired or revoked token: tell the app so it can sign the user out gracefully.
        if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }

        return Promise.reject(error)
    },
)

interface ApiErrorBody {
    message?: string
    code?: string
    errors?: Record<string, string[]>
}

/** A readable message for any failed request. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        if (!error.response) return 'Cannot reach the server. Check your connection and try again.'
        const firstField = Object.values(error.response.data?.errors ?? {})[0]?.[0]
        return firstField ?? error.response.data?.message ?? fallback
    }
    return fallback
}

/** Field-by-field validation errors from a 422 response. */
export function fieldErrors(error: unknown): Record<string, string> {
    if (axios.isAxiosError<ApiErrorBody>(error) && error.response?.status === 422) {
        return Object.fromEntries(
            Object.entries(error.response.data?.errors ?? {}).map(([k, v]) => [k, v[0]]),
        )
    }
    return {}
}

export function errorCode(error: unknown): string | undefined {
    return axios.isAxiosError<ApiErrorBody>(error) ? error.response?.data?.code : undefined
}

export default api
