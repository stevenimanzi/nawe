import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import queryClient from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthProvider'
import { ToastProvider } from '@/context/ToastProvider'
import App from './App'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ToastProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ToastProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
