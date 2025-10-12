// ============================================
// components/Header.tsx - MODERN PROFESSIONAL HEADER
// ============================================
import { TrendingUp, Upload, Sparkles } from 'lucide-react';

interface HeaderProps {
    averageScore: number;
    onUploadClick: () => void;
}

export default function Header({ averageScore, onUploadClick }: HeaderProps) {
    return (
        <header className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                                Proservice Indonesia
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-blue-200 text-sm font-medium">
                                    Sistem Monitoring Kebersihan Toilet • DKI Jakarta
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Action */}
                    <div className="flex items-center gap-4">
                        {/* Score Card */}
                        <div className="glass-card rounded-2xl px-8 py-5 pulse-glow">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                                        <TrendingUp className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                                        {averageScore}
                                    </div>
                                    <div className="text-xs text-slate-600 font-semibold tracking-wide">
                                        RATA-RATA SKOR
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={onUploadClick}
                            className="group relative px-8 py-4 glass-button overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
                            <div className="relative flex items-center gap-3">
                                <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold">Upload Foto</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="glass-card rounded-xl px-6 py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-slate-800">28</div>
                        <div className="text-sm text-slate-600 font-medium">Total Lokasi</div>
                    </div>
                    <div className="glass-card rounded-xl px-6 py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-green-600">95%</div>
                        <div className="text-sm text-slate-600 font-medium">Compliance Rate</div>
                    </div>
                    <div className="glass-card rounded-xl px-6 py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-blue-600">24/7</div>
                        <div className="text-sm text-slate-600 font-medium">Monitoring</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
