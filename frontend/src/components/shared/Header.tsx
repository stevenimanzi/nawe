import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BadgeCheck,
    ChevronDown,
    Heart,
    LayoutGrid,
    LocateFixed,
    MapPin,
    Menu,
    Phone,
    Plus,
    Search,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { useDismiss } from '@/hooks/useDismiss';
import { CATEGORIES } from '@/lib/categories';
import { SOCIALS } from './socials';
import { SelectMenu, type SelectOption } from './SelectMenu';
import logoWhite from '@/assets/brand/logo-white.svg';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS: { label: string; to: string; wideOnly?: boolean }[] = [
    { label: 'Home', to: '/' },
    { label: 'Marketplace', to: '/trade' },
    { label: 'Shelter & Gueto', to: '/dwell' },
    { label: 'Urgent Deals', to: '/deals' },
    { label: 'Verified Sellers', to: '/kyc', wideOnly: true },
];

const CATEGORY_OPTIONS: SelectOption[] = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((c) => ({ value: c.key, label: c.label })),
];

const LOCATIONS = ['All Rwanda', 'Kigali', 'Musanze', 'Huye', 'Rubavu', 'Muhanga', 'Rwamagana'];
const LOCATION_OPTIONS: SelectOption[] = LOCATIONS.map((l) => ({ value: l, label: l }));

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

interface IconButtonProps {
    label: string;
    count?: number;
    to: string;
    children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ label, count = 0, to, children }) => (
    <Link
        to={to}
        aria-label={count > 0 ? `${label} (${count})` : label}
        className="relative grid size-10 place-items-center rounded-lg text-white transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
        {children}
        {count > 0 && (
            <span className="absolute right-0 top-0 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-white px-1 text-[10px] font-extrabold leading-none text-black ring-2 ring-[#0A1F44]">
                {count > 99 ? '99+' : count}
            </span>
        )}
    </Link>
);

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

