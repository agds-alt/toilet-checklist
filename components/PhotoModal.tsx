// ============================================
// components/PhotoModal.tsx - FIXED VERSION
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
    };
    onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
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

            {/* Modal Container - FIXED: Reduced size from max-w-6xl to max-w-3xl */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Compact */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">{data.location}</h2>
                                    <div className="flex items-center gap-3 text-xs text-blue-200">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {data.day} {months[data.month]} {data.year}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Score: {data.score}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* FIXED: Close Button with proper handler */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content - Single Column Layout */}
                    <div className="p-4 space-y-4">
                        {/* Photo Section */}
                        <div className="relative">
                            {data.photo_url ? (
                                <div className="relative group">
                                    <div
                                        className={`relative rounded-xl overflow-hidden shadow-lg ${
                                            imageZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                        }`}
                                        onClick={() => setImageZoom(!imageZoom)}
                                    >
                                        <img
                                            src={data.photo_url}
                                            alt={`Foto ${data.location}`}
                                            className={`w-full bg-slate-900 transition-all duration-300 ${
                                                imageZoom ? 'scale-150 object-contain h-[600px]' : 'object-cover h-[350px]'
                                            }`}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        {/* Fallback */}
                                        <div className="hidden w-full h-[350px] bg-slate-200 flex items-center justify-center">
                                            <div className="text-center text-slate-500">
                                                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm font-medium">Foto tidak dapat dimuat</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Zoom Hint */}
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                                        {imageZoom ? (
                                            <>
                                                <ZoomOut className="w-3 h-3" />
                                                <span>Click to zoom out</span>
                                            </>
                                        ) : (
                                            <>
                                                <ZoomIn className="w-3 h-3" />
                                                <span>Click to zoom</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[350px] bg-slate-100 rounded-xl flex items-center justify-center">
                                    <div className="text-center text-slate-400">
                                        <AlertCircle className="w-16 h-16 mx-auto mb-3" />
                                        <p className="font-semibold">Tidak ada foto</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Score Card */}
                            <div className={`${getScoreColor(data.score)} border-2 rounded-xl p-4`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`${getScoreBadge(data.score).color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl`}>
                                        {getScoreBadge(data.score).icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold opacity-70">Skor Kebersihan</p>
                                        <p className="text-2xl font-bold">{data.score}/100</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold opacity-80">{getScoreLabel(data.score)}</div>
                            </div>

                            {/* Date Card */}
                            <div className="border-2 border-slate-200 bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-slate-600" />
                                    <span className="text-xs font-semibold text-slate-600">Tanggal</span>
                                </div>
                                <p className="text-base font-semibold text-slate-800">
                                    {data.day} {months[data.month]} {data.year}
                                </p>
                            </div>
                        </div>

                        {/* Close Button - Mobile Friendly */}
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}