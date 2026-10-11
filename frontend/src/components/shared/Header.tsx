import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BadgeCheck,
    BedDouble,
    Bike,
    ChevronDown,
    Heart,
    History,
    Laptop,
    LayoutGrid,
    MapPin,
    Menu,
    Phone,
    Plus,
    Refrigerator,
    Search,
    ShoppingBag,
    Smartphone,
    Sofa,
    Tag,
    User,
    Wrench,
    X,
} from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { useDismiss } from '@/hooks/useDismiss';
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
    { label: 'Safety', to: '/safety', wideOnly: true },
];

const CATEGORIES = [
    { key: 'shelter', label: 'Shelter & Gueto', to: '/dwell', icon: BedDouble, hint: 'Rooms, studios, houses' },
    { key: 'phones', label: 'Used Phones', to: '/trade?category=phones', icon: Smartphone, hint: 'Smartphones & tablets' },
    { key: 'electronics', label: 'Laptops & Electronics', to: '/trade?category=electronics', icon: Laptop, hint: 'Computers, TVs, audio' },
    { key: 'furniture', label: 'Furniture & Beds', to: '/trade?category=furniture', icon: Sofa, hint: 'Sofas, beds, tables' },
    { key: 'appliances', label: 'Room Appliances', to: '/trade?category=appliances', icon: Refrigerator, hint: 'Fridges, cookers, fans' },
    { key: 'vehicles', label: 'Motos & Bikes', to: '/trade?category=vehicles', icon: Bike, hint: 'Motorcycles & bicycles' },
    { key: 'tools', label: 'Workshop Tools', to: '/trade?category=tools', icon: Wrench, hint: 'Hand & power tools' },
];

