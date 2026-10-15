import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { AboutView } from '@/views/AboutView';

export default function App() {
    const { pathname } = useLocation();

    // Start each page at the top when navigating.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="w-full min-h-screen bg-canvas text-slate-200 flex flex-col font-sans m-0 p-0">
            <Header />
            <main className="w-full flex-1 bg-canvas m-0 p-0 min-h-[40vh]">
                <Routes>
                    <Route path="/about" element={<AboutView />} />
                    <Route path="*" element={null} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
