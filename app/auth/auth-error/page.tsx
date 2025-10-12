// ============================================
// app/auth/auth-error/page.tsx
// ============================================
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Verifikasi Gagal
                </h1>

                <p className="text-slate-600 mb-6">
                    Link verifikasi tidak valid atau sudah kadaluarsa.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/signup"
                        className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        Daftar Ulang
                    </Link>

                    <Link
                        href="/login"
                        className="block w-full py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
}