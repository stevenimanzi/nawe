import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Handshake,
    LocateFixed,
    MapPin,
    MessageCircle,
    Repeat,
    Wallet,
} from 'lucide-react';
import { GuetoFinder } from '@/components/home/GuetoFinder';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CATEGORIES } from '@/lib/categories';
import { PHOTOS, unsplash } from '@/lib/photos';
import neighbourhood from '@/assets/photos/neighbourhood.webp';

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const Photo: React.FC<{ k: string; width?: number; className?: string }> = ({ k, width = 800, className = '' }) => (
    <img
        src={unsplash(PHOTOS[k].id, width)}
        alt={PHOTOS[k].alt}
        loading="lazy"
        decoding="async"
        className={className}
    />
);

const SectionHead: React.FC<{ title: string; to?: string; linkLabel?: string }> = ({ title, to, linkLabel }) => (
    <div className="flex items-end justify-between gap-6">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {to && (
            <Link
                to={to}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
                {linkLabel ?? 'View all'}
                <ArrowRight className="size-4" aria-hidden />
            </Link>
        )}
    </div>
);

const PromoCard: React.FC<{
    k: string;
    label: string;
    title: string;
    text: string;
    to: string;
    className?: string;
    large?: boolean;
}> = ({ k, label, title, text, to, className = '', large }) => (
    <article className={`group relative isolate flex overflow-hidden rounded-3xl bg-panel ${className}`}>
        <Photo
            k={k}
            width={large ? 1800 : 1100}
            className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className={`flex flex-col justify-end p-7 ${large ? 'sm:p-10' : ''}`}>
            <span className="w-fit rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white/90">
                {label}
            </span>
            <h3 className={`mt-4 font-bold leading-tight text-white ${large ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
                {title}
            </h3>
            <p className={`mt-3 max-w-sm text-sm leading-relaxed text-slate-200 ${large ? 'sm:text-base' : ''}`}>{text}</p>
            <Link
                to={to}
                className="mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#111111] transition-colors hover:bg-slate-200"
            >
                Shop Now
                <ArrowRight className="size-4" aria-hidden />
            </Link>
        </div>
    </article>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
    { icon: BadgeCheck, title: 'ID-Verified Sellers', text: 'Every seller completes KYC', verified: true },
    { icon: LocateFixed, title: 'Near You', text: 'Listings close to where you are' },
    { icon: Handshake, title: 'Rent Nearby', text: 'Borrow from neighbours by the day' },
    { icon: MessageCircle, title: 'Direct Contact', text: 'Talk to owners directly' },
];

const GET_STARTED = [
    {
        label: 'Sell',
        title: 'Post an item',
        text: 'Turn what you no longer use into cash.',
        cta: 'Start selling',
        to: '/post',
        photo: 'phones',
        tone: 'bg-action',
    },
    {
        label: 'Rent out',
        title: 'Lend it by the day',
        text: 'Earn from things that sit unused at home.',
        cta: 'List for rent',
        to: '/post',
        photo: 'appliances',
        tone: 'bg-panel-2',
    },
    {
        label: 'Find a home',
        title: 'Browse rooms',
        text: 'Studios, rooms and houses near you.',
        cta: 'See rooms',
        to: '/dwell',
        photo: 'shelter',
        tone: 'bg-panel',
    },
    {
        label: 'Borrow',
        title: 'Rent what you need',
        text: 'Skip buying for a one-time use.',
        cta: 'Browse rentals',
        to: '/trade?category=rentals',
        photo: 'rentals',
        tone: 'bg-[#1b1b1b]',
    },
];

const COLLECTIONS = [
    { title: 'Furnish your room', photo: 'furniture', to: '/trade?category=furniture' },
    { title: 'Start a workshop', photo: 'tools', to: '/trade?category=tools' },
    { title: 'Stay connected', photo: 'phones', to: '/trade?category=phones' },
    { title: 'Get around', photo: 'vehicles', to: '/trade?category=vehicles' },
];

const WHY = [
    { icon: BadgeCheck, title: 'Verified identities', text: 'Sellers are checked with a national ID before they can post.', verified: true },
    { icon: Wallet, title: 'Fair second-hand prices', text: 'Good things at prices that make sense for everyday budgets.' },
    { icon: Repeat, title: 'Rent instead of buy', text: 'Borrow what you only need once and save the cost of buying new.' },
    { icon: MapPin, title: 'Built around you', text: 'Find listings in your own neighbourhood, not across the country.' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export const HomeView: React.FC = () => (
    <div className="bg-canvas">
        {/* ───────── Hero ───────── */}
        <section>
            <div className="w-full px-[30px] pt-6">
                <HeroSlider />

                {/* Floating feature bar overlapping the banner */}
                <ul className="relative z-10 mx-3 -mt-14 grid grid-cols-2 gap-y-6 rounded-3xl bg-panel/85 py-6 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl sm:mx-10 lg:mx-16 lg:grid-cols-4">
                    {FEATURES.map(({ icon: Icon, title, text, verified }, i) => (
                        <li
                            key={title}
                            className={`flex items-center gap-4 px-5 lg:justify-center lg:px-6 ${
                                i > 0 ? 'lg:border-l lg:border-white/10' : ''
                            }`}
                        >
                            <Icon
                                className={`size-8 shrink-0 ${verified ? 'text-gold' : 'text-white'}`}
                                strokeWidth={1.5}
                                aria-hidden
                            />
                            <div>
                                <p className="text-sm font-semibold text-white">{title}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* ───────── Shop by Category ───────── */}
        <section>
            <div className="w-full px-[30px] py-14 lg:py-20">
                <SectionHead title="Shop by Category" to="/trade" linkLabel="View Category" />

                <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                    {CATEGORIES.map((c) => (
                        <li key={c.key}>
                            <Link
                                to={c.to}
                                className="group block rounded-2xl bg-panel p-2.5 ring-1 ring-white/10 transition-colors hover:bg-panel-2"
                            >
                                <div className="aspect-square overflow-hidden rounded-xl">
                                    <Photo
                                        k={c.key}
                                        width={500}
                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <p className="px-1 pb-2 pt-3 text-center text-[13px] font-semibold leading-tight text-white">
                                    {c.label}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* ───────── Get a gueto easily ───────── */}
        <GuetoFinder />

        {/* ───────── Featured ───────── */}
        <section>
            <div className="w-full px-[30px] pb-14 lg:pb-20">
                <SectionHead title="Featured" to="/trade" />

                <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
                    <PromoCard
                        large
                        k="rentals"
                        label="Rentals"
                        title="Rent from Neighbours"
                        text="A suit for an interview, shoes for an event, a washing machine for the week. Borrow it from someone nearby."
                        to="/trade?category=rentals"
                        className="min-h-[420px] lg:col-span-2 lg:row-span-2"
                    />
                    <PromoCard
                        k="shelter"
                        label="Shelter & Gueto"
                        title="Find your next room"
                        text="Rooms, studios and houses, with the landlord's contact."
                        to="/dwell"
                        className="min-h-[220px]"
                    />
                    <PromoCard
                        k="vehicles"
                        label="Motos & Bikes"
                        title="Get moving"
                        text="Second-hand motorcycles and bicycles near you."
                        to="/trade?category=vehicles"
                        className="min-h-[220px]"
                    />
                </div>
            </div>
        </section>

        {/* ───────── Get Started ───────── */}
        <section>
            <div className="w-full px-[30px] pb-14 lg:pb-20">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Get started</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">What do you want to do?</h2>

                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {GET_STARTED.map((g) => (
                        <li key={g.label}>
                            <Link
                                to={g.to}
                                className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl p-6 ring-1 ring-white/10 ${g.tone}`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{g.label}</p>
                                <h3 className="mt-2 max-w-[60%] text-2xl font-bold leading-tight text-white">{g.title}</h3>
                                <p className="mt-2 max-w-[55%] text-sm leading-relaxed text-white/75">{g.text}</p>
                                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-white">
                                    {g.cta}
                                    <ArrowRight
                                        className="size-4 transition-transform group-hover:translate-x-1"
                                        aria-hidden
                                    />
                                </span>
                                <Photo
                                    k={g.photo}
                                    width={640}
                                    className="absolute bottom-0 right-0 h-[62%] w-[42%] rounded-tl-3xl object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* ───────── Shop by Need ───────── */}
        <section>
            <div className="w-full px-[30px] pb-14 lg:pb-20">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Collections</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Shop by Need</h2>

                <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                    {COLLECTIONS.map((c) => (
                        <li key={c.title}>
                            <Link
                                to={c.to}
                                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-panel"
                            >
                                <Photo
                                    k={c.photo}
                                    width={1000}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                                    <h3 className="text-xl font-bold leading-tight text-white">{c.title}</h3>
                                    <ArrowUpRight
                                        className="size-6 shrink-0 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        aria-hidden
                                    />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* ───────── Why Choose Us ───────── */}
        <section>
            <div className="w-full px-[30px] pb-14 lg:pb-20">
                <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">Why Choose Us?</h2>

                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {WHY.map(({ icon: Icon, title, text, verified }) => (
                        <li key={title} className="rounded-3xl bg-panel p-7 ring-1 ring-white/10">
                            <Icon
                                className={`size-8 ${verified ? 'text-gold' : 'text-white'}`}
                                strokeWidth={1.5}
                                aria-hidden
                            />
                            <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* ───────── Closing banner ───────── */}
        <section>
            <div className="w-full px-[30px] pb-20">
                <div className="grid overflow-hidden rounded-[2rem] bg-panel ring-1 ring-white/10 lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                            Join your neighbourhood marketplace
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
                            Post your first listing free. Sell what you no longer need, rent out what sits unused, or
                            list a room, and reach people right around you.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/post"
                                className="inline-flex h-12 items-center rounded-full bg-action px-7 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
                            >
                                Post a Listing
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111111]"
                            >
                                About NAWE
                            </Link>
                        </div>
                    </div>
                    <div className="relative min-h-[260px]">
                        <img
                            src={neighbourhood}
                            alt="Houses across the hills of Kigali"
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    </div>
);
