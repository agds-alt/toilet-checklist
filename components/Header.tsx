// ============================================
// components/Header.tsx - MOBILE-FIRST RESPONSIVE HEADER
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
                <div className="absolute top-0 -left-4 w-48 h-48 md:w-72 md:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-48 h-48 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                <div className="absolute -bottom-8 left-20 w-48 h-48 md:w-72 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
                {/* Mobile: Stack vertically */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500 rounded-xl md:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-0.5 md:space-y-1 flex-1 sm:flex-none">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                                Proservice Indonesia
                            </h1>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-blue-200 text-xs md:text-sm font-medium">
                                    Sistem Monitoring Kebersihan • DKI Jakarta
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Action */}
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        {/* Score Card */}
                        <div className="glass-card rounded-xl md:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 pulse-glow flex-1 sm:flex-none">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-lg md:rounded-xl blur-md"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 md:p-3 rounded-lg md:rounded-xl">
                                        <TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                                        {averageScore}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-slate-600 font-semibold tracking-wide">
                                        RATA-RATA
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={onUploadClick}
                            className="group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 glass-button overflow-hidden flex-shrink-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
                            <div className="relative flex items-center gap-2 md:gap-3">
                                <Upload className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm md:text-base hidden sm:inline">Upload</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Stats Bar - Hide on very small screens */}
                <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="glass-card rounded-lg md:rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl sm:text-3xl font-bold text-slate-800">28</div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium">Total Lokasi</div>
                    </div>
                    <div className="glass-card rounded-lg md:rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600">95%</div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium">Compliance</div>
                    </div>
                    <div className="glass-card rounded-lg md:rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center hover:scale-105 transition-transform">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600">24/7</div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium">Monitoring</div>
                    </div>
                </div>
            </div>
        </header>
    );
}