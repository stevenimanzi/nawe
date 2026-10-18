import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useItem, useListing } from '@/hooks/queries'
import api, { errorMessage } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Container, PageHeader } from '@/components/ui/Layout'
import { EmptyState, Spinner } from '@/components/ui/States'
import { Gate } from '@/components/listings/Gate'
import { HousingForm } from '@/components/listings/HousingForm'
import { ItemForm } from '@/components/listings/ItemForm'
import { RequireVerified } from '@/components/listings/RequireVerified'

const Narrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Container className="py-10">
        <div className="mx-auto max-w-3xl">{children}</div>
    </Container>
)

/** /post: choose what to list. */
export const PostView: React.FC = () => {
    const choices = [
        {
            to: '/post/item',
            title: 'Sell or rent out an item',
            text: 'Phones, furniture, tools, a suit, a washing machine. Sell it, or lend it by the day.',
        },
        {
            to: '/post/housing',
            title: 'List a room or house',
            text: 'Find a tenant for your room, studio or house. You need a landlord account.',
        },
    ]

    return (
        <>
            <PageHeader title="Post a listing" subtitle="Your first listing is free. What would you like to list?" crumbs={[{ label: 'Home', to: '/' }, { label: 'Post a listing' }]} />
            <Container className="py-10">
                <ul className="grid gap-6 md:grid-cols-2">
                    {choices.map((c) => (
                        <li key={c.to}>
                            <Link
                                to={c.to}
                                className="group flex h-full flex-col rounded-3xl bg-panel p-8 ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-white/30 sm:p-10"
                            >
                                <h2 className="text-2xl font-bold text-white">{c.title}</h2>
                                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-300">{c.text}</p>
                                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                                    Get started
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container>
        </>
    )
}

export const PostItemView: React.FC = () => (
    <>
        <PageHeader
            title="Sell or rent out an item"
            subtitle="Clear photos and an honest description get the fastest replies."
            crumbs={[{ label: 'Home', to: '/' }, { label: 'Post a listing', to: '/post' }, { label: 'Item' }]}
        />
        <Narrow>
            <RequireVerified>
                <ItemForm />
            </RequireVerified>
        </Narrow>
    </>
)

/** Landlords only. Members can switch their account type right here. */
const LandlordOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, refresh } = useAuth()
    const toast = useToast()
    const [busy, setBusy] = useState(false)

    if (!user) return null
    if (user.role === 'landlord' || user.role === 'admin') return <>{children}</>

    const switchRole = async () => {
        setBusy(true)
        try {
            const { data } = await api.patch('/v1/auth/profile', { role: 'landlord' })
            setUser(data.data)
            await refresh()
            toast.success('Your account is now a landlord account')
        } catch (err) {
            toast.error(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="mx-auto max-w-xl rounded-3xl bg-panel p-8 text-center ring-1 ring-white/10 sm:p-12">
            <h2 className="text-2xl font-semibold text-white">Switch to a landlord account</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                Only landlord accounts can list rooms and houses. Switching keeps your messages, saved listings and items.
            </p>
            <Button size="lg" loading={busy} onClick={switchRole} className="mt-8">
                Switch to landlord
            </Button>
        </div>
    )
}

export const PostHousingView: React.FC = () => (
    <>
        <PageHeader
            title="List a room or house"
            subtitle="Pin it on the map so people nearby can find it."
            crumbs={[{ label: 'Home', to: '/' }, { label: 'Post a listing', to: '/post' }, { label: 'Room or house' }]}
        />
        <Narrow>
            <LandlordOnly>
                <RequireVerified>
                    <HousingForm />
                </RequireVerified>
            </LandlordOnly>
        </Narrow>
    </>
)

export const EditItemView: React.FC = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { data: item, isLoading, isError } = useItem(id)

    if (isLoading) return <Spinner />
    if (isError || !item) return <EmptyState title="Listing not found" action={{ label: 'Back to my account', to: '/account' }} />
    if (item.seller?.id !== user?.id && user?.role !== 'admin') {
        return <Gate title="This is not your listing" text="You can only edit listings you posted." action={{ label: 'Back to my account', to: '/account' }} />
    }

    return (
        <>
            <PageHeader title="Edit listing" crumbs={[{ label: 'Account', to: '/account' }, { label: item.title }]} />
            <Narrow>
                <ItemForm item={item} />
            </Narrow>
        </>
    )
}

export const EditHousingView: React.FC = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { data: listing, isLoading, isError } = useListing(id)

    if (isLoading) return <Spinner />
    if (isError || !listing) return <EmptyState title="Listing not found" action={{ label: 'Back to my account', to: '/account' }} />
    if (listing.landlord?.id !== user?.id && user?.role !== 'admin') {
        return <Gate title="This is not your listing" text="You can only edit listings you posted." action={{ label: 'Back to my account', to: '/account' }} />
    }

    return (
        <>
            <PageHeader title="Edit listing" crumbs={[{ label: 'Account', to: '/account' }, { label: listing.title }]} />
            <Narrow>
                <HousingForm listing={listing} />
            </Narrow>
        </>
    )
}
