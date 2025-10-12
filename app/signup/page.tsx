// 4. app/signup/page.tsx - SIGN UP PAGE
// ============================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'cleaner'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter!');
            return;
        }

        setLoading(true);

        try {
            await signUp(formData.email, formData.password, formData.fullName, formData.role);
            alert('✅ Akun berhasil dibuat! Silakan login.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Pendaftaran gagal. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl mb-4">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Daftar Akun Baru</h1>
                    <p className="text-blue-200">Proservice Indonesia</p>
                </div>

                <div className="glass-card rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="••••••••"
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
                                    Mendaftar...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Daftar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="text-sm text-slate-600">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
