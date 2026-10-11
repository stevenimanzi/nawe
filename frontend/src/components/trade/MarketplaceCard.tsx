import React from 'react';
import { Tag, ShieldCheck, ShoppingCart } from 'lucide-react';
import type { MarketplaceItem } from '@/types';

interface MarketplaceCardProps {
    item: MarketplaceItem;
    onBuy?: (item: MarketplaceItem) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item, onBuy }) => {
    const categoryLabels: Record<string, string> = {
        tvet_tools: 'TVET Gear',
        electronics: 'Tech',
        essentials: 'Hostel',
        books: 'Academic',
        clothing: 'Style',
        other: 'Item',
    };

    return (
        <article className="group bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-[#39FF14]/50 transition-all flex flex-col justify-between">
            <div>
                <div className="relative h-40 bg-white/5 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#050B14]/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-[#39FF14] flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{categoryLabels[item.category] ?? item.category}</span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-[#39FF14] text-[#050B14] px-2.5 py-0.5 rounded-full text-xs font-black shadow-md">
                        {item.price.toLocaleString()} RWF
                    </div>
                </div>

                <div className="p-3.5">
                    <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#39FF14] transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>

            <div className="p-3.5 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <div className="flex items-center gap-1 text-[11px] text-white/70">
                    <span className="truncate max-w-[90px]">{item.seller?.name ?? 'Student'}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
                </div>

                <button
                    onClick={() => onBuy?.(item)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#39FF14] hover:bg-[#2ecc71] text-[#050B14] text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#39FF14]/10"
                >
                    <ShoppingCart className="w-3 h-3 stroke-[2.5]" />
                    <span>Buy</span>
                </button>
            </div>
        </article>
    );
};
