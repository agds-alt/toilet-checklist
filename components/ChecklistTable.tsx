// components/ChecklistTable.tsx - ACCORDION VERSION
'use client';

import { useState } from 'react';
import { Camera, ChevronDown, ChevronRight, MapPin, CheckCircle2, BarChart3 } from 'lucide-react';
import { periods, locations, getDataKey, getCellColor } from '@/lib/utils';

interface ChecklistTableProps {
    data: any;
    selectedMonth: number;
    selectedWeek?: number | null;
    onCellClick: (location: string, day: number) => void;
}

export default function ChecklistTable({ data, selectedMonth, selectedWeek, onCellClick }: ChecklistTableProps) {
    const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]); // Default expand week 1

    const getCellValue = (location: string, day: number): number | null => {
        const key = getDataKey(location, selectedMonth, day);
        return data[key]?.score || null;
    };

    const hasPhoto = (location: string, day: number): boolean => {
        const key = getDataKey(location, selectedMonth, day);
        return !!data[key]?.photo;
    };

    const toggleWeek = (weekIndex: number) => {
        setExpandedWeeks(prev =>
            prev.includes(weekIndex)
                ? prev.filter(w => w !== weekIndex)
                : [...prev, weekIndex]
        );
    };

    const getWeekStats = (period: any) => {
        let total = 0;
        let filled = 0;
        let sumScore = 0;

        period.days.forEach((day: number) => {
            locations.forEach(location => {
                total++;
                const score = getCellValue(location, day);
                if (score) {
                    filled++;
                    sumScore += score;
                }
            });
        });

        const avgScore = filled > 0 ? Math.round(sumScore / filled) : 0;
        return { total, filled, avgScore };
    };

    const displayPeriods = selectedWeek !== null && selectedWeek !== undefined
        ? [periods[selectedWeek]]
        : periods;

    return (
        <div className="space-y-3">
            {displayPeriods.map((period, periodIdx) => {
                const stats = getWeekStats(period);
                const isExpanded = expandedWeeks.includes(periodIdx);

                return (
                    <div key={periodIdx} className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                        {/* Accordion Header */}
                        <div
                            onClick={() => toggleWeek(periodIdx)}
                            className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-3 cursor-pointer hover:from-slate-700 hover:via-blue-800 hover:to-slate-700 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="font-bold text-sm">{period.name}</span>
                                        </div>
                                        <div className="text-[10px] text-blue-200 mt-0.5">
                                            {period.days[0]} - {period.days[period.days.length - 1]}
                                            {' '}• Monitoring Period
                                        </div>
                                    </div>
                                </div>

                                {/* Week Stats */}
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                                            <span>{stats.filled}/{stats.total}</span>
                                        </div>
                                        <div className="text-[9px] text-blue-200">entries</div>
                                    </div>

                                    {stats.avgScore > 0 && (
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs font-semibold">
                                                <BarChart3 className="w-3.5 h-3.5 text-yellow-300" />
                                                <span>{stats.avgScore}</span>
                                            </div>
                                            <div className="text-[9px] text-blue-200">avg score</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Accordion Content */}
                        {isExpanded && (
                            <div className="bg-white p-3 animate-accordion-down">
                                {/* Days Header */}
                                <div className="grid gap-2 mb-2 pb-2 border-b" style={{ gridTemplateColumns: '140px repeat(7, 1fr)' }}>
                                    <div className="font-semibold text-[10px] text-slate-600">LOKASI</div>
                                    {period.days.map(day => (
                                        <div key={day} className="text-center">
                                            <div className="font-bold text-xs text-slate-800">{day}</div>
                                            <div className="text-[9px] text-slate-500 leading-tight">
                                                {new Date(2025, selectedMonth - 1, day).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Location Rows */}
                                <div className="space-y-1.5">
                                    {locations.map((location, locIdx) => (
                                        <div key={locIdx} className="grid gap-2 items-center group hover:bg-blue-50/50 p-1.5 rounded-lg transition-colors" style={{ gridTemplateColumns: '140px repeat(7, 1fr)' }}>
                                            {/* Location Name - FULL WIDTH */}
                                            <div className="flex items-center gap-1.5 pr-2">
                                                <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                <span className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-2">
                                                    {location}
                                                </span>
                                            </div>

                                            {/* Day Cells */}
                                            {period.days.map(day => {
                                                const score = getCellValue(location, day);
                                                const hasPhotoFlag = hasPhoto(location, day);

                                                return (
                                                    <div
                                                        key={day}
                                                        onClick={() => score && onCellClick(location, day)}
                                                        className={`
                                                            relative flex items-center justify-center h-12 rounded-lg
                                                            ${score ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                                                            ${getCellColor(score)}
                                                            transition-all
                                                        `}
                                                    >
                                                        {score ? (
                                                            <>
                                                                <span className="text-sm font-bold">{score}</span>
                                                                {hasPhotoFlag && (
                                                                    <div className="absolute top-0.5 right-0.5 bg-blue-600 p-0.5 rounded-md shadow-md">
                                                                        <Camera className="w-2.5 h-2.5 text-white" />
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-300 text-sm">—</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Legend */}
            {/* Legend */}
            <div className="glass-card rounded-xl p-2 shadow-lg"> {/* p-3 → p-2 */}
                <div className="flex items-center gap-1.5 mb-1.5"> {/* gap-2 → gap-1.5, mb-2 → mb-1.5 */}
                    <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div> {/* h-4 → h-3 */}
                    <h3 className="text-[10px] font-bold text-slate-800">Keterangan Skor</h3> {/* text-xs → text-[10px] */}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5"> {/* gap-2 → gap-1.5 */}
                    {[
                        { color: 'bg-blue-50 border-blue-300', label: '95-100', desc: 'Excellent', icon: '🌟' },
                        { color: 'bg-green-50 border-green-300', label: '85-94', desc: 'Good', icon: '✅' },
                        { color: 'bg-yellow-50 border-yellow-300', label: '75-84', desc: 'Fair', icon: '⚠️' },
                        { color: 'bg-red-50 border-red-300', label: '<75', desc: 'Poor', icon: '❌' },
                        { color: 'bg-slate-50 border-slate-300', label: 'Foto', desc: 'Tersedia', icon: '📷' }
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.color} border-2 rounded-lg p-1.5 text-center hover:scale-105 transition-transform`}> {/* p-2 → p-1.5 */}
                            <div className="text-sm mb-0.5">{item.icon}</div> {/* text-base → text-sm */}
                            <div className="font-bold text-slate-800 text-[9px]">{item.label}</div> {/* text-[10px] → text-[9px] */}
                            <div className="text-[8px] text-slate-600 font-medium">{item.desc}</div> {/* text-[9px] → text-[8px] */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}