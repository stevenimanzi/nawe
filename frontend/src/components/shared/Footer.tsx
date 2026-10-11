import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUp,
    BadgeCheck,
    Check,
    Clock,
    Handshake,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
} from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { SOCIALS } from './socials';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const YEAR = new Date().getFullYear();

const TRUST = [
    {
        icon: BadgeCheck,
        title: 'ID-verified sellers',
        text: 'Every seller completes KYC before they can post.',
    },
    {
        icon: ShieldCheck,
        title: 'Scam protection',
        text: 'Report suspicious listings and follow our safety guide.',
    },
    {
        icon: Handshake,
        title: 'Direct landlord contacts',
        text: 'Talk to owners directly. No hidden agent fees.',
    },
];

const LINK_GROUPS: { title: string; links: { label: string; to: string }[] }[] = [
    {
        title: 'Marketplace',
        links: [
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
            { label: 'Studios & Apartments', to: '/dwell?type=studio' },
            { label: 'Houses for Rent', to: '/dwell?type=house' },
            { label: 'Post a Property', to: '/post' },
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
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Cookie Policy', to: '/cookies' },
];

const linkClass =
    'inline-flex items-center rounded text-sm text-emerald-100/80 transition-colors hover:text-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300';

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
        <footer className="mt-auto w-full bg-white">
            {/* ───────── Trust strip ───────── */}
            <div className="border-y border-slate-200 bg-slate-50">
                <ul className="grid w-full gap-6 px-[30px] py-8 sm:grid-cols-3 sm:gap-8">
                    {TRUST.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="flex items-start gap-4">
                            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-100 text-[#15803D]">
                                <Icon className="size-6" aria-hidden />
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-heading text-base font-bold text-slate-900">{title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ───────── Main footer ───────── */}
            <div className="bg-[#0B3D24] text-white">
                {/* Newsletter */}
                <div className="w-full border-b border-white/10 px-[30px] py-12 lg:py-14">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                        <div className="max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">
                                Newsletter
                            </p>
                            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                Be first to see new rooms and{' '}
                                <span className="text-yellow-300">great second-hand deals</span>
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">
                                One short email a week. Fresh listings near you, no spam, unsubscribe any time.
                            </p>
                        </div>

                        <form onSubmit={onSubscribe} className="w-full lg:max-w-md">
                            <label htmlFor="footer-email" className="sr-only">
                                Email address
                            </label>
                            <div className="flex h-14 items-center rounded-full bg-white pl-6 pr-1.5 text-slate-900 shadow-lg focus-within:ring-4 focus-within:ring-yellow-400/60">
                                <input
                                    id="footer-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setSubscribed(false);
                                    }}
                                    placeholder="Enter your email address"
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-yellow-400 px-6 text-sm font-bold text-emerald-950 transition-colors hover:bg-yellow-300"
                                >
                                    Subscribe
                                    <ArrowRight className="size-4" aria-hidden />
                                </button>
                            </div>
                            <p
                                role="status"
                                className={`mt-3 flex items-center gap-2 pl-6 text-sm text-yellow-300 transition-opacity ${
                                    subscribed ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <Check className="size-4" aria-hidden />
                                {subscribed ? "Thanks, you're on the list." : ' '}
                            </p>
                        </form>
                    </div>
                </div>

                {/* Columns */}
                <div className="grid w-full gap-12 px-[30px] py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.3fr] lg:gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2.5" aria-label="NAWE home">
                            <span className="grid size-11 place-items-center rounded-full bg-yellow-400 font-heading text-xl font-black text-emerald-950">
                                N
                            </span>
                            <span className="font-heading text-3xl font-extrabold tracking-tight">NAWE</span>
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-emerald-100/80">
                            Rwanda's trusted marketplace for second-hand goods and shelter. Every seller is ID
                            verified, so you can buy, rent and move with confidence.
                        </p>

                        <ul className="mt-6 flex items-center gap-2.5">
                            {SOCIALS.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        aria-label={s.label}
                                        className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-yellow-400 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-[18px]"
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
                        <ul className="mt-5 space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-yellow-300">
                                    <Phone className="size-4" aria-hidden />
                                </span>
                                <a href={CONTACT.phoneHref} className="pt-1.5 font-semibold hover:text-yellow-300">
                                    {CONTACT.phoneDisplay}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-yellow-300">
                                    <Mail className="size-4" aria-hidden />
                                </span>
                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    className="break-all pt-1.5 text-emerald-100/90 hover:text-yellow-300"
                                >
                                    {CONTACT.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-yellow-300">
                                    <MapPin className="size-4" aria-hidden />
                                </span>
                                <span className="pt-1.5 text-emerald-100/90">{CONTACT.address}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-yellow-300">
                                    <Clock className="size-4" aria-hidden />
                                </span>
                                <span className="pt-1.5 text-emerald-100/90">{CONTACT.hours}</span>
                            </li>
                        </ul>

                        <a
                            href={CONTACT.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-yellow-400 px-5 text-sm font-bold text-emerald-950 transition-colors hover:bg-yellow-300"
                        >
                            <MessageCircle className="size-4" aria-hidden />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10">
                    <div className="flex w-full flex-col gap-4 px-[30px] py-6 text-sm text-emerald-100/70 md:flex-row md:items-center md:justify-between">
                        <p>© {YEAR} NAWE. All rights reserved. Made in Rwanda.</p>

                        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {LEGAL.map((l) => (
                                <li key={l.label}>
                                    <Link to={l.to} className="transition-colors hover:text-yellow-300">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-4 font-semibold text-white transition-colors hover:bg-white hover:text-[#0B3D24]"
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
