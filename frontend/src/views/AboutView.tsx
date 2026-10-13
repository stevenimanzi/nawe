import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';

const OFFERINGS = [
    {
        title: 'Second-hand marketplace',
        text: 'Buy and sell phones, laptops, furniture, appliances, motos, tools and more at fair prices, without paying new-item prices.',
    },
    {
        title: 'Shelter & Gueto finder',
        text: 'Find rooms, studios and houses for rent and speak directly to the landlord.',
    },
    {
        title: 'Rent from neighbours',
        text: 'Need a suit for a day or a washing machine for a week? Borrow it from someone nearby instead of buying it.',
    },
    {
        title: 'Verified and near you',
        text: 'Every seller completes ID (KYC) verification, and Near Me shows listings close to where you are.',
    },
];

const VALUES = [
    { title: 'Trust first', text: 'Verified identities and honest listings come before growth.' },
    { title: 'Affordable for everyone', text: 'Good things should not cost a fortune, whether you are buying or renting.' },
    { title: 'Local by design', text: 'We connect neighbours, because the best deal is often a few streets away.' },
    { title: 'Less waste', text: 'Every item that finds a second owner is one less thrown away.' },
];

interface Founder {
    name: string;
    role: string;
    bio: string;
    /** Path or URL to a portrait. Leave undefined to show the placeholder. */
    photo?: string;
}

const FOUNDERS: Founder[] = [
    {
        name: 'Steven IMANZI',
        role: 'Software Developer & Tech Entrepreneur',
        bio: 'Steven designs and builds the NAWE platform, turning the idea of a trusted local marketplace into software that people can rely on every day.',
    },
    {
        name: 'BYIRINGIRO Innocent',
        role: 'Business Specialist',
        bio: 'Innocent leads the business side of NAWE, understanding what buyers, sellers and landlords need and shaping how the marketplace serves them.',
    },
];

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.16em]';

export const AboutView: React.FC = () => (
    <div className="about-page">
        {/* Hero */}
        <section className="bg-[#0B3D24] text-white">
            <div className="w-full px-[30px] py-16 lg:py-24">
                <h1 className="max-w-4xl text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-[3.5rem]">
                    Second-hand goods and shelter, made{' '}
                    <span className="text-emerald-300">simple, safe and close to home.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-emerald-100/85 sm:text-lg">
                    NAWE is a Rwandan online marketplace where people buy, sell and rent second-hand items, and find
                    rooms and houses (gueto) to live in, all from sellers whose identity has been verified.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        to="/trade"
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 shadow-sm"
                    >
                        Explore the marketplace
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    <Link
                        to="/dwell"
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0B3D24]"
                    >
                        Find a room
                    </Link>
                </div>
            </div>
        </section>

        {/* What NAWE does */}
        <section className="bg-white">
            <div className="w-full px-[30px] py-16 lg:py-20">
                <p className={`${eyebrow} text-[#15803D]`}>What we do</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                    One place to find what you need, and a home to put it in.
                </h2>

                <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {OFFERINGS.map((o) => (
                        <div key={o.title} className="border-t-2 border-[#15803D] pt-5">
                            <h3 className="text-lg font-semibold text-slate-900">{o.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Vision & mission */}
        <section className="bg-slate-50">
            <div className="grid w-full gap-6 px-[30px] py-16 lg:grid-cols-2 lg:gap-8 lg:py-20">
                <article className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 sm:p-10">
                    <p className={`${eyebrow} text-[#15803D]`}>Our vision</p>
                    <h2 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                        A Rwanda where everyone can find what they need, nearby, affordably and safely.
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                        A place to live and the things to live well, within reach of every household, with nothing
                        useful going to waste.
                    </p>
                </article>

                <article className="rounded-3xl bg-[#15803D] p-8 text-white sm:p-10">
                    <p className={`${eyebrow} text-emerald-100`}>Our mission</p>
                    <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                        To connect buyers, sellers, renters and landlords on one trusted platform.
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-emerald-50/90">
                        We build on verified identities, honest listings and local community, so second-hand goods
                        and shelter are easier to find, fairer to pay for and safer to trade.
                    </p>
                </article>
            </div>
        </section>

        {/* Values */}
        <section className="bg-white">
            <div className="w-full px-[30px] py-16 lg:py-20">
                <p className={`${eyebrow} text-[#15803D]`}>What we stand for</p>
                <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map((v) => (
                        <div key={v.title}>
                            <dt className="text-lg font-semibold text-slate-900">{v.title}</dt>
                            <dd className="mt-2 text-sm leading-relaxed text-slate-600">{v.text}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>

        {/* Founders */}
        <section className="border-t border-slate-200 bg-slate-50">
            <div className="w-full px-[30px] py-16 lg:py-20">
                <p className={`${eyebrow} text-[#15803D]`}>The team</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Meet the founders</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                    NAWE was started by two people who want buying, renting and finding a home to feel simple and safe.
                </p>

                <ul className="mt-10 grid gap-6 lg:grid-cols-2">
                    {FOUNDERS.map((f) => (
                        <li
                            key={f.name}
                            className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 sm:flex-row sm:items-start"
                        >
                            <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 text-slate-300">
                                {f.photo ? (
                                    <img src={f.photo} alt={f.name} className="size-full object-cover" />
                                ) : (
                                    <User className="size-12" strokeWidth={1.25} aria-label={`${f.name} photo placeholder`} />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className={`${eyebrow} text-[#15803D]`}>Co-founder</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-900">{f.name}</h3>
                                <p className="mt-0.5 text-sm font-medium text-slate-500">{f.role}</p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">{f.bio}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* CTA */}
        <section className="bg-[#15803D] text-white">
            <div className="flex w-full flex-col gap-6 px-[30px] py-12 md:flex-row md:items-center md:justify-between">
                <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">Ready to buy, rent or list something?</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/post"
                        className="inline-flex h-12 items-center rounded-full bg-black px-7 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 shadow-sm"
                    >
                        Post a listing
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 text-sm font-semibold transition-colors hover:bg-white hover:text-[#15803D]"
                    >
                        Contact us
                    </Link>
                </div>
            </div>
        </section>
    </div>
);
