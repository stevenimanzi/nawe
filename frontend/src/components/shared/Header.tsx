import React, { useEffect, useRef, useState } from 'react';
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
    User,
    Wrench,
    X,
} from 'lucide-react';

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
    { label: 'Shelter & Gueto', to: '/dwell', icon: BedDouble, hint: 'Rooms, studios, houses' },
    { label: 'Used Phones', to: '/trade?category=phones', icon: Smartphone, hint: 'Smartphones & tablets' },
    { label: 'Laptops & Electronics', to: '/trade?category=electronics', icon: Laptop, hint: 'Computers, TVs, audio' },
    { label: 'Furniture & Beds', to: '/trade?category=furniture', icon: Sofa, hint: 'Sofas, beds, tables' },
    { label: 'Room Appliances', to: '/trade?category=appliances', icon: Refrigerator, hint: 'Fridges, cookers, fans' },
    { label: 'Motos & Bikes', to: '/trade?category=vehicles', icon: Bike, hint: 'Motorcycles & bicycles' },
    { label: 'Workshop Tools', to: '/trade?category=tools', icon: Wrench, hint: 'Hand & power tools' },
];

const LOCATIONS = ['All Rwanda', 'Kigali', 'Musanze', 'Huye', 'Rubavu', 'Muhanga', 'Rwamagana'];

const SOCIALS = [
    {
        label: 'Facebook',
        href: '#',
        icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
        label: 'X',
        href: '#',
        icon: <path d="M4 4l7.5 9.5L4 20h2l6.4-5.6L17 20h3l-7.9-10L19.5 4h-2l-5.9 5.2L7 4H4z" />,
    },
    {
        label: 'Instagram',
        href: '#',
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" />
            </>
        ),
    },
    {
        label: 'YouTube',
        href: '#',
        icon: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="4" />
                <path d="M10 9.5v5l4.5-2.5z" />
            </>
        ),
    },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Closes a popover on outside click or Escape. */
function useDismiss(open: boolean, onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onPointer = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    return ref;
}

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
        className="relative grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
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
        <>
            {/* ───────── Announcement bar ───────── */}
            <div className="w-full bg-yellow-400 text-emerald-950">
                <div className="mx-auto flex h-10 w-full items-center justify-between gap-4 px-[30px] text-xs">
                    <a
                        href="tel:+250788123456"
                        className="flex shrink-0 items-center gap-1.5 font-medium hover:underline"
                    >
                        <Phone className="size-3.5" aria-hidden />
                        <span className="hidden sm:inline">Call Us:</span>
                        <span className="font-bold">+250 788 123 456</span>
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

                    <ul className="hidden shrink-0 items-center gap-2 md:flex">
                        {SOCIALS.map((s) => (
                            <li key={s.label}>
                                <a
                                    href={s.href}
                                    aria-label={s.label}
                                    className="grid size-6 place-items-center rounded-full bg-emerald-900 text-yellow-300 transition-colors hover:bg-emerald-800"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="size-3.5"
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
            <header className="sticky top-0 z-50 w-full bg-[#15803D] text-white shadow-[0_2px_12px_rgba(6,78,59,0.25)]">
                {/* Row 1 — brand · location · search · actions */}
                <div className="mx-auto flex h-16 w-full items-center gap-4 px-[30px] lg:h-[76px] lg:gap-8">
                    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="NAWE home">
                        <span className="grid size-10 place-items-center rounded-full bg-yellow-400 font-heading text-xl font-black text-emerald-950">
                            N
                        </span>
                        <span className="font-heading text-2xl font-extrabold tracking-tight">NAWE</span>
                    </Link>

                    {/* Location */}
                    <label className="relative hidden shrink-0 items-center gap-2 xl:flex">
                        <MapPin className="size-5 text-yellow-300" aria-hidden />
                        <span className="flex flex-col leading-tight">
                            <span className="text-[11px] font-medium text-white/70">Location</span>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-bold text-white focus:outline-none [&>option]:text-slate-900"
                            >
                                {LOCATIONS.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <ChevronDown className="pointer-events-none absolute bottom-1 right-0 size-4 text-white/70" aria-hidden />
                    </label>

                    {/* Search (desktop / tablet) */}
                    <form
                        onSubmit={onSearch}
                        role="search"
                        className="hidden h-11 min-w-0 flex-1 items-center rounded-full bg-white pl-2 pr-1.5 text-slate-900 shadow-sm ring-yellow-400 transition-shadow focus-within:ring-4 md:flex lg:max-w-2xl"
                    >
                        <div className="relative flex h-full shrink-0 items-center">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                aria-label="Search category"
                                className="h-full cursor-pointer appearance-none bg-transparent pl-3 pr-7 text-[13px] font-semibold text-slate-700 focus:outline-none"
                            >
                                <option value="all">All Categories</option>
                                <option value="shelter">Shelter & Gueto</option>
                                <option value="phones">Used Phones</option>
                                <option value="electronics">Electronics</option>
                                <option value="furniture">Furniture</option>
                                <option value="appliances">Appliances</option>
                                <option value="vehicles">Motos & Bikes</option>
                                <option value="tools">Tools</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 size-4 text-slate-400" aria-hidden />
                        </div>
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
                    <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
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
                            className="ml-1 grid size-10 cursor-pointer place-items-center rounded-full text-white transition-colors hover:bg-white/15 lg:hidden"
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
                                <div className="absolute left-0 top-full z-50 mt-3 w-[22rem] rounded-2xl bg-white p-2 text-slate-900 shadow-2xl ring-1 ring-black/5">
                                    <ul>
                                        {CATEGORIES.map(({ label, to, icon: Icon, hint }) => (
                                            <li key={label}>
                                                <Link
                                                    to={to}
                                                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-emerald-50"
                                                >
                                                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#15803D] transition-colors group-hover:bg-[#15803D] group-hover:text-white">
                                                        <Icon className="size-5" aria-hidden />
                                                    </span>
                                                    <span className="flex min-w-0 flex-col leading-tight">
                                                        <span className="text-sm font-bold">{label}</span>
                                                        <span className="text-xs text-slate-500">{hint}</span>
                                                    </span>
                                                    <ArrowRight
                                                        className="ml-auto size-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#15803D]"
                                                        aria-hidden
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
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
                                    <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl bg-white p-6 text-center text-slate-900 shadow-2xl ring-1 ring-black/5">
                                        <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-[#15803D]">
                                            <History className="size-6" aria-hidden />
                                        </span>
                                        <p className="mt-3 text-sm font-bold">Nothing viewed yet</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Listings you open will show up here so you can find them again.
                                        </p>
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
                        className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t border-white/10 bg-emerald-900 lg:hidden"
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
                                <ul className="mt-2 grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(({ label, to, icon: Icon }) => (
                                        <li key={label}>
                                            <Link
                                                to={to}
                                                className="flex h-12 items-center gap-2.5 rounded-xl bg-white/5 px-3 text-[13px] font-semibold text-white/90 transition-colors hover:bg-white/10"
                                            >
                                                <Icon className="size-4 shrink-0 text-yellow-300" aria-hidden />
                                                <span className="truncate">{label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3">
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
        </>
    );
};
