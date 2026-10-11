import { Routes, Route, Navigate } from 'react-router-dom';
import { TopBar } from '@/components/shared/TopBar';
import { BottomNav } from '@/components/shared/BottomNav';
import { DwellView } from '@/views/DwellView';
import { TradeView } from '@/views/TradeView';
import { KycView } from '@/views/KycView';

export default function App() {
    return (
        <div className="min-h-screen bg-[#050B14] text-white flex flex-col font-sans selection:bg-[#39FF14] selection:text-[#050B14]">
            <TopBar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Navigate to="/dwell" replace />} />
                    <Route path="/dwell" element={<DwellView />} />
                    <Route path="/trade" element={<TradeView />} />
                    <Route path="/kyc" element={<KycView />} />
                    <Route path="/messages" element={<div className="p-8 text-center text-white/50 text-xs font-mono">Chat channels active between verified peers</div>} />
                    <Route path="*" element={<Navigate to="/dwell" replace />} />
                </Routes>
            </main>
            <BottomNav onActionClick={() => window.location.href = '/trade'} />
        </div>
    );
}
