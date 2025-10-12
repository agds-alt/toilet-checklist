// ============================================
// components/Controls.tsx - ENHANCED WITH FILTERS
// ============================================
import { Calendar, Download, Filter, User, RefreshCw } from 'lucide-react';
import { months, periods } from '@/lib/utils';

interface ControlsProps {
    selectedMonth: number;
    selectedYear: number;
    selectedWeek: number | null;
    selectedUploader: string;
    uploaders: Array<{ id: string; name: string }>;
    onMonthChange: (month: number) => void;
    onWeekChange: (week: number | null) => void;
    onUploaderChange: (uploaderId: string) => void;
    onReset: () => void;
}

export default function Controls({
    selectedMonth,
    selectedYear,
    selectedWeek,
    selectedUploader,
    uploaders,
    onMonthChange,
    onWeekChange,
    onUploaderChange,
    onReset
}: ControlsProps) {

    const activeFiltersCount = [
        selectedWeek !== null,
        selectedUploader !== 'all'
    ].filter(Boolean).length;

    return (
        <div className="sticky top-0 z-30 glass-card border-b shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">

                    {/* Left Section - Month & Week Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Month Selector */}
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
                                    <option key={idx} value={idx}>
                                        {month} {selectedYear}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Week Filter */}
                        <div className="glass-card rounded-xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-purple-600" />
                                <select
                                    value={selectedWeek === null ? 'all' : selectedWeek}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        onWeekChange(value === 'all' ? null : parseInt(value));
                                    }}
                                    className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer pr-8"
                                >
                                    <option value="all">Semua Minggu</option>
                                    {periods.map((period, idx) => (
                                        <option key={idx} value={idx}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* User Filter */}
                        <div className="glass-card rounded-xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-green-600" />
                                <select
                                    value={selectedUploader}
                                    onChange={(e) => onUploaderChange(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer pr-8"
                                >
                                    <option value="all">Semua User</option>
                                    {uploaders.map((uploader) => (
                                        <option key={uploader.id} value={uploader.id}>
                                            {uploader.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Reset Filter Button */}
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={onReset}
                                className="glass-card rounded-xl px-4 py-3 hover:shadow-lg transition-all flex items-center gap-2 group bg-red-50 hover:bg-red-100"
                            >
                                <RefreshCw className="w-4 h-4 text-red-600 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-semibold text-red-600 text-sm">
                                    Reset ({activeFiltersCount})
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex gap-3">
                        <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                            <Download className="w-4 h-4" />
                            <span className="font-bold">Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Active Filters Badge */}
                {activeFiltersCount > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-slate-600">Filter Aktif:</span>

                        {selectedWeek !== null && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-2">
                                📅 {periods[selectedWeek].name}
                                <button
                                    onClick={() => onWeekChange(null)}
                                    className="hover:bg-purple-200 rounded-full p-0.5"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {selectedUploader !== 'all' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-2">
                                👤 {uploaders.find(u => u.id === selectedUploader)?.name || 'User'}
                                <button
                                    onClick={() => onUploaderChange('all')}
                                    className="hover:bg-green-200 rounded-full p-0.5"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}