// ============================================
// components/PhotoModal.tsx - MOBILE COMPACT
// ============================================
'use client';

import { useState } from 'react';
import { X, MapPin, Calendar, TrendingUp, AlertCircle, ZoomIn, ZoomOut } from 'lucide-react';

interface PhotoModalProps {
    data: {
        location: string;
        day: number;
        month: number;
        year: number;
        score: number;
        photo_url: string | null;
        created_at: string;
    } | null;
    onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
    // ✅ Silent return kalau data null
    if (!data) {
        return null;
    }

    const [imageZoom, setImageZoom] = useState(false);

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
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container - MOBILE OPTIMIZED */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4">
                <div
                    className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-[92%] sm:w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - COMPACT MOBILE */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm sm:text-lg font-bold leading-tight">{data.location}</h2>
                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-blue-200 mt-0.5">
                                        <span className="flex items-center gap-0.5 sm:gap-1">
                                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            {data.day} {months[data.month]} {data.year}
                                        </span>
                                        <span className="flex items-center gap-0.5 sm:gap-1">
                                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            Score: {data.score}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content - COMPACT SPACING */}
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {/* Photo Section - COMPACT HEIGHT MOBILE */}
                        <div className="relative">
                            {data.photo_url ? (
                                <div className="relative group">
                                    <div
                                        className={`relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg ${imageZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                            }`}
                                        onClick={() => setImageZoom(!imageZoom)}
                                    >
                                        <img
                                            src={data.photo_url}
                                            alt={`Foto ${data.location}`}
                                            className={`w-full bg-slate-900 transition-all duration-500 ease-in-out ${imageZoom
                                                    ? 'scale-150 object-contain h-[400px] sm:h-[600px]'
                                                    : 'object-cover h-[240px] sm:h-[350px]'
                                                }`}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fallback) fallback.classList.remove('hidden');
                                            }}
                                        />
                                        {/* Fallback */}
                                        <div className="hidden w-full h-[240px] sm:h-[350px] bg-slate-200 flex items-center justify-center">
                                            <div className="text-center text-slate-500">
                                                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                                                <p className="text-xs sm:text-sm font-medium">Foto tidak dapat dimuat</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Zoom Hint */}
                                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black/60 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[10px] sm:text-xs flex items-center gap-1 transition-all duration-300">
                                        {imageZoom ? (
                                            <>
                                                <ZoomOut className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300" />
                                                <span className="hidden sm:inline">Click to zoom out</span>
                                                <span className="sm:hidden">Zoom out</span>
                                            </>
                                        ) : (
                                            <>
                                                <ZoomIn className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300" />
                                                <span className="hidden sm:inline">Click to zoom</span>
                                                <span className="sm:hidden">Zoom</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[240px] sm:h-[350px] bg-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <div className="text-center text-slate-400">
                                        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3" />
                                        <p className="text-sm sm:text-base font-semibold">Tidak ada foto</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Cards - COMPACT MOBILE */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {/* Score Card */}
                            <div className={`${getScoreColor(data.score)} border-2 rounded-lg sm:rounded-xl p-3 sm:p-4`}>
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <div className={`${getScoreBadge(data.score).color} w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl`}>
                                        {getScoreBadge(data.score).icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-semibold opacity-70">Skor Kebersihan</p>
                                        <p className="text-xl sm:text-2xl font-bold leading-tight">{data.score}/100</p>
                                    </div>
                                </div>
                                <div className="text-[10px] sm:text-xs font-bold opacity-80">{getScoreLabel(data.score)}</div>
                            </div>

                            {/* Date Card */}
                            <div className="border-2 border-slate-200 bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Tanggal</span>
                                </div>
                                <p className="text-sm sm:text-base font-semibold text-slate-800">
                                    {data.day} {months[data.month]} {data.year}
                                </p>
                            </div>
                        </div>

                        {/* Close Button - COMPACT */}
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-lg transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}