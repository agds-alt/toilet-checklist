// ============================================
// 1. app/forgot-password/page.tsx - FIXED!
// ============================================
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Gagal mengirim email reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl mb-4">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Lupa Password?</h1>
                    <p className="text-blue-200">Kami akan kirim link reset ke email Anda</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-3xl p-8 shadow-2xl">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Email Terkirim!</h3>
                            <p className="text-slate-600">
                                Cek inbox email Anda dan klik link untuk reset password.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full glass-button py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            Kirim Link Reset
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
