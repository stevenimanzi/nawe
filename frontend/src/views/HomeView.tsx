import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Repeat,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { GuetoFinder } from '@/components/home/GuetoFinder';
import { ItemCard } from '@/components/listings/ItemCard';
import { HousingCard } from '@/components/listings/HousingCard';
import { useItems, useListings } from '@/hooks/queries';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PHOTOS, unsplash } from '@/lib/photos';
import neighbourhood from '@/assets/photos/neighbourhood.webp';

/* ------------------------------------------------------------------ */
/* Helpers & Data                                                      */
/* ------------------------------------------------------------------ */

const Photo: React.FC<{ k: string; width?: number; className?: string }> = ({ k, width = 800, className = '' }) => (
    <img
        src={unsplash(PHOTOS[k]?.id ?? 'photo-1592890288564-76628a30a657', width)}
        alt={PHOTOS[k]?.alt ?? 'Product image'}
        loading="lazy"
        decoding="async"
        className={className}
    />
);

interface HubItem {
    id: string;
    name: string;
    category: string;
    location: string;
    timing: string;
    badgeText: string;
    badgeType: 'yellow' | 'emerald' | 'rose' | 'amber';
    to: string;
}

const HUBS: HubItem[] = [
    {
        id: 'rp-musanze',
        name: 'RP Musanze Campus',
        category: 'TVET & Student Tech',
        location: 'Musanze, Muhoza',
        timing: '50m to Campus Gate',
        badgeText: 'Campus prices',
        badgeType: 'yellow',
        to: '/trade?location=Musanze',
    },
    {
        id: 'kigali-tech',
        name: 'Kigali Tech Refurb',
        category: 'Laptops & Phones',
        location: 'Kigali City Center',
        timing: 'Tested & Verified',
        badgeText: 'Zero broker fee',
        badgeType: 'yellow',
        to: '/trade?category=electronics',
    },
    {
        id: 'student-hostels',
        name: 'Verified Hostels (Gueto)',
        category: 'Student Housing',
        location: 'Musanze & Huye',
        timing: 'Direct Landlord Keys',
        badgeText: 'No Commission',
        badgeType: 'emerald',
        to: '/dwell',
    },
    {
        id: 'ur-huye',
        name: 'UR Huye Student Hub',
        category: 'Textbooks & Supplies',
        location: 'Huye, Ngoma',
        timing: 'Student Peer Trade',
        badgeText: 'Student Deals',
        badgeType: 'amber',
        to: '/trade?location=Huye',
    },
    {
        id: 'workshop-tools',
        name: 'TVET Workshop Kits',
        category: 'Tools & Machinery',
        location: 'Musanze & Kigali',
        timing: 'Certified Gear',
        badgeText: 'Save up to 50%',
        badgeType: 'rose',
        to: '/trade?category=tools',
    },
    {
        id: 'rubavu-mobility',
        name: 'Rubavu Lake Mobility',
        category: 'Motos & Bicycles',
        location: 'Rubavu, Gisenyi',
        timing: 'Daily Rentals & Sale',
        badgeText: 'Daily rentals',
        badgeType: 'emerald',
        to: '/trade?category=vehicles',
    },
    {
        id: 'urgent-moving',
        name: 'Urgent Moving Sales',
        category: 'Furniture & Appliances',
        location: 'All Rwanda',
        timing: 'Instant Collection',
        badgeText: 'Urgent deals',
        badgeType: 'rose',
        to: '/deals',
    },
];

const CHIP_FILTERS = [
    { id: 'all', label: 'All Items' },
    { id: 'urgent', label: 'Urgent Deals' },
    { id: 'shelter', label: 'Rooms & Gueto' },
    { id: 'phones', label: 'Used Phones' },
    { id: 'electronics', label: 'Laptops & Tech' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'tools', label: 'TVET Tools' },
    { id: 'vehicles', label: 'Motos & Bikes' },
    { id: 'rentals', label: 'Rent by the Day' },
];

interface CuratedProduct {
    id: string;
    title: string;
    price: string;
    condition: string;
    location: string;
    badge?: string;
    badgeType?: 'yellow' | 'emerald' | 'rose' | 'amber';
    photoKey: string;
    to: string;
}

