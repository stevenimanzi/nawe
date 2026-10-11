import React, { useState } from 'react';
import {
    Search,
    MapPin,
    ShieldCheck,
    Bell,
    ChevronDown,
    Plus,
    Menu,
    X,
    Building2,
    ShoppingBag,
    Compass,
    Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dwell' | 'trade' | 'explore'>('dwell');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsCount] = useState(2);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
            <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 hidden sm:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                            <Sparkles className="w-3 h-3" />
                            Official Campus Utility
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">Rwanda Polytechnic — Musanze College Hub</span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="font-semibold">KYC Verification Gate Active</span>
                        </div>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                            Emergency Support: +250 788 000 000
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 gap-4 lg:gap-8">
                    <div className="flex items-center gap-8">
                        <a href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                                N
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                                    NAWE
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">
                                    Campus Network
                                </span>
                            </div>
                        </a>

                        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                            <button
                                onClick={() => setActiveTab('dwell')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'dwell'
                                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Dwell (Housing)</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('trade')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'trade'
                                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Trade (Marketplace)</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('explore')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    activeTab === 'explore'
                                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Campus Map</span>
                            </button>
                        </nav>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md items-center">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search hostels, rooms, TVET tools, engineering books..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono font-medium text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Musanze</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <button
                            type="button"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/25 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Post Listing</span>
                        </button>

                        <button
                            type="button"
                            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            {notificationsCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                            )}
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                                    SI
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                            </div>

                            <div className="hidden xl:flex flex-col text-left">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                    Steven Imanzi
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700 leading-tight">
                                    RP Student • Verified
                                </span>
                            </div>

                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden xl:block" />
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="pb-3 md:hidden">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search hostels, TVET tools, gear..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden py-3 border-t border-slate-200 flex flex-col gap-2">
                        <button
                            onClick={() => { setActiveTab('dwell'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                                activeTab === 'dwell' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                            }`}
                        >
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span>Dwell — Campus Housing</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('trade'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                                activeTab === 'trade' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4 text-emerald-600" />
                            <span>Trade — Student Marketplace</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                                activeTab === 'explore' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                            }`}
                        >
                            <Compass className="w-4 h-4 text-emerald-600" />
                            <span>RP Musanze Map</span>
                        </button>

                        <div className="pt-2 border-t border-slate-200">
                            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Post a Listing or Item</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
