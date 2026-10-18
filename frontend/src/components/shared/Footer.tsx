import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUp,
    Check,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { PHOTO_CREDITS } from '@/lib/photos';
import { SOCIALS } from './socials';
import logoWhite from '@/assets/brand/logo-white.svg';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const YEAR = new Date().getFullYear();

const LINK_GROUPS: { title: string; links: { label: string; to: string }[] }[] = [
    {
        title: 'Marketplace',
        links: [
            { label: 'Rent from Neighbours', to: '/trade?category=rentals' },
            { label: 'Used Phones', to: '/trade?category=phones' },
            { label: 'Laptops & Electronics', to: '/trade?category=electronics' },
            { label: 'Furniture & Beds', to: '/trade?category=furniture' },
            { label: 'Room Appliances', to: '/trade?category=appliances' },
            { label: 'Motos & Bikes', to: '/trade?category=vehicles' },
            { label: 'Urgent Deals', to: '/deals' },
        ],
    },
    {
        title: 'Shelter & Gueto',
        links: [
            { label: 'Find a Room', to: '/dwell' },
            { label: 'Studios & Apartments', to: '/dwell?property_type=studio' },
            { label: 'Houses for Rent', to: '/dwell?property_type=house' },
            { label: 'Post a Property', to: '/post/housing' },
            { label: 'Landlord Guide', to: '/guides/landlords' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Help Centre', to: '/help' },
            { label: 'Safety Tips', to: '/safety' },
            { label: 'Seller Verification', to: '/kyc' },
            { label: 'Report a Listing', to: '/report' },
            { label: 'Contact Us', to: '/contact' },
        ],
    },
];

const LEGAL = [
    { label: 'About NAWE', to: '/about' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Cookie Policy', to: '/cookies' },
];

const linkClass =
    'inline-flex items-center rounded text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const onSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        // TODO: POST to the newsletter endpoint once the backend exposes one.
        setSubscribed(true);
        setEmail('');
    };

    return (
        <footer className="mt-auto w-full bg-canvas">
            {/* ───────── Main footer ───────── */}
            <div className="border-t border-white/10 bg-panel text-white">
                {/* Columns */}
                <div className="grid w-full gap-12 px-[30px] py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.3fr] lg:gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-flex" aria-label="NAWE home">
                            <img src={logoWhite} alt="NAWE" className="h-14 w-auto" />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
                            Rwanda's trusted marketplace for second-hand goods and shelter. Every seller is ID
                            verified, so you can buy, rent and move with confidence.
                        </p>

                        <ul className="-ml-2.5 mt-5 flex items-center gap-1">
                            {SOCIALS.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        aria-label={s.label}
                                        className="grid size-10 place-items-center text-white transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
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

                        <form onSubmit={onSubscribe} className="mt-8 max-w-sm">
                            <label htmlFor="footer-email" className="sr-only">
                                Email address
                            </label>
                            <div className="flex h-12 items-center rounded-full bg-panel-2 pl-5 pr-1 text-white ring-1 ring-white/10 focus-within:ring-white/30">
                                <input
                                    id="footer-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setSubscribed(false);
                                    }}
                                    placeholder="Enter your email"
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm placeholder:text-slate-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-white transition-colors hover:bg-action-hover shadow-sm"
                                >
                                    Subscribe
                                    <ArrowRight className="size-4" aria-hidden />
                                </button>
                            </div>
                            <p
                                role="status"
                                className={`mt-2 flex items-center gap-2 pl-5 text-sm text-white transition-opacity ${
                                    subscribed ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <Check className="size-4" aria-hidden />
                                {subscribed ? "Thanks, you're on the list." : ' '}
                            </p>
                        </form>
                    </div>

                    {/* Link groups */}
                    {LINK_GROUPS.map((group) => (
                        <nav key={group.title} aria-label={group.title}>
                            <h3 className="font-heading text-base font-bold">{group.title}</h3>
                            <ul className="mt-5 space-y-3">
                                {group.links.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to} className={linkClass}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    {/* Contact */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="font-heading text-base font-bold">Contact Info</h3>
                        <ul className="mt-5 space-y-5 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="grid size-6 shrink-0 place-items-center text-white">
                                    <Phone className="size-5" aria-hidden />
                                </span>
                                <a href={CONTACT.phoneHref} className="font-semibold hover:text-white">
                                    {CONTACT.phoneDisplay}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="grid size-6 shrink-0 place-items-center text-white">
                                    <Mail className="size-5" aria-hidden />
                                </span>
                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    className="break-all text-slate-300 hover:text-white"
                                >
                                    {CONTACT.email}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="grid size-6 shrink-0 place-items-center text-white">
                                    <MapPin className="size-5" aria-hidden />
                                </span>
                                <span className="text-slate-300">{CONTACT.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="grid size-6 shrink-0 place-items-center text-white">
                                    <Clock className="size-5" aria-hidden />
                                </span>
                                <span className="text-slate-300">{CONTACT.hours}</span>
                            </li>
                        </ul>

                        <a
                            href={CONTACT.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-white transition-colors hover:bg-action-hover shadow-sm"
                        >
                            <MessageCircle className="size-4" aria-hidden />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom bar - Rwandan Imigongo Design */}
                <div className="border-t border-white/10 bg-imigongo-dark">
                    <div className="flex w-full flex-col gap-4 px-[30px] py-6 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p>© {YEAR} NAWE. All rights reserved.</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Photos by {PHOTO_CREDITS.join(', ')} on{' '}
                                <a
                                    href="https://unsplash.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:text-slate-300"
                                >
                                    Unsplash
                                </a>
                            </p>
                        </div>

                        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {LEGAL.map((l) => (
                                <li key={l.label}>
                                    <Link to={l.to} className="transition-colors hover:text-white">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-4 font-semibold text-white transition-colors hover:bg-white hover:text-[#111111]"
                                >
                                    Back to top
                                    <ArrowUp className="size-4" aria-hidden />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};
