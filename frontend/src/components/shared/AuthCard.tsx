import React from 'react'
import { Link } from 'react-router-dom'
import logoWhite from '@/assets/brand/logo-white.svg'

interface AuthCardProps {
    title: string
    subtitle: string
    children: React.ReactNode
    footer: React.ReactNode
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, footer }) => (
    <div className="flex min-h-[70vh] items-center justify-center px-[30px] py-14">
        <div className="w-full max-w-md">
            <Link to="/" className="mb-8 flex justify-center" aria-label="NAWE home">
                <img src={logoWhite} alt="NAWE" className="h-12 w-auto" />
            </Link>
            <div className="rounded-3xl bg-panel p-8 ring-1 ring-white/10 sm:p-10">
                <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{subtitle}</p>
                <div className="mt-8">{children}</div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400">{footer}</p>
        </div>
    </div>
)
