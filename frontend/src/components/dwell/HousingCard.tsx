import React from 'react';
import { MapPin, Droplet, Wifi, Zap, Car, Shield, MessageCircle } from 'lucide-react';
import type { HousingListing } from '@/types';

interface HousingCardProps {
    listing: HousingListing;
    onContact?: (listing: HousingListing) => void;
}

export const HousingCard: React.FC<HousingCardProps> = ({ listing, onContact }) => {
    const amenities = listing.amenities;

    return (
        <article className="bg-[#050B14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#8B1A1A]/60 flex flex-col">
            <div className="relative h-48 sm:h-56 bg-white/5 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-[#050B14]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-mono font-bold text-white">
                    {listing.monthly_rent.toLocaleString()} RWF<span className="text-[10px] text-white/60">/mo</span>
                </div>
                {amenities?.distance_to_campus_meters && (
                    <div className="absolute bottom-3 left-3 bg-[#8B1A1A]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{amenities.distance_to_campus_meters}m to RP Musanze</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                        {listing.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {listing.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {amenities?.has_water && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/5">
                                <Droplet className="w-3 h-3 text-cyan-400" /> Water
                            </span>
                        )}
                        {amenities?.has_wifi && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/5">
                                <Wifi className="w-3 h-3 text-green-400" /> Wi-Fi
                            </span>
                        )}
                        {amenities?.has_electricity && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/5">
                                <Zap className="w-3 h-3 text-yellow-400" /> Power
                            </span>
                        )}
                        {amenities?.has_parking && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/5">
                                <Car className="w-3 h-3 text-purple-400" /> Parking
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/80 font-medium">
                            {listing.landlord?.name ?? 'Hostel Landlord'}
                        </span>
                        {listing.landlord?.is_verified && (
                            <Shield className="w-3.5 h-3.5 text-[#39FF14]" />
                        )}
                    </div>

                    <button
                        onClick={() => onContact?.(listing)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#A93226] text-white text-xs font-semibold transition-colors"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Inquire</span>
                    </button>
                </div>
            </div>
        </article>
    );
};
