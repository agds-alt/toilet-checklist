// ============================================
// components/PhotoModal.tsx - COMPACT LAYOUT (NO SCROLL)
// ============================================
'use client';

import { useState } from 'react';
import { X, MapPin, Calendar, TrendingUp, CheckCircle2, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';

interface PhotoModalProps {
    data: {
        location: string;
        day: number;
        month: number;
        year: number;
        score: number;
        photo_url: string | null;
        created_at: string;
    };
    onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
    const [isMinimized, setIsMinimized] = useState(false);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300';
        if (score >= 85) return 'text-green-600 bg-gradient-to-br from-green-50 to-green-100 border-green-300';
        if (score >= 75) return 'text-yellow-600 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300';
        return 'text-red-600 bg-gradient-to-br from-red-50 to-red-100 border-red-300';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 95) return 'Excellent';
        if (score >= 85) return 'Good';
        if (score >= 75) return 'Fair';
        return 'Poor';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 95) return { color: 'bg-blue-600', icon: '🌟' };
        if (score >= 85) return { color: 'bg-green-600', icon: '✅' };
        if (score >= 75) return { color: 'bg-yellow-600', icon: '⚠️' };
        return { color: 'bg-red-600', icon: '❌' };
    };

    return (
        <>
            {/* Backdrop - Only show when maximized */}
            {!isMinimized && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-300"
                    onClick={onClose}
                    style={{
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                />
            )}

            {/* Modal Container */}
            <div className={`fixed z-50 pointer-events-none transition-all duration-500 ${isMinimized
                    ? 'bottom-4 right-4 left-auto top-auto'
                    : 'inset-0 flex items-center justify-center p-4'
                }`}>
                <div
                    className={`pointer-events-auto transition-all duration-500 ease-out ${isMinimized
                            ? 'w-96'
                            : 'w-full max-w-6xl'
                        }`}
                    style={{
                        animation: isMinimized ? 'slideInRight 0.4s ease-out' : 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    {/* Glass Card with 3D Effect */}
                    <div className={`
                        relative overflow-hidden rounded-3xl
                        bg-white/90 backdrop-blur-xl
                        shadow-2xl
                        border border-white/20
                        transition-all duration-500
                        ${isMinimized ? 'hover:shadow-blue-500/50 hover:scale-105 animate-pulse-glow' : ''}
                    `}
                        style={{
                            boxShadow: isMinimized
                                ? undefined // Let animation handle it
                                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            transform: isMinimized ? 'translateY(0)' : 'translateY(0) perspective(1000px) rotateX(0deg)',
                        }}>
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient-shift" />
                        </div>

                        {/* Header - Different for Minimized */}
                        {isMinimized ? (
                            /* MINIMIZED VIEW - Compact Card with Photo */
                            <div
                                className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white cursor-pointer hover:from-slate-700 hover:via-blue-800 hover:to-slate-700 transition-all duration-300"
                                onClick={() => setIsMinimized(false)}
                            >
                                {/* 3D Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer" />
                                </div>

                                <div className="relative flex items-center gap-3 p-3">
                                    {/* Photo Thumbnail */}
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0 group ring-2 ring-white/30">
                                        {data.photo_url ? (
                                            <>
                                                <img
                                                    src={data.photo_url}
                                                    alt={data.location}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                {/* Score Badge on Photo */}
                                                <div className={`absolute bottom-1 left-1 px-2 py-0.5 rounded-md text-xs font-bold ${getScoreBadge(data.score).color} shadow-lg`}>
                                                    {data.score}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                                <AlertCircle className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base truncate">{data.location}</h3>
                                        <div className="flex items-center gap-2 text-xs text-blue-200 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {data.day} {months[data.month].substring(0, 3)}
                                            </span>
                                            <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                {getScoreBadge(data.score).icon}
                                                {getScoreLabel(data.score)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-blue-300 mt-1 opacity-75">Click to expand</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMinimized(false);
                                            }}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                                            title="Maximize"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClose();
                                            }}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95"
                                            title="Close"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* MAXIMIZED VIEW - Full Header */
                            <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white px-6 py-3.5">
                                {/* 3D Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer" />
                                </div>

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{data.location}</h2>
                                            <div className="flex items-center gap-3 text-sm text-blue-200 mt-1">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {data.day} {months[data.month]} {data.year}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    Score: {data.score}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Minimize/Maximize Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMinimized(!isMinimized);
                                            }}
                                            className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                                            title={isMinimized ? "Maximize" : "Minimize"}
                                        >
                                            {isMinimized ? (
                                                <Maximize2 className="w-5 h-5" />
                                            ) : (
                                                <Minimize2 className="w-5 h-5" />
                                            )}
                                        </button>

                                        {/* Close Button */}
                                        <button
                                            onClick={onClose}
                                            className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95"
                                            title="Close"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content - Horizontal Layout (Only show when maximized) */}
                        {!isMinimized && (
                            <div className="transition-all duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                    {/* LEFT: Photo Section */}
                                    <div className="p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
                                        {data.photo_url ? (
                                            <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-[400px]">
                                                <img
                                                    src={data.photo_url}
                                                    alt={`Foto ${data.location}`}
                                                    className="w-full h-full object-cover bg-slate-900 transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Fallback */}
                                                <div className="hidden w-full h-full bg-slate-200 flex items-center justify-center">
                                                    <div className="text-center text-slate-500">
                                                        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                                                        <p className="font-semibold">Foto tidak dapat dimuat</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 h-[400px]">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="text-center text-slate-500">
                                                        <AlertCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                        <p className="font-semibold text-xl">Tidak Ada Foto</p>
                                                        <p className="text-sm mt-2 opacity-75">Data ini belum memiliki foto dokumentasi</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT: Details Section */}
                                    <div className="p-4 space-y-3 bg-white/50 flex flex-col justify-between">
                                        {/* Score Card with 3D Effect */}
                                        <div className={`
                                        relative overflow-hidden rounded-2xl p-4 border-2
                                        ${getScoreColor(data.score)}
                                        shadow-lg hover:shadow-xl
                                        transition-all duration-300 hover:scale-[1.02]
                                        cursor-default
                                    `}
                                            style={{
                                                transform: 'perspective(1000px) rotateX(0deg)',
                                            }}>
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shine" />

                                            <div className="relative flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold opacity-75 mb-1 tracking-wider">SKOR KEBERSIHAN</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-black">{data.score}</span>
                                                        <span className="text-xl font-bold opacity-75">/ 100</span>
                                                    </div>
                                                    <p className="mt-2 font-bold text-lg flex items-center gap-2">
                                                        <span>{getScoreBadge(data.score).icon}</span>
                                                        {getScoreLabel(data.score)}
                                                    </p>
                                                </div>
                                                <div className={`
                                                p-4 rounded-2xl ${getScoreBadge(data.score).color} text-white
                                                shadow-xl
                                                transition-transform duration-300 hover:scale-110 hover:rotate-12
                                            `}>
                                                    {data.score >= 75 ? (
                                                        <CheckCircle2 className="w-12 h-12" />
                                                    ) : (
                                                        <AlertCircle className="w-12 h-12" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Cards Grid */}
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <MapPin className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600">Lokasi</span>
                                                </div>
                                                <p className="text-base font-semibold text-slate-800">{data.location}</p>
                                            </div>

                                            <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600">Tanggal</span>
                                                </div>
                                                <p className="text-base font-semibold text-slate-800">
                                                    {data.day} {months[data.month]} {data.year}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={onClose}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @keyframes shimmer {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }

                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    }
                    50% {
                        box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
                    }
                }

                .animate-shimmer {
                    animation: shimmer 3s linear infinite;
                    background-size: 200% 100%;
                }

                .animate-gradient-shift {
                    animation: gradient-shift 8s ease infinite;
                    background-size: 200% 200%;
                }

                .animate-shine {
                    animation: shine 2s ease-in-out infinite;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}