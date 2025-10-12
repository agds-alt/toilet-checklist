// ============================================
// components/Controls.tsx - REFINED CONTROLS
// ============================================
import { Calendar, Download, Filter } from 'lucide-react';
import { months } from '@/lib/utils';

interface ControlsProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
}

export default function Controls({ selectedMonth, selectedYear, onMonthChange }: ControlsProps) {
    return (
        <div className="sticky top-0 z-30 glass-card border-b shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Month Selector */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 glass-card rounded-xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                                className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer pr-8"
                            >
                                {months.map((month, idx) => (
                                    <option key={idx} value={idx}>{month} {selectedYear}</option>
                                ))}
                            </select>
                        </div>

                        <button className="glass-card rounded-xl px-5 py-3 hover:shadow-lg transition-all flex items-center gap-2 group">
                            <Filter className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                            <span className="font-semibold text-slate-700">Filter</span>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                            <Download className="w-4 h-4" />
                            <span className="font-bold">Export Excel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
