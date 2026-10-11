import React, { useState } from 'react';
import { useKycStatus } from '@/hooks/useAuth';
import api from '@/services/api';
import { ShieldCheck, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const KycView: React.FC = () => {
    const { data: kyc, refetch } = useKycStatus();

    const [documentType, setDocumentType] = useState('national_id');
    const [idNumber, setIdNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idFront) {
            setMessage('Please upload the front scan of your ID card.');
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('document_type', documentType);
            formData.append('id_number', idNumber);
            formData.append('full_name', fullName);
            if (dateOfBirth) formData.append('date_of_birth', dateOfBirth);
            formData.append('id_front_image', idFront);
            if (idBack) formData.append('id_back_image', idBack);

            await api.post('/v1/kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('KYC documents submitted successfully! Awaiting admin review.');
            refetch();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setMessage(error.response?.data?.message ?? 'Failed to submit KYC documents.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050B14] pb-24 text-white">
            <section className="px-4 py-6 max-w-xl mx-auto">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        Trust & Identity Verification
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Seller KYC Verification
                    </h1>
                    <p className="text-xs sm:text-sm text-white/60">
                        Upload your National ID or Student ID card to unlock marketplace selling privileges.
                    </p>
                </div>

                {kyc?.status === 'approved' ? (
                    <div className="mt-8 p-6 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-2xl flex items-start gap-4">
                        <CheckCircle className="w-7 h-7 text-[#39FF14] shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-base font-bold text-white">KYC Verified Seller</h3>
                            <p className="text-xs text-white/70 mt-1">
                                Your ID credentials ({kyc.id_number}) have been officially verified. You are authorized to list products on the NAWE campus marketplace.
                            </p>
                        </div>
                    </div>
                ) : kyc?.status === 'pending' ? (
                    <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-4">
                        <Clock className="w-7 h-7 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-base font-bold text-white">Under Review</h3>
                            <p className="text-xs text-white/70 mt-1">
                                Your ID documents ({kyc.id_number}) were submitted on {new Date(kyc.submitted_at ?? '').toLocaleDateString()}. The campus compliance team is reviewing your verification.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                        {message && (
                            <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span>{message}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                Document Type
                            </label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#39FF14]"
                            >
                                <option value="national_id" className="bg-[#050B14]">Rwandan National ID</option>
                                <option value="student_id" className="bg-[#050B14]">RP Musanze Student ID</option>
                                <option value="passport" className="bg-[#050B14]">Passport</option>
                                <option value="driving_license" className="bg-[#050B14]">Driving License</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                Full Name (as shown on ID)
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Steven Imanzi"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#39FF14]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                ID Card Number
                            </label>
                            <input
                                type="text"
                                required
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder="e.g. 1 2001 8 0054321 0 45"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#39FF14]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#39FF14]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div>
                                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                    ID Front Scan *
                                </label>
                                <label className="flex flex-col items-center justify-center h-28 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#39FF14] bg-white/[0.02] p-2 text-center">
                                    <Upload className="w-5 h-5 text-[#39FF14] mb-1" />
                                    <span className="text-[11px] text-white/70">
                                        {idFront ? idFront.name : 'Select ID Front'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setIdFront(e.target.files?.[0] ?? null)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                                    ID Back Scan (Optional)
                                </label>
                                <label className="flex flex-col items-center justify-center h-28 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#39FF14] bg-white/[0.02] p-2 text-center">
                                    <Upload className="w-5 h-5 text-white/40 mb-1" />
                                    <span className="text-[11px] text-white/70">
                                        {idBack ? idBack.name : 'Select ID Back'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setIdBack(e.target.files?.[0] ?? null)}
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full py-2.5 rounded-xl bg-[#39FF14] text-[#050B14] font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#2ecc71] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Uploading Documents...' : 'Submit ID for Verification'}
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
};
