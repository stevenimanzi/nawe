import React, { useState } from 'react';
import { useMarketplaceItems } from '@/hooks/useMarketplaceItems';
import { MarketplaceCard } from '@/components/trade/MarketplaceCard';
import { Sparkles, Search, Loader2 } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All Items' },
    { id: 'tvet_tools', label: '🛠️ TVET Tools' },
    { id: 'electronics', label: '💻 Electronics' },
    { id: 'essentials', label: '🛏️ Essentials' },
    { id: 'books', label: '📚 Books' },
    { id: 'clothing', label: '👕 Clothing' },
];

export const TradeView: React.FC = () => {
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');

    const { data: items, isLoading } = useMarketplaceItems({
        category: category === 'all' ? undefined : category,
    });

    const filtered = (items ?? []).filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050B14] pb-24 text-white">
            <section className="px-4 py-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Elevated Layer • Student Peer Commerce
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Musanze Campus Marketplace
                    </h1>
                    <p className="text-xs sm:text-sm text-white/60">
                        Buy and sell TVET workshop kits, tech gear, and student hostel supplies with KYC verified peers.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search tools, calculators, hostelling gear..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#39FF14]"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                    category === cat.id
                                        ? 'bg-[#39FF14] text-[#050B14] font-bold border-[#39FF14] shadow-md shadow-[#39FF14]/20'
                                        : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#39FF14]" />
                        <span className="text-xs text-white/60">Loading marketplace items...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl mt-6">
                        <p className="text-sm font-semibold text-white/80">No items available</p>
                        <p className="text-xs text-white/50 mt-1">Be the first to list in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mt-6">
                        {filtered.map((item) => (
                            <MarketplaceCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
