import { Header } from '@/components/shared/Header';

export default function App() {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-slate-900 flex flex-col font-sans">
            <Header />
            <main className="flex-1 bg-[#FFFFFF]">
                {/* Screen cleared exclusively for header section design */}
            </main>
        </div>
    );
}
