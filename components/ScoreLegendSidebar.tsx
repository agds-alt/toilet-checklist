// ============================================
// components/ScoreLegendSidebar.tsx
// ============================================
'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function ScoreLegendSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const legendItems = [
        { color: 'bg-blue-50 border-blue-300 text-blue-700', label: '95-100', desc: 'Excellent', icon: '🌟' },
        { color: 'bg-green-50 border-green-300 text-green-700', label: '85-94', desc: 'Good', icon: '✅' },
        { color: 'bg-yellow-50 border-yellow-300 text-yellow-700', label: '75-84', desc: 'Fair', icon: '⚠️' },
        { color: 'bg-red-50 border-red-300 text-red-700', label: '<75', desc: 'Poor', icon: '❌' },
        { color: 'bg-slate-50 border-slate-300 text-slate-700', label: 'Foto', desc: 'Tersedia', icon: '📷' }
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${isOpen ? 'right-[320px]' : 'right-0'
                    } bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-l-2xl shadow-2xl`}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <Info className="w-5 h-5" />
                            <span className="text-xs font-bold">Info</span>
                            <ChevronLeft className="w-5 h-5" />
                        </>
                    )}
                </div>
            </button>

            <aside className={`fixed right-0 top-0 h-screen bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-30 transition-all duration-500 ${isOpen ? 'w-80 translate-x-0' : 'w-80 translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Keterangan Skor</h2>
                                    <p className="text-xs text-blue-200 mt-1">Panduan penilaian</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {legendItems.map((item, idx) => (
                            <div key={idx} className={`${item.color} border-2 rounded-2xl p-5 hover:scale-105 transition-all`}>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{item.icon}</div>
                                    <div>
                                        <div className="font-bold text-lg">{item.label}</div>
                                        <div className="text-sm font-semibold opacity-80">{item.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div className="fixed inset-0 bg-black/20 z-20" onClick={() => setIsOpen(false)} />
            )}
        </>
    );
}