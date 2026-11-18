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
    // `prev` stays underneath while the new card slides in and stacks above it.
    const [{ index, prev }, setPos] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null });
    const [paused, setPaused] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [reduceMotion] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    const stopped = paused || hovering || reduceMotion;
    const go = (i: number) =>
        setPos((p) => {
            const next = (i + SLIDES.length) % SLIDES.length;
            return next === p.index ? p : { index: next, prev: p.index };
        });

    useEffect(() => {
        if (stopped) return;
        const t = setTimeout(() => go(index + 1), INTERVAL);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, stopped]);

    return (
        <div
            className="relative isolate min-h-[600px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-black shadow-2xl lg:min-h-[700px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured banners"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {SLIDES.map((s, i) => {
                const isCurrent = i === index;
                const isPrev = i === prev;
                if (!isCurrent && !isPrev) return null;
                return (
                    <div
                        key={`${s.title}-${isCurrent ? index : 'prev'}-${prev ?? 'x'}`}
                        aria-hidden={!isCurrent}
                        className={`absolute inset-0 overflow-hidden bg-black ${
                            isCurrent ? 'z-10 animate-stack-in shadow-[-30px_0_60px_rgba(0,0,0,0.8)] motion-reduce:animate-none' : 'z-0'
                        }`}
                    >
                        <img
                            src={unsplash(s.photoId, 1800)}
                            srcSet={srcSet(s.photoId, [1200, 1800, 2400])}
                            sizes="100vw"
                            alt={isCurrent ? s.alt : ''}
                            loading="eager"
                            decoding="async"
                            style={{ objectPosition: s.position }}
                            className="absolute inset-0 size-full object-cover"
                        />
                        {/* Black readability overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                        <div className="relative z-10 flex min-h-[600px] max-w-3xl flex-col justify-center px-8 pb-44 pt-20 sm:px-14 lg:min-h-[700px] lg:px-20">
                            <span className="w-fit rounded-full border border-white/35 bg-black px-4 py-1.5 text-xs font-medium text-white">
                                {s.label}
                            </span>
                            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                {s.title}
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{s.text}</p>
                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <Link
                                    to={s.cta.to}
                                    tabIndex={isCurrent ? 0 : -1}
                                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white bg-black px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                                >
                                    {s.cta.label}
                                    <ArrowRight className="size-4" aria-hidden />
                                </Link>
                                <Link
                                    to={s.secondary.to}
                                    tabIndex={isCurrent ? 0 : -1}
                                    className="inline-flex h-12 items-center rounded-full border border-white/45 px-8 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                                >
                                    {s.secondary.label}
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Controls */}
            <div className="absolute bottom-24 right-6 z-20 flex items-center gap-1 sm:right-14 lg:bottom-28 lg:right-20">
                {!reduceMotion && (
                    <button
                        type="button"
                        onClick={() => setPaused((p) => !p)}
                        aria-label={paused ? 'Play banner rotation' : 'Pause banner rotation'}
                        className="cursor-pointer p-2 text-white/80 transition-colors hover:text-white"
                    >
                        {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Previous banner"
                    className="cursor-pointer p-2 text-white/80 transition-colors hover:text-white"
                >
                    <ChevronLeft className="size-7" aria-hidden />
                </button>
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