interface HeaderProps {
    wishlistCount?: number;
    cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ wishlistCount = 0, cartCount = 0 }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [location, setLocation] = useState('All Rwanda');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [locating, setLocating] = useState(false);

    const catRef = useDismiss(catOpen, () => setCatOpen(false));

    // Close every popover when the route changes.
    const [prevPath, setPrevPath] = useState(pathname);
    if (prevPath !== pathname) {
        setPrevPath(pathname);
        setMobileOpen(false);
        setCatOpen(false);
    }

    /** Sends the user to listings near them; falls back to their chosen location if GPS is unavailable or denied. */
    const goNearMe = () => {
        const fallback = () => {
            setLocating(false);
            navigate('/trade?near=1');
        };
        if (!('geolocation' in navigator)) return fallback();
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                navigate('/trade?near=1', {
                    state: {
                        coords: {
                            lat: Number(pos.coords.latitude.toFixed(3)),
                            lng: Number(pos.coords.longitude.toFixed(3)),
                        },
                    },
                });
            },
            fallback,
            { timeout: 8000, maximumAge: 300_000 },
        );
    };

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (category !== 'all') params.set('category', category);
        if (location !== 'All Rwanda') params.set('location', location);
        navigate(`/trade?${params.toString()}`);
    };

    const navLinkClass = (wideOnly?: boolean) => ({ isActive }: { isActive: boolean }) =>
        `relative h-14 items-center text-sm ${wideOnly ? 'hidden xl:inline-flex' : 'inline-flex'} font-semibold transition-colors ${
            isActive ? 'text-white font-bold' : 'text-white/85 hover:text-white'
        } after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-white after:transition-transform after:origin-center ${
            isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-50'
        }`;

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* ───────── Announcement bar ───────── */}
            <div className="w-full bg-canvas text-white">
                <div className="mx-auto flex h-10 w-full items-center justify-between gap-4 px-[30px] text-xs">
                    <a
                        href={CONTACT.phoneHref}
                        className="flex shrink-0 items-center gap-1.5 font-medium hover:underline"
                    >
                        <Phone className="size-3.5" aria-hidden />
                        <span className="hidden sm:inline">Call Us:</span>
                        <span className="font-bold">{CONTACT.phoneDisplay}</span>
                    </a>

                    <p className="min-w-0 truncate text-center font-medium">
                        <span className="hidden md:inline">Sign up and post your first listing </span>
                        <span className="hidden sm:inline md:hidden">Post your first listing </span>
                        <span className="font-extrabold">FREE</span>
                        <span className="sm:hidden"> first listing</span>
                        <span className="hidden sm:inline">. </span>
                        <Link to="/signup" className="ml-1 font-bold underline underline-offset-2 hover:no-underline">
                            Sign up<span className="hidden sm:inline"> now</span>
                        </Link>
                    </p>

                    <ul className="hidden shrink-0 items-center gap-3 md:flex">
                        {SOCIALS.map((s) => (
                            <li key={s.label}>
                                <a
                                    href={s.href}
                                    aria-label={s.label}
                                    className="grid size-6 place-items-center text-white/90 transition-opacity hover:opacity-100"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="size-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden
                                    >
                                        {s.icon}
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ───────── Primary navigation ───────── */}
            <header className="w-full border-b border-white/10 bg-panel text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                {/* Row 1 — brand · location · search · actions */}
                <div className="mx-auto flex h-16 w-full items-center gap-4 px-[30px] lg:h-[76px] lg:gap-8 xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr]">
                    <div className="flex shrink-0 items-center gap-8">
                    <Link to="/" className="flex shrink-0 items-center" aria-label="NAWE home">
                        <img src={logoWhite} alt="NAWE" className="h-10 w-auto lg:h-12" />
                    </Link>

                    {/* Location */}
                    <SelectMenu
                        label="Location"
                        heading="Select location"
                        value={location}
                        onChange={setLocation}
                        options={LOCATION_OPTIONS}
                        className="hidden shrink-0 xl:block"
                        triggerClassName="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        renderTrigger={(sel, open) => (
                            <>
                                <MapPin className="size-5 shrink-0 text-white" aria-hidden />
                                <span className="flex flex-col leading-tight">
                                    <span className="text-[11px] font-medium text-white/70">Location</span>
                                    <span className="flex items-center gap-1 text-sm font-bold text-white">
                                        {sel.label}
                                        <ChevronDown
                                            className={`size-4 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`}
                                            aria-hidden
                                        />
                                    </span>
                                </span>
                            </>
                        )}
                    />
                    </div>

                    {/* Search (desktop / tablet) */}
                    <form
                        onSubmit={onSearch}
                        role="search"
                        className="hidden h-11 min-w-0 flex-1 items-center rounded-full bg-panel-2 pl-2 pr-1.5 text-white ring-1 ring-white/10 md:flex mx-auto w-full max-w-3xl"
                    >
                        <SelectMenu
                            label="Search category"
                            heading="Search in"
                            value={category}
                            onChange={setCategory}
                            options={CATEGORY_OPTIONS}
                            className="h-full shrink-0"
                            triggerClassName="flex h-full cursor-pointer items-center gap-1.5 rounded-full pl-3 pr-2 text-[13px] font-semibold text-slate-200 transition-colors hover:text-white focus-visible:outline-none"
                            renderTrigger={(sel, open) => (
                                <>
                                    {sel.label}
                                    <ChevronDown
                                        className={`size-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                                        aria-hidden
                                    />
                                </>
                            )}
                        />
                        <span className="mx-2 h-5 w-px bg-white/15" aria-hidden />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for rooms, phones, laptops, beds…"
                            aria-label="Search listings"
                            className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-action text-white transition-colors hover:bg-action-hover"
                        >
                            <Search className="size-4" aria-hidden />
                        </button>
                    </form>

                    {/* Actions */}
                    <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0 xl:justify-self-end">
                        <IconButton label="Wishlist" to="/wishlist" count={wishlistCount}>
                            <Heart className="size-5" aria-hidden />
                        </IconButton>
                        <IconButton label="Cart" to="/cart" count={cartCount}>
                            <ShoppingBag className="size-5" aria-hidden />
                        </IconButton>
                        <IconButton label="Account" to="/account">
                            <User className="size-5" aria-hidden />
                        </IconButton>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            className="ml-1 grid size-10 cursor-pointer place-items-center rounded-lg text-white transition-colors hover:text-white/80 lg:hidden"
                        >
                            {mobileOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
                        </button>
                    </div>
                </div>

                {/* Search (mobile) */}
                <form onSubmit={onSearch} role="search" className="px-[30px] pb-3 md:hidden">
                    <div className="flex h-11 items-center rounded-full bg-panel-2 pl-4 pr-1.5 text-white ring-1 ring-white/10">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products…"
                            aria-label="Search listings"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-action text-white"
                        >
                            <Search className="size-4" aria-hidden />
                        </button>
                    </div>
                </form>

                {/* Row 2 — categories · links · near me (desktop) */}
                <div className="hidden border-t border-white/10 lg:block">
                    <div className="mx-auto flex h-14 w-full items-center gap-6 px-[30px] xl:gap-8">
                        {/* Browse categories */}
                        <div ref={catRef} className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setCatOpen((o) => !o)}
                                aria-expanded={catOpen}
                                aria-haspopup="true"
                                className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-white transition-colors hover:bg-action-hover shadow-sm"
                            >
                                <LayoutGrid className="size-4" aria-hidden />
                                <span className="xl:hidden">Categories</span>
                                <span className="hidden xl:inline">Browse All Categories</span>
                                <ChevronDown
                                    className={`size-4 transition-transform ${catOpen ? 'rotate-180' : ''}`}
                                    aria-hidden
                                />
                            </button>

                            {catOpen && (
                                <div className="absolute left-0 top-full z-50 mt-3 w-[40rem] overflow-hidden rounded-2xl bg-panel-2 text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 animate-pop motion-reduce:animate-none">
                                    <div className="flex items-center justify-between px-6 pb-2 pt-5">
                                        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                            Browse by category
                                        </h2>
                                        <Link
                                            to="/trade"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
                                        >
                                            View all listings
                                            <ArrowRight className="size-4" aria-hidden />
                                        </Link>
                                    </div>

                                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 px-3 pb-3">
                                        {CATEGORIES.map(({ key, label, to, hint }) => (
                                            <li key={key}>
                                                <Link
                                                    to={to}
                                                    className="group block rounded-xl px-4 py-3.5 transition-colors hover:bg-white/5"
                                                >
                                                    <span className="flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-white">
                                                        {label}
                                                    </span>
                                                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-400">
                                                        {hint}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between gap-6 border-t border-white/10 bg-black/20 px-6 py-4">
                                        <p className="text-sm text-slate-300">
                                            Selling something? Reach buyers across Rwanda.
                                        </p>
                                        <Link
                                            to="/post"
                                            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-action px-4 text-sm font-bold text-white transition-colors hover:bg-action-hover"
                                        >
                                            <Plus className="size-4" aria-hidden />
                                            Post Listing
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Links */}
                        <nav aria-label="Primary" className="flex items-center gap-6 xl:gap-8">
                            {NAV_LINKS.map((l) => (
                                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navLinkClass(l.wideOnly)}>
                                    {l.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right cluster */}
                        <div className="ml-auto flex shrink-0 items-center gap-4">
                            <button
                                type="button"
                                onClick={goNearMe}
                                disabled={locating}
                                className="flex h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80 disabled:cursor-wait disabled:opacity-70"
                            >
                                <LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} aria-hidden />
                                {locating ? 'Locating…' : 'Near Me'}
                            </button>

                            <Link
                                to="/post"
                                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-action px-4 text-sm font-bold text-white transition-colors hover:bg-action-hover"
                            >
                                <Plus className="size-4" aria-hidden />
                                Post Listing
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile / tablet drawer */}
                {mobileOpen && (
                    <div
                        id="mobile-menu"
                        className="max-h-[calc(100dvh-10rem)] overflow-y-auto border-t border-white/10 bg-panel lg:hidden"
                    >
                        <div className="mx-auto w-full space-y-6 px-[30px] py-6">
                            <nav aria-label="Primary mobile">
                                <ul className="space-y-1">
                                    {NAV_LINKS.map((l) => (
                                        <li key={l.to}>
                                            <NavLink
                                                to={l.to}
                                                end={l.to === '/'}
                                                className={({ isActive }) =>
                                                    `flex h-12 items-center justify-between rounded-xl px-4 text-[15px] font-semibold transition-colors ${
                                                        isActive
                                                            ? 'bg-white/10 text-white font-bold'
                                                            : 'text-white/90 hover:bg-white/5'
                                                    }`
                                                }
                                            >
                                                {l.label}
                                                <ArrowRight className="size-4 opacity-50" aria-hidden />
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <button
                                type="button"
                                onClick={goNearMe}
                                disabled={locating}
                                className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-4 text-[15px] font-semibold text-white disabled:cursor-wait disabled:opacity-70"
                            >
                                {locating ? 'Locating…' : 'Near Me'}
                                <LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} aria-hidden />
                            </button>

                            <div>
                                <h2 className="px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                                    Categories
                                </h2>
                                <ul className="mt-2 grid grid-cols-2 gap-x-2">
                                    {CATEGORIES.map(({ label, to }) => (
                                        <li key={label}>
                                            <Link
                                                to={to}
                                                className="flex h-12 items-center gap-2.5 px-4 text-[13px] font-semibold text-white/90 transition-colors hover:text-white"
                                            >
                                                <span className="truncate">{label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3">
                                    <MapPin className="size-5 shrink-0 text-white" aria-hidden />
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        aria-label="Location"
                                        className="w-full cursor-pointer bg-transparent text-sm font-semibold text-white focus:outline-none [&>option]:text-slate-900"
                                    >
                                        {LOCATIONS.map((l) => (
                                            <option key={l} value={l}>
                                                {l}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <Link
                                    to="/post"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-action px-6 text-sm font-bold text-white transition-colors hover:bg-action-hover shadow-sm"
                                >
                                    <Plus className="size-4" aria-hidden />
                                    Post Listing
                                </Link>
                            </div>

                            <p className="flex items-center gap-2 px-1 text-xs text-white/70">
                                <BadgeCheck className="size-4 text-gold" aria-hidden />
                                Every seller on NAWE is ID verified.
                            </p>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};
