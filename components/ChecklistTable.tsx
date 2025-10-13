// ============================================
// components/ChecklistTable.tsx - IMPROVED TEXT SIZES
// ============================================
'use client';

import { Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { periods, locations, getDataKey, getCellColor } from '@/lib/utils';

interface ChecklistTableProps {
    data: any;
    selectedMonth: number;
    selectedWeek?: number | null;
    onCellClick: (location: string, day: number) => void;
}

export default function ChecklistTable({ data, selectedMonth, selectedWeek, onCellClick }: ChecklistTableProps) {
    const getCellValue = (location: string, day: number): number | null => {
        const key = getDataKey(location, selectedMonth, day);
        return data[key]?.score || null;
    };

    const hasPhoto = (location: string, day: number): boolean => {
        const key = getDataKey(location, selectedMonth, day);
        return !!data[key]?.photo;
    };

    const displayPeriods = selectedWeek !== null && selectedWeek !== undefined
        ? [periods[selectedWeek]]
        : periods;

    return (
        <div className="space-y-4">
            {displayPeriods.map((period, periodIdx) => (
                <div key={periodIdx} className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {/* Header - IMPROVED: Bigger Active text */}
                    <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-sm">{period.name}</span>
                                    <div className="text-[10px] text-blue-200">Monitoring Period</div>
                                </div>
                            </div>
                            {/* IMPROVED: text-xs -> text-sm */}
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                                <span className="text-sm font-semibold">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">
                                        {/* IMPROVED: text-xs -> text-sm for header */}
                                        <th className="px-3 py-2 text-left text-sm font-bold text-slate-800 min-w-[140px] sticky left-0 bg-slate-100/95 backdrop-blur-sm z-10">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-0.5 h-4 bg-blue-600 rounded-full"></div>
                                                LOKASI
                                            </div>
                                        </th>
                                        {period.days.map(day => (
                                            <th key={day} className="px-2 py-2 text-center min-w-[50px]">
                                                {/* IMPROVED: text-xs -> text-sm */}
                                                <div className="font-bold text-slate-800 text-sm">{day}</div>
                                                <div className="text-[10px] text-slate-500 font-medium">
                                                    {new Date(2025, selectedMonth, day).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((location, locIdx) => (
                                        <tr key={locIdx} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group">
                                            {/* IMPROVED: text-xs -> text-sm for location name */}
                                            <td className="px-3 py-2 text-sm font-semibold text-slate-800 sticky left-0 bg-white/95 backdrop-blur-sm group-hover:bg-blue-50/95 transition-colors z-10">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                    <span className="leading-tight">{location}</span>
                                                </div>
                                            </td>
                                            {period.days.map(day => {
                                                const score = getCellValue(location, day);
                                                const hasPhotoFlag = hasPhoto(location, day);

                                                return (
                                                    <td
                                                        key={day}
                                                        onClick={() => onCellClick(location, day)}
                                                        className={`px-1 py-2 text-center score-cell ${getCellColor(score)} cursor-pointer hover:scale-105 transition-transform`}
                                                    >
                                                        <div className="relative flex flex-col items-center justify-center min-h-[44px]">
                                                            {score ? (
                                                                <>
                                                                    {/* IMPROVED: text-base -> text-lg */}
                                                                    <span className="text-lg font-bold">{score}</span>
                                                                    {hasPhotoFlag && (
                                                                        /* IMPROVED: w-2 h-2 -> w-3 h-3, better positioning */
                                                                        <div className="absolute top-0.5 right-0.5 bg-blue-600 p-0.5 rounded-md shadow-md">
                                                                            <Camera className="w-3 h-3 text-white" />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-slate-300 text-lg">—</span>
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

                    {/* Mobile Scroll Hint */}
                    <div className="md:hidden bg-blue-50 border-t border-blue-200 px-3 py-1.5 text-center">
                        <p className="text-xs text-blue-700 font-medium">
                            👆 Geser ke kanan untuk melihat lebih banyak data
                        </p>
                    </div>
                </div>
            ))}

            {/* Legend - IMPROVED: Better text sizes */}
            <div className="glass-card rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-0.5 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-800">Keterangan Skor</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {[
                        { color: 'bg-blue-50 border-blue-300', label: '95-100', desc: 'Excellent', icon: '🌟' },
                        { color: 'bg-green-50 border-green-300', label: '85-94', desc: 'Good', icon: '✅' },
                        { color: 'bg-yellow-50 border-yellow-300', label: '75-84', desc: 'Fair', icon: '⚠️' },
                        { color: 'bg-red-50 border-red-300', label: '<75', desc: 'Poor', icon: '❌' },
                        { color: 'bg-slate-50 border-slate-300', label: 'Foto', desc: 'Tersedia', icon: '📷' }
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.color} border-2 rounded-lg p-2.5 text-center hover:scale-105 transition-transform`}>
                            <div className="text-xl mb-1">{item.icon}</div>
                            <div className="font-bold text-slate-800 text-xs">{item.label}</div>
                            <div className="text-[10px] text-slate-600 font-medium">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}