import { Header } from '@/components/shared/Header';

export default function App() {
    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] text-slate-900 flex flex-col font-sans m-0 p-0">
            <Header />
            <main className="w-full flex-1 bg-[#FFFFFF] m-0 p-0">
                {/* Full screen edge-to-edge pure white canvas with no margin */}
            </main>
        </div>
    );
}
