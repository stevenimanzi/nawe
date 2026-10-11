import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    ShieldCheckIcon,
    HeartIcon,
    ShoppingBagIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    SparklesIcon,
    HomeModernIcon,
    WrenchScrewdriverIcon,
    BuildingStorefrontIcon,
    PhoneIcon,
    ArrowRightIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import {
    ShieldCheckIcon as ShieldCheckSolid,
    FireIcon as FireSolid,
} from '@heroicons/react/24/solid';

export const Header: React.FC = () => {
    const [activePillar, setActivePillar] = useState<'housing' | 'trade' | 'tvet'>('housing');
    const [searchCategory, setSearchCategory] = useState('All Categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount] = useState(2);
    const [wishlistCount] = useState(4);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
            <div className="bg-[#15803D] text-white text-[12px] py-2 px-4 sm:px-8 border-b border-emerald-800/20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-100 font-semibold text-[11px] border border-emerald-600/30">
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
                            RP Musanze College
                        </span>
                        <span className="hidden md:inline text-emerald-100/80 font-medium">
                            Rwanda's Premier Campus Housing & TVET Trade Network
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-emerald-100 text-[11px]">
                        <div className="hidden sm:flex items-center gap-1.5">
                            <ShieldCheckSolid className="w-4 h-4 text-emerald-300" />
                            <span className="font-semibold text-white">100% KYC Verified Sellers</span>
                        </div>
                        <span className="hidden sm:inline text-emerald-600">|</span>
                        <a
                            href="tel:+250788000000"
                            className="flex items-center gap-1 hover:text-white transition-colors font-medium"
                        >
                            <PhoneIcon className="w-3.5 h-3.5" />
                            <span>Campus Helpline: +250 788 111 222</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
                    <a href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#15803D] via-[#16A34A] to-emerald-400 flex items-center justify-center text-white font-black text-2xl tracking-tighter shadow-lg shadow-emerald-700/25 group-hover:scale-105 transition-all">
                                N
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                <CheckBadgeIcon className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                                    NAWE
                                </span>
                                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200">
                                    v1.0
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 tracking-wide mt-0.5">
                                Campus Ecosystem
                            </span>
                        </div>
                    </a>

                    <div className="hidden lg:flex flex-1 max-w-2xl items-center">
                        <div className="relative w-full flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-[#15803D] transition-all">
                            <div className="relative">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="appearance-none bg-transparent pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Hostels">Gueto & Hostels</option>
                                    <option value="TVET">TVET Tools</option>
                                    <option value="Tech">Laptops & Tech</option>
                                    <option value="Essentials">Hostel Supplies</option>
                                </select>
                                <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="h-5 w-px bg-slate-200 mx-1" />

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search hostels near gate, TVET workshop gear, calculators..."
                                    className="w-full bg-transparent pl-3 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                                    <MapPinIcon className="w-3 h-3 text-[#15803D]" />
                                    <span>Musanze</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                                <MagnifyingGlassIcon className="w-4 h-4 stroke-[2.5]" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                            aria-label="Wishlist"
                        >
                            <HeartIcon className="w-5 h-5 stroke-[1.8]" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#15803D] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                            aria-label="Cart"
                        >
                            <ShoppingBagIcon className="w-5 h-5 stroke-[1.8]" />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#15803D] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                        <div className="hidden sm:flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#15803D] font-black text-xs flex items-center justify-center border border-emerald-200">
                                    SI
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#15803D] border-2 border-white rounded-full" />
                            </div>
                            <div className="hidden xl:flex flex-col text-left">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#15803D] transition-colors leading-tight">
                                        Steven Imanzi
                                    </span>
                                    <ShieldCheckSolid className="w-3.5 h-3.5 text-[#15803D]" />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 leading-tight">
                                    RP Student • Verified
                                </span>
                            </div>
                        </div>

                        <a
                            href="/trade"
                            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold tracking-wide shadow-md shadow-emerald-700/25 transition-all active:scale-[0.98]"
                        >
                            <span>Explore Store</span>
                            <ArrowRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                        </a>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActivePillar('housing')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activePillar === 'housing'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <HomeModernIcon className="w-4 h-4" />
                            <span>Dwell Housing (Gueto)</span>
                        </button>

                        <button
                            onClick={() => setActivePillar('trade')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activePillar === 'trade'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            <span>Trade Marketplace</span>
                        </button>

                        <button
                            onClick={() => setActivePillar('tvet')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activePillar === 'tvet'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <WrenchScrewdriverIcon className="w-4 h-4" />
                            <span>TVET Engineering Tools</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#15803D] text-[9px] font-extrabold uppercase">
                                Popular
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-600 font-semibold">
                        <a href="/dwell" className="hover:text-[#15803D] transition-colors flex items-center gap-1">
                            <FireSolid className="w-3.5 h-3.5 text-amber-500" />
                            <span>Trending Hostels</span>
                        </a>
                        <a href="/kyc" className="hover:text-[#15803D] transition-colors flex items-center gap-1">
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#15803D]" />
                            <span>ID Card KYC Portal</span>
                        </a>
                        <a href="/support" className="hover:text-[#15803D] transition-colors">
                            Musanze Safety Guide
                        </a>
                    </div>
                </div>

                <div className="pb-3 lg:hidden">
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search hostels, tools, gear..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803D]"
                        />
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-slate-200 flex flex-col gap-2">
                        <button
                            onClick={() => { setActivePillar('housing'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'housing' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <HomeModernIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Dwell Housing (Gueto Discovery)</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('trade'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'trade' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Trade Marketplace</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('tvet'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'tvet' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <WrenchScrewdriverIcon className="w-5 h-5 text-[#15803D]" />
                            <span>TVET Engineering Tools</span>
                        </button>

                        <a
                            href="/kyc"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <ShieldCheckIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Seller KYC ID Verification</span>
                        </a>

                        <div className="pt-2 border-t border-slate-200">
                            <a
                                href="/trade"
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#15803D] text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                            >
                                <span>Explore Campus Store</span>
                                <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
