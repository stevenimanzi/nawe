import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Where the Laravel API runs. Override with API_TARGET=http://localhost:8001 npm run dev
const target = process.env.API_TARGET ?? 'http://localhost:8000'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': { target, changeOrigin: true },
            // Uploaded photos are served by Laravel from /storage.
            '/storage': { target, changeOrigin: true },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})
