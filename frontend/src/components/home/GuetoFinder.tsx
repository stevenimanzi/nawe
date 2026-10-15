import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChevronDown, Phone, Search } from 'lucide-react';
import { PHOTOS, srcSet, unsplash } from '@/lib/photos';
import { SelectMenu, type SelectOption } from '@/components/shared/SelectMenu';

const LOCATION_OPTIONS: SelectOption[] = [
    { value: 'any', label: 'Anywhere in Rwanda' },
    ...['Kigali', 'Musanze', 'Huye', 'Rubavu', 'Muhanga', 'Rwamagana'].map((l) => ({ value: l, label: l })),
];

const ROOM_OPTIONS: SelectOption[] = [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1 room' },
    { value: '2', label: '2 rooms' },
    { value: '3', label: '3 rooms' },
    { value: '4', label: '4+ rooms' },
];

const AMENITIES = [
    { key: 'water', label: 'Water' },
    { key: 'electricity', label: 'Electricity' },
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'furnished', label: 'Furnished' },
    { key: 'parking', label: 'Parking' },
];

const STEPS = [
    { title: 'Search', text: 'Choose where you want to live, what you can pay and how many rooms you need.' },
    { title: 'Contact the landlord', text: 'Talk to the owner directly, with no middleman in between.' },
    { title: 'Move in with confidence', text: 'Visit, agree and move in knowing the landlord has been ID-verified.' },
];

const fieldClass =
    'block rounded-2xl bg-canvas/70 px-4 py-3 ring-1 ring-white/10 transition-shadow hover:ring-white/25 focus-within:ring-white/40';

export const GuetoFinder: React.FC = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('any');
    const [rooms, setRooms] = useState('any');
    const [maxRent, setMaxRent] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);

    const toggle = (key: string) =>
        setAmenities((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location !== 'any') params.set('location', location);
        if (rooms !== 'any') params.set('rooms', rooms);
        if (maxRent) params.set('max_rent', maxRent);
        if (amenities.length) params.set('amenities', amenities.join(','));
        const qs = params.toString();
        navigate(qs ? `/dwell?${qs}` : '/dwell');
    };

    const photo = PHOTOS.shelter;

    return (
        <section>
            <div className="w-full px-[30px] pb-14 lg:pb-20">
                <div className="grid overflow-hidden rounded-[2rem] bg-panel ring-1 ring-white/10 lg:grid-cols-12">
                    {/* Search */}
                    <div className="p-8 sm:p-12 lg:col-span-7 lg:p-14">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Shelter &amp; Gueto</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Get a gueto easily
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                            Search rooms, studios and houses near you, then talk to the landlord directly.
                        </p>

                        <form onSubmit={onSubmit} className="mt-9">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className={fieldClass}>
                                    <span className="block text-xs font-medium text-slate-400">Where</span>
                                    <SelectMenu
                                        label="Location"
                                        heading="Select location"
                                        value={location}
                                        onChange={setLocation}
                                        options={LOCATION_OPTIONS}
                                        className="mt-1"
                                        triggerClassName="flex w-full cursor-pointer items-center justify-between gap-2 text-left text-[15px] font-semibold text-white focus-visible:outline-none"
                                        renderTrigger={(sel, open) => (
                                            <>
                                                <span className="truncate">{sel.label}</span>
                                                <ChevronDown
                                                    className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    aria-hidden
                                                />
                                            </>
                                        )}
                                    />
                                </div>

                                <div className={fieldClass}>
                                    <span className="block text-xs font-medium text-slate-400">Rooms</span>
                                    <SelectMenu
                                        label="Number of rooms"
                                        value={rooms}
                                        onChange={setRooms}
                                        options={ROOM_OPTIONS}
                                        className="mt-1"
                                        triggerClassName="flex w-full cursor-pointer items-center justify-between gap-2 text-left text-[15px] font-semibold text-white focus-visible:outline-none"
                                        renderTrigger={(sel, open) => (
                                            <>
                                                <span className="truncate">{sel.label}</span>
                                                <ChevronDown
                                                    className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    aria-hidden
                                                />
                                            </>
                                        )}
                                    />
                                </div>

                                <label className={fieldClass}>
                                    <span className="block text-xs font-medium text-slate-400">Max rent per month</span>
                                    <span className="mt-1 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-400">RWF</span>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            min={0}
                                            step={5000}
                                            value={maxRent}
                                            onChange={(e) => setMaxRent(e.target.value)}
                                            placeholder="Any"
                                            className="w-full min-w-0 bg-transparent text-[15px] font-semibold text-white placeholder:text-slate-500 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                    </span>
                                </label>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Must have">
                                <span className="mr-1 text-sm text-slate-400">Must have</span>
                                {AMENITIES.map((a) => {
                                    const on = amenities.includes(a.key);
                                    return (
                                        <button
                                            key={a.key}
                                            type="button"
                                            aria-pressed={on}
                                            onClick={() => toggle(a.key)}
                                            className={`h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${
                                                on
                                                    ? 'border-white bg-white text-[#111111]'
                                                    : 'border-white/20 text-slate-200 hover:border-white/50 hover:text-white'
                                            }`}
                                        >
                                            {a.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="submit"
                                className="mt-8 inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-action px-10 text-[15px] font-semibold text-white transition-colors hover:bg-action-hover sm:w-auto"
                            >
                                <Search className="size-5" aria-hidden />
                                Search gueto
                            </button>
                        </form>
                    </div>

                    {/* Photo */}
                    <div className="relative min-h-[360px] lg:col-span-5">
                        <img
                            src={unsplash(photo.id, 1400)}
                            srcSet={srcSet(photo.id, [800, 1200, 1600])}
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            alt={photo.alt}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                        <div className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl bg-white py-3 pl-4 pr-5 text-[#111111] shadow-2xl sm:left-8 sm:top-8">
                            <Phone className="size-5 text-action" aria-hidden />
                            <span className="leading-tight">
                                <span className="block text-sm font-semibold">Direct landlord contact</span>
                                <span className="block text-xs text-slate-500">No middleman, no agent</span>
                            </span>
                        </div>

                        <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl bg-white py-3 pl-4 pr-5 text-[#111111] shadow-2xl sm:bottom-8 sm:right-8">
                            <BadgeCheck className="size-5 text-gold" aria-hidden />
                            <span className="leading-tight">
                                <span className="block text-sm font-semibold">ID-verified landlords</span>
                                <span className="block text-xs text-slate-500">Checked before they list</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <ol className="mt-10 grid gap-8 md:grid-cols-3">
                    {STEPS.map((s, i) => (
                        <li key={s.title} className="flex gap-5 border-t border-white/15 pt-6">
                            <span className="text-3xl font-bold tabular-nums leading-none text-white/25">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};
