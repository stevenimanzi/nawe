import React, { useState } from 'react';
import { useHousingListings } from '@/hooks/useHousingListings';
import { HousingCard } from '@/components/dwell/HousingCard';
import { Filter, Search, Loader2 } from 'lucide-react';

export const DwellView: React.FC = () => {
    const [roomsFilter, setRoomsFilter] = useState<number | undefined>();
    const [search, setSearch] = useState('');

    const { data: listings, isLoading } = useHousingListings({
        rooms: roomsFilter,
    });

    const filtered = (listings ?? []).filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050B14] pb-24 text-white">
            <section className="px-4 py-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 text-xs text-[#C0392B] uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#8B1A1A] animate-pulse" />
                        Ground Layer • Off-Campus Discovery
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        RP Musanze Gueto & Hostels
                    </h1>
                    <p className="text-xs sm:text-sm text-white/60">
                        Vetted student housing within walking distance of Rwanda Polytechnic Musanze College.
                    </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by area (Muhoza, Ruhengeri, Cyivugiza)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#8B1A1A]"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => setRoomsFilter(undefined)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                roomsFilter === undefined
                                    ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                            }`}
                        >
                            All Rooms
                        </button>
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                onClick={() => setRoomsFilter(num)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                    roomsFilter === num
                                        ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                                }`}
                            >
                                {num} {num === 1 ? 'Room' : 'Rooms'}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#8B1A1A]" />
                        <span className="text-xs text-white/60">Loading Musanze listings...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl mt-6">
                        <Filter className="w-8 h-8 mx-auto text-white/30 mb-2" />
                        <p className="text-sm font-semibold text-white/80">No listings found</p>
                        <p className="text-xs text-white/50 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {filtered.map((listing) => (
                            <HousingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
