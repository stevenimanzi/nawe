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
    CheckBadgeIcon,
    SparklesIcon,
    TagIcon,
    KeyIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import {
    ShieldCheckIcon as ShieldCheckSolid,
} from '@heroicons/react/24/solid';

export const Header: React.FC = () => {
    const [activePillar, setActivePillar] = useState<'marketplace' | 'gueto' | 'deals'>('marketplace');
    const [searchCategory, setSearchCategory] = useState('All Categories');
    const [selectedLocation, setSelectedLocation] = useState('All Rwanda');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount] = useState(3);
    const [wishlistCount] = useState(5);

    return (
        <header className="w-full bg-[#FFFFFF] border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] m-0 p-0">
            <div className="w-full bg-[#15803D] text-white text-[13px] py-2.5 px-4 sm:px-8 border-b border-emerald-900/30">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-100 font-bold text-[12px] border border-emerald-600/40">
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
                            Verified National Platform
                        </span>
                        <span className="hidden md:inline text-emerald-100/90 font-medium">
                            Rwanda's Trusted Second-Hand Marketplace & Shelter / Gueto Finding Platform
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-emerald-100 text-[12px]">
                        <div className="hidden sm:flex items-center gap-1.5">
                            <ShieldCheckSolid className="w-4 h-4 text-emerald-300" />
                            <span className="font-bold text-white">100% ID Verified (KYC) Sellers & Landlords</span>
                        </div>
                        <span className="hidden sm:inline text-emerald-600">|</span>
                        <a
                            href="tel:+250788000000"
                            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
                        >
                            <PhoneIcon className="w-3.5 h-3.5" />
                            <span>Customer Support: +250 788 123 456</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-10">
                <div className="w-full flex items-center justify-between h-22 gap-4 lg:gap-8">
                    <a href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14532D] via-[#15803D] to-emerald-500 flex items-center justify-center text-white font-black text-2xl tracking-tighter shadow-lg shadow-emerald-700/25 group-hover:scale-105 transition-all">
                                N
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-none">
                                    NAWE
                                </span>
                                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200">
                                    MARKET
                                </span>
                            </div>
                            <span className="text-[12px] font-semibold text-slate-500 tracking-wide mt-1">
                                Second-Hand Goods & Gueto Finding
                            </span>
                        </div>
                    </a>

                    <div className="hidden lg:flex flex-1 max-w-4xl items-center">
                        <div className="relative w-full flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-inner focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-[#15803D] transition-all">
                            <div className="relative">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="appearance-none bg-transparent pl-3 pr-8 py-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Shelter">Shelter & Gueto</option>
                                    <option value="Electronics">Used Electronics & Phones</option>
                                    <option value="Appliances">Home & Room Appliances</option>
                                    <option value="Vehicles">Motos & Bicycles</option>
                                    <option value="Tools">Workshop & Hardware Tools</option>
                                    <option value="Furniture">Used Beds, Desks & Furniture</option>
                                </select>
                                <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-1.5" />

                            <div className="relative">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="appearance-none bg-transparent pl-3 pr-8 py-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    <option value="All Rwanda">📍 All Rwanda</option>
                                    <option value="Kigali">📍 Kigali City</option>
                                    <option value="Musanze">📍 Musanze</option>
                                    <option value="Huye">📍 Huye</option>
                                    <option value="Rubavu">📍 Rubavu</option>
                                    <option value="Muhanga">📍 Muhanga</option>
                                    <option value="Rwamagana">📍 Rwamagana</option>
                                </select>
                                <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-1.5" />

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search 1-room gueto, used smartphones, gas cylinders, laptops, beds..."
                                    className="w-full bg-transparent pl-3 pr-4 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                />
                            </div>

                            <button
                                type="button"
                                className="px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-[13px] font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0"
                            >
                                <MagnifyingGlassIcon className="w-4 h-4 stroke-[2.5]" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                            aria-label="Wishlist"
                        >
                            <HeartIcon className="w-6 h-6 stroke-[1.8]" />
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
                            <ShoppingBagIcon className="w-6 h-6 stroke-[1.8]" />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#15803D] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-7 w-px bg-slate-200 hidden sm:block" />

                        <div className="hidden sm:flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803D] font-black text-sm flex items-center justify-center border border-emerald-200">
                                    SI
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#15803D] border-2 border-white rounded-full" />
                            </div>
                            <div className="hidden xl:flex flex-col text-left">
                                <div className="flex items-center gap-1">
                                    <span className="text-[13px] font-bold text-slate-900 group-hover:text-[#15803D] transition-colors leading-tight">
                                        Steven Imanzi
                                    </span>
                                    <ShieldCheckSolid className="w-3.5 h-3.5 text-[#15803D]" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                                    Verified Member • KYC Approved
                                </span>
                            </div>
                        </div>

                        <a
                            href="/post"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-[13px] font-extrabold tracking-wide shadow-md shadow-emerald-700/25 transition-all active:scale-[0.98] shrink-0"
                        >
                            <span>+ Post Gueto or Item</span>
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

                <div className="hidden lg:flex items-center justify-between py-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActivePillar('marketplace')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                                activePillar === 'marketplace'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            <span>Second-Hand Marketplace</span>
                        </button>

                        <button
                            onClick={() => setActivePillar('gueto')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                                activePillar === 'gueto'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <HomeModernIcon className="w-4 h-4" />
                            <span>Shelter & Gueto Finder</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803D] text-[10px] font-extrabold uppercase">
                                Hot
                            </span>
                        </button>

                        <button
                            onClick={() => setActivePillar('deals')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                                activePillar === 'deals'
                                    ? 'bg-[#15803D] text-white shadow-sm shadow-emerald-700/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <TagIcon className="w-4 h-4" />
                            <span>Urgent Relocation Deals</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-7 text-[13px] text-slate-600 font-semibold">
                        <a href="/gueto" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <KeyIcon className="w-4 h-4 text-emerald-600" />
                            <span>Direct Landlord Contacts</span>
                        </a>
                        <a href="/kyc" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <ShieldCheckIcon className="w-4 h-4 text-[#15803D]" />
                            <span>Seller KYC Verification Portal</span>
                        </a>
                        <a href="/safety" className="hover:text-[#15803D] transition-colors flex items-center gap-1.5">
                            <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                            <span>Scam Protection Guidelines</span>
                        </a>
                    </div>
                </div>

                <div className="pb-3.5 lg:hidden">
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search gueto rooms, second-hand goods, electronics..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803D]"
                        />
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-slate-200 flex flex-col gap-2.5">
                        <button
                            onClick={() => { setActivePillar('marketplace'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'marketplace' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <BuildingStorefrontIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Second-Hand Marketplace</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('gueto'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'gueto' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <HomeModernIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Shelter & Gueto Finder</span>
                        </button>

                        <button
                            onClick={() => { setActivePillar('deals'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                                activePillar === 'deals' ? 'bg-emerald-50 text-[#15803D]' : 'text-slate-700'
                            }`}
                        >
                            <TagIcon className="w-5 h-5 text-[#15803D]" />
                            <span>Urgent Relocation Deals</span>
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
                                href="/post"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#15803D] text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                            >
                                <span>+ Post Gueto or Second-Hand Item</span>
                                <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
