import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { NEIGHBOURHOOD_ID, PHOTOS, SECOND_HAND_ID, srcSet, unsplash } from '@/lib/photos';

const INTERVAL = 6500;

interface Slide {
    photoId: string;
    alt: string;
    position: string;
    label: string;
    title: string;
    text: string;
    cta: { label: string; to: string };
    secondary: { label: string; to: string };
}

const SLIDES: Slide[] = [
    {
        photoId: NEIGHBOURHOOD_ID,
        alt: 'Houses on a hillside in Kigali, Rwanda',
        position: '50% 55%',
        label: 'Shelter & Gueto',
        title: 'Find a room close to where you live',
        text: 'Studios, rooms and houses from verified landlords, with their contact right there.',
        cta: { label: 'Find a Room', to: '/dwell?sort=nearest&radius=10' },
        secondary: { label: 'Browse Marketplace', to: '/trade' },
    },
    {
        photoId: SECOND_HAND_ID,
        alt: 'Second-hand sofas and appliances displayed outside a shop',
        position: '40% 62%',
        label: 'Second-hand',
        title: 'Good things, second time around',
        text: 'Furniture, phones, laptops and appliances at prices that make sense, from people near you.',
        cta: { label: 'Shop Now', to: '/trade' },
        secondary: { label: 'Near Me', to: '/trade?sort=nearest' },
    },
    {
        photoId: PHOTOS.rentals.id,
        alt: PHOTOS.rentals.alt,
        position: '50% 28%',
        label: 'Rent from Neighbours',
        title: 'Need it for a day? Borrow it nearby',
        text: 'A suit for an interview, shoes for an event, a washing machine for the week.',
        cta: { label: 'Browse Rentals', to: '/trade?category=rentals' },
        secondary: { label: 'List an Item', to: '/post' },
    },
    {
        photoId: PHOTOS.vehicles.id,
        alt: PHOTOS.vehicles.alt,
        position: '50% 50%',
        label: 'Motos & Bikes',
        title: 'Get moving without the new price',
        text: 'Second-hand motorcycles and bicycles, listed by ID-verified sellers.',
        cta: { label: 'Shop Motos', to: '/trade?category=vehicles' },
        secondary: { label: 'All Categories', to: '/trade' },
    },
];

export const HeroSlider: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [reduceMotion] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    const stopped = paused || hovering || reduceMotion;
    const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

    useEffect(() => {
        if (stopped) return;
        const t = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
        return () => clearTimeout(t);
    }, [index, stopped]);

    return (
        <div
            className="relative isolate min-h-[600px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel shadow-2xl lg:min-h-[700px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured banners"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Background images */}
            {SLIDES.map((s, i) => (
                <img
                    key={s.title}
                    src={unsplash(s.photoId, 1800)}
                    srcSet={srcSet(s.photoId, [1200, 1800, 2400])}
                    sizes="100vw"
                    alt={i === index ? s.alt : ''}
                    aria-hidden={i !== index}
                    loading="eager"
                    decoding="async"
                    style={{ objectPosition: s.position }}
                    className={`absolute inset-0 -z-20 size-full object-cover transition-[opacity,transform] duration-[1200ms,9000ms] ease-out motion-reduce:transition-none ${
                        i === index ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
                    } motion-reduce:scale-100`}
                />
            ))}

            {/* Readability overlays */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-panel/95 via-panel/60 to-panel/10" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

            {/* Copy (re-mounts on each slide so it animates in) */}
            <div
                key={index}
                className="relative z-10 flex min-h-[600px] max-w-3xl flex-col justify-center px-8 pb-44 pt-20 sm:px-14 lg:min-h-[700px] lg:px-20"
            >
                <span className="w-fit animate-rise rounded-full border border-white/35 bg-black/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm motion-reduce:animate-none">
                    {SLIDES[index].label}
                </span>
                <h1 className="mt-6 animate-rise text-4xl font-bold leading-[1.08] tracking-tight text-white [animation-delay:90ms] motion-reduce:animate-none sm:text-5xl lg:text-6xl">
                    {SLIDES[index].title}
                </h1>
                <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-slate-200 [animation-delay:180ms] motion-reduce:animate-none sm:text-lg">
                    {SLIDES[index].text}
                </p>
                <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:270ms] motion-reduce:animate-none">
                    <Link
                        to={SLIDES[index].cta.to}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-8 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
                    >
                        {SLIDES[index].cta.label}
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    <Link
                        to={SLIDES[index].secondary.to}
                        className="inline-flex h-12 items-center rounded-full border border-white/45 px-8 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#111111]"
                    >
                        {SLIDES[index].secondary.label}
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-24 left-8 z-10 flex items-center gap-4 sm:left-14 lg:bottom-28 lg:left-20">
                <ol className="flex items-center gap-2" aria-label="Choose a banner">
                    {SLIDES.map((s, i) => (
                        <li key={s.title}>
                            <button
                                type="button"
                                onClick={() => go(i)}
                                aria-label={`Show banner ${i + 1}: ${s.label}`}
                                aria-current={i === index}
                                className="group flex h-6 w-12 cursor-pointer items-center"
                            >
                                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/30 transition-colors group-hover:bg-white/50">
                                    {i === index && (
                                        <span
                                            key={`${index}-${stopped}`}
                                            className={`absolute inset-y-0 left-0 block rounded-full bg-white ${
                                                reduceMotion ? 'w-full' : 'animate-progress'
                                            }`}
                                            style={{
                                                animationDuration: `${INTERVAL}ms`,
                                                animationPlayState: stopped ? 'paused' : 'running',
                                            }}
                                        />
                                    )}
                                </span>
                            </button>
                        </li>
                    ))}
                </ol>

                {!reduceMotion && (
                    <button
                        type="button"
                        onClick={() => setPaused((p) => !p)}
                        aria-label={paused ? 'Play banner rotation' : 'Pause banner rotation'}
                        className="cursor-pointer text-white/80 transition-colors hover:text-white"
                    >
                        {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                    </button>
                )}
            </div>

            <div className="absolute bottom-24 right-6 z-10 hidden items-center gap-1 sm:flex lg:bottom-28 lg:right-12">
                <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Previous banner"
                    className="cursor-pointer p-2 text-white/80 transition-colors hover:text-white"
                >
                    <ChevronLeft className="size-7" aria-hidden />
                </button>
                <span className="px-1 text-sm font-medium tabular-nums text-white/80" aria-hidden>
                    {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>
                <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label="Next banner"
                    className="cursor-pointer p-2 text-white/80 transition-colors hover:text-white"
                >
                    <ChevronRight className="size-7" aria-hidden />
                </button>
            </div>
        </div>
    );
};
