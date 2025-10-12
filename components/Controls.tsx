// ============================================
// components/Controls.tsx - MOBILE-FIRST RESPONSIVE
// ============================================
'use client';

import { useState } from 'react';
import { Calendar, Download, Filter, User, RefreshCw, ChevronDown } from 'lucide-react';
import { months, periods } from '@/lib/utils';
import ExportModal from './ExportModal';
import { ChecklistData } from '@/lib/database/checklist';

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
    rawData: ChecklistData[];
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
    onReset,
    rawData
}: ControlsProps) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const activeFiltersCount = [
        selectedWeek !== null,
        selectedUploader !== 'all'
    ].filter(Boolean).length;

    return (
        <>
            <div className="sticky top-0 z-30 glass-card border-b shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
                    {/* Mobile: Stack vertically */}
                    <div className="space-y-3 md:space-y-0">
                        {/* Row 1: Month selector & Export button */}
                        <div className="flex items-center justify-between gap-2">
                            {/* Month Selector */}
                            <div className="flex items-center gap-2 glass-card rounded-xl px-3 sm:px-4 md:px-5 py-2 md:py-3 shadow-md hover:shadow-lg transition-shadow flex-1 min-w-0">
                                <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => onMonthChange(parseInt(e.target.value))}
                                    className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm md:text-base flex-1 min-w-0"
                                >
                                    {months.map((month, idx) => (
                                        <option key={idx} value={idx}>
                                            {month} {selectedYear}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile Filter Toggle + Export */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="md:hidden glass-card rounded-xl px-3 py-2 hover:shadow-lg transition-all flex items-center gap-1.5 relative"
                                >
                                    <Filter className="w-4 h-4 text-purple-600" />
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowExportModal(true)}
                                    className="glass-button px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-sm md:text-base"
                                >
                                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="font-bold hidden sm:inline">Export</span>
                                </button>
                            </div>
                        </div>

                        {/* Desktop: Show filters inline */}
                        <div className="hidden md:flex items-center gap-3 flex-wrap">
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

                        {/* Mobile: Collapsible filters */}
                        {showFilters && (
                            <div className="md:hidden space-y-2 animate-in slide-in-from-top-5">
                                {/* Week Filter */}
                                <div className="glass-card rounded-xl px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <select
                                            value={selectedWeek === null ? 'all' : selectedWeek}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                onWeekChange(value === 'all' ? null : parseInt(value));
                                            }}
                                            className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm flex-1"
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
                                <div className="glass-card rounded-xl px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <select
                                            value={selectedUploader}
                                            onChange={(e) => onUploaderChange(e.target.value)}
                                            className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm flex-1"
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

                                {/* Reset Button */}
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={() => {
                                            onReset();
                                            setShowFilters(false);
                                        }}
                                        className="w-full glass-card rounded-xl px-4 py-2.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 group bg-red-50 hover:bg-red-100"
                                    >
                                        <RefreshCw className="w-4 h-4 text-red-600 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="font-semibold text-red-600 text-sm">
                                            Reset Filter ({activeFiltersCount})
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Active Filters Badges */}
                        {activeFiltersCount > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-slate-600">Filter:</span>

                                {selectedWeek !== null && (
                                    <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                        📅 <span className="hidden sm:inline">{periods[selectedWeek].name}</span>
                                        <span className="sm:hidden">M{selectedWeek + 1}</span>
                                        <button
                                            onClick={() => onWeekChange(null)}
                                            className="hover:bg-purple-200 rounded-full p-0.5"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}

                                {selectedUploader !== 'all' && (
                                    <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1.5 max-w-[150px]">
                                        👤 <span className="truncate">{uploaders.find(u => u.id === selectedUploader)?.name || 'User'}</span>
                                        <button
                                            onClick={() => onUploaderChange('all')}
                                            className="hover:bg-green-200 rounded-full p-0.5 flex-shrink-0"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                data={rawData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
            />
        </>
    );
}