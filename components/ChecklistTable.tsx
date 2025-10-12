// ============================================
// components/ChecklistTable.tsx - ELEGANT TABLE
// ============================================
'use client';

import { Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { periods, locations, getDataKey, getCellColor } from '@/lib/utils';

interface ChecklistTableProps {
    data: any;
    selectedMonth: number;
    onCellClick: (location: string, day: number) => void;
}

export default function ChecklistTable({ data, selectedMonth, onCellClick }: ChecklistTableProps) {
    const getCellValue = (location: string, day: number): number | null => {
        const key = getDataKey(location, selectedMonth, day);
        return data[key]?.score || null;
    };

    const hasPhoto = (location: string, day: number): boolean => {
        const key = getDataKey(location, selectedMonth, day);
        return !!data[key]?.photo;
    };

    return (
        <div className="space-y-8">
            {periods.map((period, periodIdx) => (
                <div key={periodIdx} className="glass-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow fade-in">
                    {/* Period Header */}
                    <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-5 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                        </div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="font-bold text-lg">{period.name}</span>
                                    <div className="text-xs text-blue-200 font-medium">
                                        Monitoring Period
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-green-300" />
                                <span className="text-sm font-semibold">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">
                                    <th className="px-6 py-5 text-left text-sm font-bold text-slate-800 min-w-[220px] sticky left-0 bg-slate-100/95 backdrop-blur-sm z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                            LOKASI
                                        </div>
                                    </th>
                                    {period.days.map(day => (
                                        <th key={day} className="px-4 py-5 text-center min-w-[80px]">
                                            <div className="font-bold text-slate-800 text-base">{day}</div>
                                            <div className="text-xs text-slate-500 font-medium">
                                                {new Date(2025, selectedMonth, day).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((location, locIdx) => (
                                    <tr key={locIdx} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800 sticky left-0 bg-white/95 backdrop-blur-sm group-hover:bg-blue-50/95 transition-colors z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                {location}
                                            </div>
                                        </td>
                                        {period.days.map(day => {
                                            const score = getCellValue(location, day);
                                            const hasPhotoFlag = hasPhoto(location, day);

                                            return (
                                                <td
                                                    key={day}
                                                    onClick={() => onCellClick(location, day)}
                                                    className={`px-4 py-4 text-center score-cell ${getCellColor(score)}`}
                                                >
                                                    <div className="relative flex flex-col items-center justify-center gap-1 min-h-[60px]">
                                                        {score ? (
                                                            <>
                                                                <span className="text-2xl font-bold">{score}</span>
                                                                {hasPhotoFlag && (
                                                                    <div className="absolute top-1 right-1 bg-blue-600 p-1 rounded-md shadow-lg">
                                                                        <Camera className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-300 text-xl">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div className="glass-card rounded-3xl p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800">Keterangan Skor</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { color: 'bg-blue-50 border-blue-300', label: '95-100', desc: 'Excellent', icon: '🌟' },
                        { color: 'bg-green-50 border-green-300', label: '85-94', desc: 'Good', icon: '✅' },
                        { color: 'bg-yellow-50 border-yellow-300', label: '75-84', desc: 'Fair', icon: '⚠️' },
                        { color: 'bg-red-50 border-red-300', label: '<75', desc: 'Poor', icon: '❌' },
                        { color: 'bg-slate-50 border-slate-300', label: 'Foto', desc: 'Tersedia', icon: '📷' }
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.color} border-2 rounded-2xl p-4 text-center hover:scale-105 transition-transform`}>
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <div className="font-bold text-slate-800">{item.label}</div>
                            <div className="text-xs text-slate-600 font-medium mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
