import React from 'react';
import { Home, ShoppingBag, ShieldCheck, MessageSquare, PlusCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
    onActionClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onActionClick }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isDwell = location.pathname.startsWith('/dwell');
    const isTrade = location.pathname.startsWith('/trade');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050B14]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <button
                    onClick={() => navigate('/dwell')}
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isDwell ? 'text-[#C0392B] scale-105' : 'text-white/50 hover:text-white'
                    }`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Dwell</span>
                </button>

                <button
                    onClick={() => navigate('/trade')}
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isTrade ? 'text-[#39FF14] scale-105' : 'text-white/50 hover:text-white'
                    }`}
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Trade</span>
                </button>

                <button
                    onClick={onActionClick}
                    className="flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform active:scale-95 -mt-5 border-2 border-[#050B14] bg-[#39FF14] text-[#050B14]"
                >
                    <PlusCircle className="w-6 h-6 stroke-[2.5]" />
                </button>

                <button
                    onClick={() => navigate('/messages')}
                    className={`flex flex-col items-center gap-1 transition-all ${
                        location.pathname === '/messages' ? 'text-white' : 'text-white/50 hover:text-white'
                    }`}
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Chat</span>
                </button>

                <button
                    onClick={() => navigate('/kyc')}
                    className={`flex flex-col items-center gap-1 transition-all ${
                        location.pathname === '/kyc' ? 'text-[#39FF14]' : 'text-white/50 hover:text-white'
                    }`}
                >
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">KYC</span>
                </button>
            </div>
        </nav>
    );
};
