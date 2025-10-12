// ============================================
// components/ChecklistTable.tsx - MOBILE-FIRST RESPONSIVE TABLE
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

    // Filter periods based on selectedWeek
    const displayPeriods = selectedWeek !== null && selectedWeek !== undefined
        ? [periods[selectedWeek]]
        : periods;

    return (
        <div className="space-y-6 md:space-y-8">
            {displayPeriods.map((period, periodIdx) => (
                <div key={periodIdx} className="glass-card rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow fade-in">
                    {/* Period Header */}
                    <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-4 md:p-5 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                        </div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="p-2 md:p-2.5 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <span className="font-bold text-base md:text-lg">{period.name}</span>
                                    <div className="text-[10px] md:text-xs text-blue-200 font-medium">
                                        Monitoring Period
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                                <span className="text-xs md:text-sm font-semibold">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Container - Horizontal scroll on mobile */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]"> {/* Minimum width to ensure proper display */}
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">
                                        <th className="px-4 md:px-6 py-3 md:py-5 text-left text-xs md:text-sm font-bold text-slate-800 min-w-[160px] md:min-w-[220px] sticky left-0 bg-slate-100/95 backdrop-blur-sm z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-0.5 md:w-1 h-4 md:h-6 bg-blue-600 rounded-full"></div>
                                                LOKASI
                                            </div>
                                        </th>
                                        {period.days.map(day => (
                                            <th key={day} className="px-2 md:px-4 py-3 md:py-5 text-center min-w-[60px] md:min-w-[80px]">
                                                <div className="font-bold text-slate-800 text-sm md:text-base">{day}</div>
                                                <div className="text-[10px] md:text-xs text-slate-500 font-medium">
                                                    {new Date(2025, selectedMonth, day).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((location, locIdx) => (
                                        <tr key={locIdx} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-slate-800 sticky left-0 bg-white/95 backdrop-blur-sm group-hover:bg-blue-50/95 transition-colors z-10">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
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
                                                        className={`px-2 md:px-4 py-3 md:py-4 text-center score-cell ${getCellColor(score)} cursor-pointer`}
                                                    >
                                                        <div className="relative flex flex-col items-center justify-center gap-0.5 md:gap-1 min-h-[50px] md:min-h-[60px]">
                                                            {score ? (
                                                                <>
                                                                    <span className="text-xl md:text-2xl font-bold">{score}</span>
                                                                    {hasPhotoFlag && (
                                                                        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 bg-blue-600 p-0.5 md:p-1 rounded-md shadow-lg">
                                                                            <Camera className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-slate-300 text-lg md:text-xl">—</span>
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
                    <div className="md:hidden bg-blue-50 border-t-2 border-blue-200 px-4 py-2 text-center">
                        <p className="text-xs text-blue-700 font-medium">
                            👆 Geser ke kanan untuk melihat lebih banyak data
                        </p>
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <div className="w-0.5 md:w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    <h3 className="text-base md:text-lg font-bold text-slate-800">Keterangan Skor</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                    {[
                        { color: 'bg-blue-50 border-blue-300', label: '95-100', desc: 'Excellent', icon: '🌟' },
                        { color: 'bg-green-50 border-green-300', label: '85-94', desc: 'Good', icon: '✅' },
                        { color: 'bg-yellow-50 border-yellow-300', label: '75-84', desc: 'Fair', icon: '⚠️' },
                        { color: 'bg-red-50 border-red-300', label: '<75', desc: 'Poor', icon: '❌' },
                        { color: 'bg-slate-50 border-slate-300', label: 'Foto', desc: 'Tersedia', icon: '📷', className: 'col-span-2 sm:col-span-1' }
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.color} border-2 rounded-xl md:rounded-2xl p-3 md:p-4 text-center hover:scale-105 transition-transform ${item.className || ''}`}>
                            <div className="text-2xl md:text-3xl mb-1 md:mb-2">{item.icon}</div>
                            <div className="font-bold text-slate-800 text-sm md:text-base">{item.label}</div>
                            <div className="text-xs text-slate-600 font-medium mt-0.5 md:mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}