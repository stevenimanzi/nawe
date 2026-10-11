import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShieldCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isDwell = location.pathname.startsWith('/dwell');
    const isTrade = location.pathname.startsWith('/trade');

    return (
        <header className="sticky top-0 z-40 bg-[#050B14]/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-widest text-white">NAWE</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                        RP Musanze
                    </span>
                </div>

                <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
                    <button
                        onClick={() => navigate('/dwell')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isDwell
                                ? 'bg-[#8B1A1A] text-white shadow-md'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Dwell</span>
                    </button>
                    <button
                        onClick={() => navigate('/trade')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isTrade
                                ? 'bg-[#39FF14] text-[#050B14] shadow-md font-bold'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Trade</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate('/kyc')}
                    className="flex items-center gap-1 text-xs text-[#39FF14] hover:opacity-80 transition-opacity"
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline font-mono text-[11px]">ID Verified</span>
                </button>
            </div>
        </header>
    );
};
