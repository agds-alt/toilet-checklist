// ============================================
// components/Header.tsx - SIMPLIFIED WITHOUT UPLOAD BUTTON
// ============================================
import { TrendingUp } from 'lucide-react';

interface HeaderProps {
    selectedMonth: number;
    selectedYear: number;
    data: any;
}

export default function Header({ selectedMonth, selectedYear, data }: HeaderProps) {
    // Calculate average score
    const scores = Object.values(data)
        .map((item: any) => item?.score)
        .filter((score): score is number => typeof score === 'number');

    const averageScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <header className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-48 h-48 md:w-72 md:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-48 h-48 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                <div className="absolute -bottom-8 left-20 w-48 h-48 md:w-72 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Logo & Title */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-lg"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                                <img
                                    src="/logo-prenacons.png"
                                    alt="Prenacons Logo"
                                    className="w-10 h-9"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                                Proservice Indonesia
                            </h1>
                            <p className="text-xs md:text-sm text-blue-200 flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Sistem Monitoring Kebersihan • DKI Jakarta
                            </p>
                        </div>
                    </div>

                    {/* Average Score Badge */}
                    <div className="glass-card rounded-xl px-4 md:px-6 py-3 md:py-4 pulse-glow">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-md"></div>
                                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                                    {averageScore}
                                </div>
                                <div className="text-[10px] text-slate-600 font-semibold tracking-wide">
                                    RATA-RATA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="glass-card rounded-xl px-4 py-3 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl md:text-3xl font-bold text-slate-800">8</div>
                        <div className="text-xs text-slate-600 font-medium">Titik Lokasi Toilet</div>
                    </div>
                    <div className="glass-card rounded-xl px-4 py-3 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl md:text-3xl font-bold text-green-600">
                            {scores.length > 0 ? Math.round((scores.filter(s => s >= 75).length / scores.length) * 100) : 0}%
                        </div>
                        <div className="text-xs text-slate-600 font-medium">Compliance</div>
                    </div>
                    <div className="glass-card rounded-xl px-4 py-3 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl md:text-3xl font-bold text-blue-600">24/7</div>
                        <div className="text-xs text-slate-600 font-medium">Monitoring</div>
                    </div>
                </div>
            </div>
        </header>
    );
}