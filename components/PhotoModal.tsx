// ============================================
// components/PhotoModal.tsx - FIXED EMPTY SRC ERROR
// ============================================
'use client';

import { X, MapPin, Calendar, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

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
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'text-blue-600 bg-blue-50';
        if (score >= 85) return 'text-green-600 bg-green-50';
        if (score >= 75) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 95) return 'Excellent';
        if (score >= 85) return 'Good';
        if (score >= 75) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                    </div>

                    <div className="relative flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <MapPin className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">{data.location}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-blue-200">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {data.day} {months[data.month]} {data.year}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <TrendingUp className="w-4 h-4" />
                                    Score: {data.score}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Photo */}
                    <div className="p-6 bg-slate-50">
                        {data.photo_url ? (
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={data.photo_url}
                                    alt={`Foto ${data.location}`}
                                    className="w-full h-[500px] object-contain bg-slate-900"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                {/* Fallback placeholder (hidden by default) */}
                                <div className="hidden w-full h-[500px] bg-slate-200 flex items-center justify-center">
                                    <div className="text-center text-slate-500">
                                        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                                        <p className="font-semibold">Foto tidak dapat dimuat</p>
                                        <p className="text-sm mt-1">URL: {data.photo_url}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200">
                                <div className="w-full h-[500px] flex items-center justify-center">
                                    <div className="text-center text-slate-500">
                                        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                                        <p className="font-semibold text-lg">Tidak Ada Foto</p>
                                        <p className="text-sm mt-2">Data ini belum memiliki foto dokumentasi</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                        {/* Score Card */}
                        <div className={`rounded-2xl p-6 ${getScoreColor(data.score)} border-2 ${data.score >= 95 ? 'border-blue-300' :
                                data.score >= 85 ? 'border-green-300' :
                                    data.score >= 75 ? 'border-yellow-300' : 'border-red-300'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold opacity-75 mb-1">SKOR KEBERSIHAN</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold">{data.score}</span>
                                        <span className="text-lg font-bold opacity-75">/ 100</span>
                                    </div>
                                    <p className="mt-2 font-semibold text-lg">{getScoreLabel(data.score)}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${data.score >= 95 ? 'bg-blue-600' :
                                        data.score >= 85 ? 'bg-green-600' :
                                            data.score >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                                    } text-white`}>
                                    {data.score >= 75 ? (
                                        <CheckCircle2 className="w-12 h-12" />
                                    ) : (
                                        <AlertCircle className="w-12 h-12" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-600">Lokasi</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-800">{data.location}</p>
                            </div>

                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-600">Tanggal</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-800">
                                    {data.day} {months[data.month]} {data.year}
                                </p>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="glass-card rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📅</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-600">Waktu Upload</p>
                                    <p className="text-sm text-slate-700 mt-0.5">
                                        {new Date(data.created_at).toLocaleString('id-ID', {
                                            dateStyle: 'full',
                                            timeStyle: 'medium'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}