const CURATED_PRODUCTS: CuratedProduct[] = [
    {
        id: 'cp-1',
        title: 'Dell Latitude 7490 i7 16GB / 512GB SSD',
        price: '185,000 RWF',
        condition: 'Like New · Ready for Coding',
        location: 'Musanze, Muhoza',
        badge: 'Save 40%',
        badgeType: 'yellow',
        photoKey: 'electronics',
        to: '/trade?category=electronics',
    },
    {
        id: 'cp-2',
        title: 'Modern Furnished Studio Gueto near RP College',
        price: '45,000 RWF / mo',
        condition: 'Water & Electricity Included',
        location: 'Musanze, 250m to Campus',
        badge: 'Zero Commission',
        badgeType: 'emerald',
        photoKey: 'shelter',
        to: '/dwell',
    },
    {
        id: 'cp-3',
        title: 'iPhone 11 128GB Black - Unlocked Grade A',
        price: '210,000 RWF',
        condition: 'Tested · 89% Battery Health',
        location: 'Kigali, Nyarugenge',
        badge: 'Urgent Deal',
        badgeType: 'yellow',
        photoKey: 'phones',
        to: '/trade?category=phones',
    },
    {
        id: 'cp-4',
        title: 'Solid Wood Coffee Table & TV Stand',
        price: '55,000 RWF',
        condition: 'Clean Finish · Moving Sale',
        location: 'Huye, Ngoma',
        badge: 'Moving Sale',
        badgeType: 'amber',
        photoKey: 'furniture',
        to: '/trade?category=furniture',
    },
    {
        id: 'cp-5',
        title: 'Professional TVET Electrical & Tool Kit',
        price: '95,000 RWF',
        condition: 'Complete 42-Piece Set',
        location: 'Musanze, Campus Gate',
        badge: 'Save 50%',
        badgeType: 'rose',
        photoKey: 'tools',
        to: '/trade?category=tools',
    },
    {
        id: 'cp-6',
        title: 'Bajaj Boxer 150cc Motorcycle (Direct Owner)',
        price: '650,000 RWF',
        condition: 'Clean Papers · Low Mileage',
        location: 'Rubavu, Gisenyi',
        photoKey: 'vehicles',
        to: '/trade?category=vehicles',
    },
    {
        id: 'cp-7',
        title: 'Two-Piece Formal Slim-Fit Suit (Daily Rental)',
        price: '8,000 RWF / day',
        condition: 'Dry Cleaned · Size 48-52',
        location: 'Kigali, Kicukiro',
        badge: 'Rent by Day',
        badgeType: 'emerald',
        photoKey: 'rentals',
        to: '/trade?category=rentals',
    },
    {
        id: 'cp-8',
        title: 'Samsung 43-inch Crystal UHD 4K Smart TV',
        price: '240,000 RWF',
        condition: 'Flawless Display · Original Remote',
        location: 'Kigali, Remera',
        badge: 'Urgent Deal',
        badgeType: 'yellow',
        photoKey: 'appliances',
        to: '/trade?category=electronics',
    },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const HomeView: React.FC = () => {
    useDocumentTitle();

    const [activeChip, setActiveChip] = useState('all');
    const hubScrollRef = useRef<HTMLDivElement>(null);

    // Queries for live marketplace and housing
    const { data: marketplaceData, isLoading: itemsLoading } = useItems({
        urgent: activeChip === 'urgent' ? true : undefined,
        category: activeChip !== 'all' && activeChip !== 'urgent' && activeChip !== 'shelter' ? activeChip : undefined,
    });

    const { data: housingData, isLoading: housingLoading } = useListings({});
    const isLoading = activeChip === 'shelter' ? housingLoading : itemsLoading;

    const scrollHubs = (direction: 'left' | 'right') => {
        if (hubScrollRef.current) {
            hubScrollRef.current.scrollBy({
                left: direction === 'left' ? -320 : 320,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="bg-canvas text-ink">
            {/* ───────── 1. HERO SLIDER (ANIMATED BACKGROUND IMAGES) ───────── */}
            <section className="w-full px-4 pt-4 sm:px-[30px] sm:pt-6">
                <HeroSlider />
            </section>

            {/* ───────── 2. HUBS & CAMPUSES TO HELP YOU SAVE ───────── */}
            <section className="w-full px-4 py-10 sm:px-[30px] sm:py-14">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Hubs & Campuses to help you save
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Find student essentials, verified hostels and peer rentals near your college or sector
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scrollHubs('left')}
                            aria-label="Scroll left"
                            className="grid size-10 place-items-center rounded-full border border-white/15 bg-panel-2 text-white transition-colors hover:bg-white/10"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollHubs('right')}
                            aria-label="Scroll right"
                            className="grid size-10 place-items-center rounded-full border border-white/15 bg-panel-2 text-white transition-colors hover:bg-white/10"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Horizontal scroll container */}
                <div
                    ref={hubScrollRef}
                    className="mt-6 flex gap-4 overflow-x-auto pb-3 scrollbar-none"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {HUBS.map((hub) => (
                        <Link
                            key={hub.id}
                            to={hub.to}
                            className="group flex w-52 shrink-0 flex-col justify-between rounded-xl border border-white/20 bg-[#1E232B] p-4.5 transition-all hover:-translate-y-1 hover:border-white/40 hover:bg-[#262C37] shadow-lg shadow-black/40 sm:w-60"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-black ${
                                            hub.badgeType === 'yellow'
                                                ? 'bg-[#FACC15] text-black shadow-sm'
                                                : hub.badgeType === 'emerald'
                                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                  : hub.badgeType === 'rose'
                                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        }`}
                                    >
                                        {hub.badgeText}
                                    </span>
                                </div>

                                <h3 className="mt-3.5 text-base font-bold leading-snug text-white group-hover:text-emerald-400 transition-colors">
                                    {hub.name}
                                </h3>

                                <p className="mt-1 text-xs font-medium text-slate-400 leading-snug">
                                    {hub.category}
                                </p>
                            </div>

                            <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-400">
                                <span className="truncate">{hub.location}</span>
                                <span className="font-semibold text-slate-300 shrink-0 ml-2">{hub.timing}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ───────── 3. CATEGORY CHIPS & ALL LISTINGS GRID ───────── */}
            <section className="w-full px-4 pb-14 sm:px-[30px] sm:pb-20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            All listings in{' '}
                            <span className="text-emerald-400">Rwanda</span>
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Verified peer items, TVET tools, and direct landlord rentals
                        </p>
                    </div>

                    <Link
                        to="/trade"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:underline"
                    >
                        View all 300+ listings
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                {/* Horizontal Filter Chip Rail */}
                <div className="mt-6 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {CHIP_FILTERS.map((chip) => {
                        const isActive = activeChip === chip.id;
                        return (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => setActiveChip(chip.id)}
                                className={`whitespace-nowrap rounded-xl px-4.5 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                                    isActive
                                        ? 'bg-white text-black font-black shadow-lg shadow-white/10 ring-2 ring-white/20'
                                        : 'bg-[#1E232B] border border-white/20 text-slate-200 hover:bg-[#282E39] hover:border-white/35 hover:text-white'
                                }`}
                            >
                                {chip.label}
                            </button>
                        );
                    })}
                </div>

                {/* Live Items Grid */}
                <div className="mt-8">
                    {isLoading ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div
                                    key={i}
                                    className="aspect-[4/5] animate-pulse rounded-xl border border-white/10 bg-[#181B22]"
                                />
                            ))}
                        </div>
                    ) : activeChip === 'shelter' ? (
                        /* Housing Listings View */
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {(housingData?.data ?? []).slice(0, 8).map((listing) => (
                                <HousingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (marketplaceData?.data && marketplaceData.data.length > 0) ? (
                        /* Live Real Items from API */
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {marketplaceData.data.slice(0, 8).map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        /* Curated Real Product Listings */
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {CURATED_PRODUCTS.map((product) => (
                                <article
                                    key={product.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-[#181B22] shadow-md transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-[#1E222B]"
                                >
                                    <Link to={product.to} className="block">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
                                            <Photo
                                                k={product.photoKey}
                                                width={600}
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {product.badge && (
                                                <div className="absolute bottom-3 right-3">
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[10px] font-black ${
                                                            product.badgeType === 'emerald'
                                                                ? 'bg-emerald-500/90 text-white'
                                                                : product.badgeType === 'rose'
                                                                  ? 'bg-rose-500/90 text-white'
                                                                  : product.badgeType === 'amber'
                                                                    ? 'bg-amber-500/90 text-black'
                                                                    : 'bg-[#FACC15] text-black shadow-sm'
                                                        }`}
                                                    >
                                                        {product.badge}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 p-4.5">
                                            <p className="text-lg font-black text-white">{product.price}</p>
                                            <h3 className="line-clamp-1 text-base font-bold leading-snug text-white group-hover:text-emerald-400 transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="line-clamp-1 text-xs text-slate-400">
                                                {product.condition}
                                            </p>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-xs text-slate-400">
                                                <span className="flex items-center gap-1 min-w-0">
                                                    <MapPin className="size-3 text-slate-400 shrink-0" />
                                                    <span className="truncate">{product.location}</span>
                                                </span>
                                                <span className="flex items-center gap-1 font-semibold text-emerald-400 shrink-0 ml-2">
                                                    <ShieldCheck className="size-3.5" />
                                                    ID Verified
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ───────── 4. INTERACTIVE GUETO & SHELTER FINDER ───────── */}
            <GuetoFinder />

            {/* ───────── 5. "RENT FROM NEIGHBOURS" FEATURE SPOTLIGHT ───────── */}
            <section className="w-full px-4 py-14 sm:px-[30px] sm:py-20">
                <div className="grid overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel lg:grid-cols-12">
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
                        <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                            Borrow Instead of Buying
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                            Need a suit for an interview or a tool for a day?
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-300">
                            Rent it from someone right in your neighbourhood. Avoid paying high shop prices for
                            something you only need once, while helping your neighbours earn from unused goods.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/trade?category=rentals"
                                className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-7 text-sm font-bold text-white transition-all hover:bg-action-hover"
                            >
                                Browse Available Rentals
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                to="/post"
                                className="inline-flex h-12 items-center rounded-full border border-white/20 bg-panel-2 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                List an Item for Rent
                            </Link>
                        </div>
                    </div>

                    <div className="relative min-h-[300px] lg:col-span-5">
                        <Photo
                            k="rentals"
                            width={1000}
                            className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-panel lg:to-transparent" />
                    </div>
                </div>
            </section>

            {/* ───────── 6. TRUST & VERIFICATION PILLARS ───────── */}
            <section className="w-full px-4 pb-14 sm:px-[30px] sm:pb-20">
                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Rwanda's Trusted Standard
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        Why students and neighbours choose NAWE
                    </h2>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-panel p-7">
                        <ShieldCheck className="size-8 text-emerald-400" />
                        <h3 className="mt-4 text-base font-bold text-white">ID-Verified Sellers</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            Every single seller submits their Rwandan National ID or Student ID before posting, keeping
                            scammers out.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-panel p-7">
                        <Zap className="size-8 text-amber-400" />
                        <h3 className="mt-4 text-base font-bold text-white">Zero Broker Commission</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            Speak directly with landlords and sellers via phone, WhatsApp or chat without paying
                            expensive intermediary fees.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-panel p-7">
                        <MapPin className="size-8 text-blue-400" />
                        <h3 className="mt-4 text-base font-bold text-white">Hyper-Local Discovery</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            Near Me technology highlights items and housing walking distance from campus gates and city
                            sectors.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-panel p-7">
                        <Repeat className="size-8 text-teal-400" />
                        <h3 className="mt-4 text-base font-bold text-white">Circular Peer Economy</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            Second-hand reuse reduces landfill waste while keeping student and family budgets intact.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────── 7. COMMUNITY CLOSING BANNER ───────── */}
            <section className="w-full px-4 pb-20 sm:px-[30px]">
                <div className="grid overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel lg:grid-cols-12">
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
                        <span className="w-fit rounded-full bg-[#FACC15] px-3 py-1 text-xs font-black text-black shadow-md">
                            100% Free First Listing
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                            Ready to buy, rent, or sell something?
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                            Join thousands of students and neighbours across Musanze, Kigali, Huye and Rubavu. Post
                            your first listing free in under 2 minutes.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/post"
                                className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-7 text-sm font-bold text-white shadow-lg transition-all hover:bg-action-hover active:scale-95"
                            >
                                Post a Listing Now
                                <ArrowRight className="size-4" />
                            </Link>

                            <Link
                                to="/about"
                                className="inline-flex h-12 items-center rounded-full border border-white/20 bg-panel-2 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                How NAWE Works
                            </Link>
                        </div>
                    </div>

                    <div className="relative min-h-[260px] lg:col-span-5">
                        <img
                            src={neighbourhood}
                            alt="Rwanda neighbourhood community"
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-panel lg:to-transparent" />
                    </div>
                </div>
            </section>
        </div>
    );
};
