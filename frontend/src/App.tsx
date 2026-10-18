import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Spinner } from '@/components/ui/States'
import { HomeView } from '@/views/HomeView'

/** Pages load on demand so the first visit stays fast. */
const page = <T extends Record<string, React.ComponentType>>(load: () => Promise<T>, name: keyof T) =>
    lazy(async () => ({ default: (await load())[name] }))

const AboutView = page(() => import('@/views/AboutView'), 'AboutView')
const TradeView = page(() => import('@/views/TradeView'), 'TradeView')
const DealsView = page(() => import('@/views/TradeView'), 'DealsView')
const ItemView = page(() => import('@/views/ItemView'), 'ItemView')
const DwellView = page(() => import('@/views/DwellView'), 'DwellView')
const ListingView = page(() => import('@/views/ListingView'), 'ListingView')
const PostView = page(() => import('@/views/PostViews'), 'PostView')
const PostItemView = page(() => import('@/views/PostViews'), 'PostItemView')
const PostHousingView = page(() => import('@/views/PostViews'), 'PostHousingView')
const EditItemView = page(() => import('@/views/PostViews'), 'EditItemView')
const EditHousingView = page(() => import('@/views/PostViews'), 'EditHousingView')
const AccountView = page(() => import('@/views/AccountView'), 'AccountView')
const MessagesView = page(() => import('@/views/MessagesView'), 'MessagesView')
const WishlistView = page(() => import('@/views/WishlistView'), 'WishlistView')
const KycView = page(() => import('@/views/KycView'), 'KycView')
const AdminView = page(() => import('@/views/AdminView'), 'AdminView')
const LoginView = page(() => import('@/views/LoginView'), 'LoginView')
const RegisterView = page(() => import('@/views/RegisterView'), 'RegisterView')
const ContactView = page(() => import('@/views/InfoViews'), 'ContactView')
const HelpView = page(() => import('@/views/InfoViews'), 'HelpView')
const SafetyView = page(() => import('@/views/InfoViews'), 'SafetyView')
const LandlordGuideView = page(() => import('@/views/InfoViews'), 'LandlordGuideView')
const ReportInfoView = page(() => import('@/views/InfoViews'), 'ReportInfoView')
const TermsView = page(() => import('@/views/InfoViews'), 'TermsView')
const PrivacyView = page(() => import('@/views/InfoViews'), 'PrivacyView')
const CookiesView = page(() => import('@/views/InfoViews'), 'CookiesView')
const NotFoundView = page(() => import('@/views/InfoViews'), 'NotFoundView')

const signedIn = (node: React.ReactNode) => <ProtectedRoute>{node}</ProtectedRoute>

export default function App() {
    const { pathname } = useLocation()

    // Start each page at the top when navigating.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="w-full min-h-screen bg-canvas text-ink flex flex-col font-sans m-0 p-0">
            <Header />
            <main className="w-full flex-1 bg-canvas m-0 p-0 min-h-[40vh]">
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path="/" element={<HomeView />} />
                        <Route path="/about" element={<AboutView />} />

                        <Route path="/trade" element={<TradeView />} />
                        <Route path="/trade/:id" element={<ItemView />} />
                        <Route path="/deals" element={<DealsView />} />
                        <Route path="/dwell" element={<DwellView />} />
                        <Route path="/dwell/:id" element={<ListingView />} />

                        <Route path="/post" element={signedIn(<PostView />)} />
                        <Route path="/post/item" element={signedIn(<PostItemView />)} />
                        <Route path="/post/housing" element={signedIn(<PostHousingView />)} />
                        <Route path="/account" element={signedIn(<AccountView />)} />
                        <Route path="/account/edit/item/:id" element={signedIn(<EditItemView />)} />
                        <Route path="/account/edit/housing/:id" element={signedIn(<EditHousingView />)} />
                        <Route path="/messages" element={signedIn(<MessagesView />)} />
                        <Route path="/wishlist" element={signedIn(<WishlistView />)} />
                        <Route path="/kyc" element={signedIn(<KycView />)} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminView />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/login" element={<LoginView />} />
                        <Route path="/register" element={<RegisterView />} />
                        <Route path="/signup" element={<Navigate to="/register" replace />} />

                        <Route path="/contact" element={<ContactView />} />
                        <Route path="/help" element={<HelpView />} />
                        <Route path="/safety" element={<SafetyView />} />
                        <Route path="/guides/landlords" element={<LandlordGuideView />} />
                        <Route path="/report" element={<ReportInfoView />} />
                        <Route path="/terms" element={<TermsView />} />
                        <Route path="/privacy" element={<PrivacyView />} />
                        <Route path="/cookies" element={<CookiesView />} />

                        <Route path="*" element={<NotFoundView />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