const MENU_ITEMS = [
    ...CATEGORIES,
    { key: 'deals', label: 'Urgent Deals', to: '/deals', icon: Tag, hint: 'Relocating sales, priced to go' },
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
        className="relative grid size-10 place-items-center rounded-lg text-white transition-colors hover:text-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
    >
        {children}
        {count > 0 && (
            <span className="absolute right-0 top-0 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-yellow-400 px-1 text-[10px] font-extrabold leading-none text-emerald-950 ring-2 ring-[#15803D]">
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
    const [recentOpen, setRecentOpen] = useState(false);

    const catRef = useDismiss(catOpen, () => setCatOpen(false));
    const recentRef = useDismiss(recentOpen, () => setRecentOpen(false));

    // Close every popover when the route changes.
    const [prevPath, setPrevPath] = useState(pathname);
    if (prevPath !== pathname) {
        setPrevPath(pathname);
        setMobileOpen(false);
        setCatOpen(false);
        setRecentOpen(false);
    }

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
            isActive ? 'text-yellow-300' : 'text-white/85 hover:text-white'
        } after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-yellow-400 after:transition-transform after:origin-center ${
            isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-50'
        }`;

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* ───────── Announcement bar ───────── */}
            <div className="w-full bg-yellow-400 text-emerald-950">
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
                                    className="grid size-6 place-items-center text-emerald-950 transition-opacity hover:opacity-60"
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
            <header className="w-full bg-[#15803D] text-white shadow-[0_2px_12px_rgba(6,78,59,0.25)]">
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
                        triggerClassName="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300"
                        renderTrigger={(sel, open) => (
                            <>
                                <MapPin className="size-5 shrink-0 text-yellow-300" aria-hidden />
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
                        className="hidden h-11 min-w-0 flex-1 items-center rounded-full bg-white pl-2 pr-1.5 text-slate-900 shadow-sm ring-yellow-400 transition-shadow focus-within:ring-4 md:flex mx-auto w-full max-w-3xl"
                    >
                        <SelectMenu
                            label="Search category"
                            heading="Search in"
                            value={category}
                            onChange={setCategory}
                            options={CATEGORY_OPTIONS}
                            className="h-full shrink-0"
                            triggerClassName="flex h-full cursor-pointer items-center gap-1.5 rounded-full pl-3 pr-2 text-[13px] font-semibold text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none"
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
                        <span className="mx-2 h-5 w-px bg-slate-200" aria-hidden />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for rooms, phones, laptops, beds…"
                            aria-label="Search listings"
                            className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-[#15803D] text-white transition-colors hover:bg-emerald-900"
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
                            className="ml-1 grid size-10 cursor-pointer place-items-center rounded-lg text-white transition-colors hover:text-yellow-300 lg:hidden"
                        >
                            {mobileOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
                        </button>
                    </div>
                </div>

                {/* Search (mobile) */}
                <form onSubmit={onSearch} role="search" className="px-[30px] pb-3 md:hidden">
                    <div className="flex h-11 items-center rounded-full bg-white pl-4 pr-1.5 text-slate-900 shadow-sm focus-within:ring-4 focus-within:ring-yellow-400">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products…"
                            aria-label="Search listings"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-[#15803D] text-white"
                        >
                            <Search className="size-4" aria-hidden />
                        </button>
                    </div>
                </form>

                {/* Row 2 — categories · links · recently viewed (desktop) */}
                <div className="hidden border-t border-white/10 lg:block">
                    <div className="mx-auto flex h-14 w-full items-center gap-6 px-[30px] xl:gap-8">
                        {/* Browse categories */}
                        <div ref={catRef} className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setCatOpen((o) => !o)}
                                aria-expanded={catOpen}
                                aria-haspopup="true"
                                className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-yellow-400 px-5 text-sm font-bold text-emerald-950 transition-colors hover:bg-yellow-300"
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
                                <div className="absolute left-0 top-full z-50 mt-3 w-[40rem] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_24px_60px_-12px_rgba(6,40,24,0.45)] ring-1 ring-slate-900/5 animate-pop motion-reduce:animate-none">
                                    <div className="flex items-center justify-between px-6 pb-2 pt-5">
                                        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                            Browse by category
                                        </h2>
                                        <Link
                                            to="/trade"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#15803D] hover:underline"
                                        >
                                            View all listings
                                            <ArrowRight className="size-4" aria-hidden />
                                        </Link>
                                    </div>

                                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 px-3 pb-3">
                                        {MENU_ITEMS.map(({ key, label, to, icon: Icon, hint }) => (
                                            <li key={key}>
                                                <Link
                                                    to={to}
                                                    className="group flex items-start gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50"
                                                >
                                                    <Icon
                                                        className="mt-0.5 size-6 shrink-0 text-[#15803D]"
                                                        strokeWidth={1.75}
                                                        aria-hidden
                                                    />
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#15803D]">
                                                            {label}
                                                        </span>
                                                        <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                                                            {hint}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between gap-6 border-t border-slate-100 bg-slate-50 px-6 py-4">
                                        <p className="text-sm text-slate-600">
                                            Selling something? Reach buyers across Rwanda.
                                        </p>
                                        <Link
                                            to="/post"
                                            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#15803D] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0F5132]"
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
                            <div ref={recentRef} className="relative hidden xl:block">
                                <button
                                    type="button"
                                    onClick={() => setRecentOpen((o) => !o)}
                                    aria-expanded={recentOpen}
                                    aria-haspopup="true"
                                    className="flex h-10 cursor-pointer items-center gap-1.5 text-sm font-semibold text-yellow-300 transition-colors hover:text-yellow-200"
                                >
                                    <History className="size-4" aria-hidden />
                                    Recently Viewed
                                    <ChevronDown
                                        className={`size-4 transition-transform ${recentOpen ? 'rotate-180' : ''}`}
                                        aria-hidden
                                    />
                                </button>

                                {recentOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl bg-white p-6 text-slate-900 shadow-[0_24px_60px_-12px_rgba(6,40,24,0.45)] ring-1 ring-slate-900/5 animate-pop motion-reduce:animate-none">
                                        <div className="flex flex-col items-center text-center">
                                            <History className="size-8 text-[#15803D]" strokeWidth={1.5} aria-hidden />
                                            <p className="mt-4 text-sm font-semibold">Nothing viewed yet</p>
                                            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                                                Listings you open will show up here so you can find them again.
                                            </p>
                                            <Link
                                                to="/trade"
                                                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#15803D] hover:underline"
                                            >
                                                Browse the marketplace
                                                <ArrowRight className="size-4" aria-hidden />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/post"
                                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/30 px-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#15803D]"
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
                        className="max-h-[calc(100dvh-10rem)] overflow-y-auto border-t border-white/10 bg-emerald-900 lg:hidden"
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
                                                            ? 'bg-white/10 text-yellow-300'
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

                            <div>
                                <h2 className="px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-yellow-300">
                                    Categories
                                </h2>
                                <ul className="mt-2 grid grid-cols-2 gap-x-2">
                                    {CATEGORIES.map(({ label, to, icon: Icon }) => (
                                        <li key={label}>
                                            <Link
                                                to={to}
                                                className="flex h-12 items-center gap-2.5 px-4 text-[13px] font-semibold text-white/90 transition-colors hover:text-yellow-300"
                                            >
                                                <Icon className="size-4 shrink-0 text-yellow-300" aria-hidden />
                                                <span className="truncate">{label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3">
                                    <MapPin className="size-5 shrink-0 text-yellow-300" aria-hidden />
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
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 text-sm font-bold text-emerald-950 transition-colors hover:bg-yellow-300"
                                >
                                    <Plus className="size-4" aria-hidden />
                                    Post Listing
                                </Link>
                            </div>

                            <p className="flex items-center gap-2 px-1 text-xs text-white/70">
                                <BadgeCheck className="size-4 text-yellow-300" aria-hidden />
                                Every seller on NAWE is ID verified.
                            </p>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};
