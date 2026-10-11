import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function App() {
    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] text-slate-900 flex flex-col font-sans m-0 p-0">
            <Header />
            <main className="w-full flex-1 bg-[#FFFFFF] m-0 p-0 min-h-[40vh]">
                {/* Page content renders here */}
            </main>
            <Footer />
        </div>
    );
}
