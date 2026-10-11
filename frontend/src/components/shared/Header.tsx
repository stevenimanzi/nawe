import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    HeartIcon,
    ShoppingBagIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    HomeModernIcon,
    BuildingStorefrontIcon,
    PhoneIcon,
    ArrowRightIcon,
    SparklesIcon,
    TagIcon,
    KeyIcon,
    CheckBadgeIcon,
    MapPinIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import {
    ShieldCheckIcon as ShieldCheckSolid,
} from '@heroicons/react/24/solid';

export const Header: React.FC = () => {
    const [activePillar, setActivePillar] = useState<'marketplace' | 'gueto' | 'urgent'>('marketplace');
    const [searchCategory, setSearchCategory] = useState('All Categories');
    const [selectedLocation, setSelectedLocation] = useState('All Rwanda');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount] = useState(3);
    const [wishlistCount] = useState(5);

    return (
        <header className="w-full bg-[#FFFFFF] border-b border-emerald-950/10 shadow-sm m-0 p-0 font-sans">
            <div className="w-full bg-[#0F5132] text-white text-[12px] py-2 px-4 sm:px-8 lg:px-12 border-b border-emerald-900/30">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-100 font-bold text-[11px] border border-emerald-500/30">
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
                            Verified National Network
                        </span>
                        <span className="hidden md:inline text-emerald-100/90 font-medium">
                            Rwanda's Trusted Second-Hand Marketplace & Shelter / Gueto Finding Platform
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-emerald-100 text-[12px]">
                        <div className="hidden sm:flex items-center gap-1.5">
                            <ShieldCheckSolid className="w-4 h-4 text-emerald-300" />
                            <span className="font-semibold text-white">100% ID Verified (KYC) Sellers</span>
                        </div>
                        <span className="hidden sm:inline text-emerald-700">|</span>
                        <a
                            href="tel:+250788123456"
                            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
                        >
                            <PhoneIcon className="w-3.5 h-3.5" />
                            <span>Helpline: +250 788 123 456</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#15803D] text-white py-5 px-4 sm:px-8 lg:px-12 shadow-md">
                <div className="w-full flex items-center justify-between gap-6 lg:gap-10">
                    <a href="/" className="flex items-center gap-3.5 group shrink-0">
                        <div className="w-13 h-13 rounded-2xl bg-[#FFFFFF] flex items-center justify-center text-[#15803D] font-black text-3xl tracking-tighter shadow-xl shadow-black/15 group-hover:scale-105 transition-all">
                            N
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#FFFFFF] leading-none">
                                    NAWE
                                </span>
                                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20 uppercase tracking-wider">
                                    Market
                                </span>
                            </div>
                            <span className="text-[12px] font-medium text-emerald-100/90 tracking-wide mt-1">
                                Second-Hand Goods & Shelter / Gueto Platform
                            </span>
                        </div>
                    </a>

                    <div className="hidden lg:flex flex-1 max-w-4xl items-center">
                        <div className="w-full h-14 flex items-center bg-[#FFFFFF] rounded-2xl p-1.5 shadow-2xl shadow-emerald-950/20 focus-within:ring-4 focus-within:ring-white/30 transition-all">
                            <div className="relative h-full flex items-center">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="appearance-none h-full bg-transparent pl-4 pr-9 text-[13px] font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Shelter">Shelter & Gueto</option>
                                    <option value="Electronics">Used Electronics</option>
                                    <option value="Appliances">Room Appliances</option>
                                    <option value="Furniture">Furniture & Beds</option>
                                    <option value="Vehicles">Motos & Bikes</option>
                                    <option value="Tools">Workshop Tools</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                            </div>

                            <div className="h-7 w-px bg-slate-200" />

                            <div className="relative h-full flex items-center">
                                <MapPinIcon className="w-4 h-4 text-[#15803D] absolute left-3 pointer-events-none" />
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="appearance-none h-full bg-transparent pl-9 pr-9 text-[13px] font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    <option value="All Rwanda">All Rwanda</option>
                                    <option value="Kigali">Kigali City</option>
                                    <option value="Musanze">Musanze</option>
                                    <option value="Huye">Huye</option>
                                    <option value="Rubavu">Rubavu</option>
                                    <option value="Muhanga">Muhanga</option>
                                    <option value="Rwamagana">Rwamagana</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                            </div>

                            <div className="h-7 w-px bg-slate-200" />

                            <div className="relative flex-1 h-full flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search 1-room gueto, used smartphones, laptops, gas cylinders, beds..."
                                    className="w-full h-full bg-transparent px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                />
                            </div>

                            <button
                                type="button"
                                className="h-full px-7 rounded-xl bg-[#0F5132] hover:bg-[#0C4128] text-white text-[14px] font-bold tracking-wide transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer shrink-0"
                            >
                                <MagnifyingGlassIcon className="w-4 h-4 stroke-[2.5]" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            aria-label="Wishlist"
                        >
                            <HeartIcon className="w-6 h-6 stroke-[2]" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FFFFFF] text-[#15803D] text-[11px] font-extrabold flex items-center justify-center shadow-md">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            aria-label="Cart"
                        >
                            <ShoppingBagIcon className="w-6 h-6 stroke-[2]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FFFFFF] text-[#15803D] text-[11px] font-extrabold flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-8 w-px bg-white/20 hidden sm:block" />

                        <div className="hidden sm:flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-white text-[#15803D] font-black text-sm flex items-center justify-center shadow-md">
                                    SI
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#15803D] rounded-full" />
                            </div>
                            <div className="hidden xl:flex flex-col text-left">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] font-bold text-white group-hover:text-emerald-100 transition-colors leading-tight">
                                        Steven Imanzi
                                    </span>
                                    <CheckBadgeIcon className="w-4 h-4 text-emerald-300" />
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-200 leading-tight">
                                    Verified Member
                                </span>
                            </div>
                        </div>

                        <a
                            href="/post"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] hover:bg-emerald-50 text-[#15803D] text-[13px] font-extrabold tracking-wide shadow-lg shadow-black/10 transition-all active:scale-[0.98] shrink-0"
                        >
                            <span>+ Post Gueto or Item</span>
                            <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                        </a>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white lg:hidden cursor-pointer"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className="mt-4 lg:hidden">
                    <div className="w-full h-12 flex items-center bg-[#FFFFFF] rounded-xl p-1 shadow-md">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search gueto rooms, used phones, laptops, beds..."
                            className="w-full h-full bg-transparent px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            className="h-full px-4 rounded-lg bg-[#0F5132] text-white text-[12px] font-bold shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#FFFFFF] border-t border-slate-200/80 px-4 sm:px-8 lg:px-12 py-3">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        <button
                            onClick={() => setActivePillar('marketplace')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                                activePillar === 'marketplace'
                                    ? 'bg-[#15803D] text-white shadow-md shadow-emerald-700/20'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            <span>Second-Hand Marketplace</span>
                        </button>

                        <button
                            onClick={() => setActivePillar('gueto')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                                activePillar === 'gueto'
                                    ? 'bg-[#15803D] text-white shadow-md shadow-emerald-700/20'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <HomeModernIcon className="w-4 h-4" />
                            <span>Shelter & Gueto Finder</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803D] text-[10px] font-black uppercase">
                                Hot
                            </span>
                        </button>

                        <button
                            onClick={() => setActivePillar('urgent')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                                activePillar === 'urgent'
                                    ? 'bg-[#15803D] text-white shadow-md shadow-emerald-700/20'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <TagIcon className="w-4 h-4" />
                            <span>Urgent Relocation Deals</span>
                        </button>
                    </div>

                    <div className="hidden xl:flex items-center gap-8 text-[13px] text-slate-600 font-bold">
                        <a href="/gueto" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <KeyIcon className="w-4 h-4 text-[#15803D]" />
                            <span>Direct Landlord Contacts</span>
                        </a>
                        <a href="/kyc" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <ShieldCheckIcon className="w-4 h-4 text-[#15803D]" />
                            <span>Seller KYC Portal</span>
                        </a>
                        <a href="/safety" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <QuestionMarkCircleIcon className="w-4 h-4 text-[#15803D]" />
                            <span>Scam Prevention Guidelines</span>
                        </a>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                        <button
                            onClick={() => { setActivePillar('marketplace'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                                activePillar === 'marketplace' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Second-Hand Marketplace</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('gueto'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                                activePillar === 'gueto' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <HomeModernIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Shelter & Gueto Finder</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('urgent'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                                activePillar === 'urgent' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <TagIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Urgent Relocation Deals</span>
                        </button>

                        <a
                            href="/kyc"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <ShieldCheckIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Seller KYC ID Verification</span>
                        </a>

                        <div className="pt-2 border-t border-slate-200">
                            <a
                                href="/post"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#15803D] text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                            >
                                <span>+ Post Gueto or Item</span>
                                <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
