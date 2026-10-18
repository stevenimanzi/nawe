import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useKyc } from '@/hooks/queries'
import { Spinner } from '@/components/ui/States'
import { Gate } from './Gate'

/** Listing is for verified people only: show the right next step if the ID check is not finished. */
export const RequireVerified: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, refresh } = useAuth()
    const { data: kyc, isLoading } = useKyc()

    // The admin may have approved the ID since the page was first loaded.
    useEffect(() => {
        void refresh()
    }, [refresh])

    if (!user) return null
    if (user.role === 'admin' || user.is_kyc_verified) return <>{children}</>
    if (isLoading) return <Spinner />

    if (kyc?.status === 'pending' || kyc?.status === 'in_review') {
        return (
            <Gate
                title="Your ID is being reviewed"
                text="Thanks for submitting your documents. You will be able to post as soon as the review is done, usually within one working day."
                action={{ label: 'View verification status', to: '/kyc' }}
            />
        )
    }

    if (kyc?.status === 'rejected') {
        return (
            <Gate
                title="We could not approve your ID"
                text={kyc.rejection_reason ? `Reason: ${kyc.rejection_reason}` : 'Please submit clear photos of a valid ID again.'}
                action={{ label: 'Submit your ID again', to: '/kyc' }}
            />
        )
    }

    return (
        <Gate
            title="Verify your ID to start posting"
            text="Every seller and landlord on NAWE is ID verified, so buyers and tenants can trust who they deal with. It takes about two minutes."
            action={{ label: 'Verify my ID', to: '/kyc' }}
        />
    )
}
