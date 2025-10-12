// ============================================
// 1. components/PhotoModal.tsx - FIXED SIZE
// ============================================
'use client';

import { X, Calendar, TrendingUp, Download } from 'lucide-react';

interface PhotoModalProps {
    data: any;
    onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 fade-in">
            <div className="glass-card rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-6">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                    </div>
                    <div className="relative flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">📸 Bukti Kebersihan</h3>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-green-300" />
                                    <span className="font-bold text-xl">Skor: {data.score}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(data.timestamp).toLocaleString('id-ID', {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
                        >
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                {/* Image - FIXED SIZE */}
                <div className="p-6 bg-slate-50">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={data.photo || ''}
                            alt="Foto toilet"
                            className="w-full h-[500px] object-contain bg-slate-900"  // ← TAMBAH max height
                            style={{ maxHeight: '500px' }}  // ← TAMBAH inline style
                        />
                    </div>

                    {/* Download Button */}
                    <div className="mt-4 flex justify-end">
                        <a
                            href={data.photo}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download Foto
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
