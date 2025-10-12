// ============================================
// components/Controls.tsx - FIXED LAYOUT & SPACING
// ============================================
'use client';

import { useState } from 'react';
import { Calendar, Download, Filter, User, RefreshCw } from 'lucide-react';
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
            {/* IMPROVED: Better spacing and layout */}
            <div className="sticky top-0 z-30 glass-card border-b shadow-lg">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">

                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Month Selector */}
                        <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-shadow">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                                className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm"
                            >
                                {months.map((month, idx) => (
                                    <option key={idx} value={idx}>
                                        {month} {selectedYear}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Week Filter */}
                        <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-shadow">
                            <Filter className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <select
                                value={selectedWeek === null ? 'all' : selectedWeek}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    onWeekChange(value === 'all' ? null : parseInt(value));
                                }}
                                className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm"
                            >
                                <option value="all">Semua Minggu</option>
                                {periods.map((period, idx) => (
                                    <option key={idx} value={idx}>
                                        {period.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* User Filter */}
                        <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-shadow">
                            <User className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <select
                                value={selectedUploader}
                                onChange={(e) => onUploaderChange(e.target.value)}
                                className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm"
                            >
                                <option value="all">Semua User</option>
                                {uploaders.map((uploader) => (
                                    <option key={uploader.id} value={uploader.id}>
                                        {uploader.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button */}
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={onReset}
                                className="glass-card rounded-xl px-4 py-2.5 hover:shadow-lg transition-all flex items-center gap-2 group bg-red-50 hover:bg-red-100"
                            >
                                <RefreshCw className="w-4 h-4 text-red-600 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-semibold text-red-600 text-sm">
                                    Reset ({activeFiltersCount})
                                </span>
                            </button>
                        )}

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Export Button */}
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="glass-button px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all group"
                        >
                            <Download className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-white">Export</span>
                        </button>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                        {/* Row 1: Month & Export */}
                        <div className="flex items-center gap-2">
                            {/* Month Selector */}
                            <div className="flex-1 flex items-center gap-2 glass-card rounded-xl px-3 py-2 shadow-md">
                                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => onMonthChange(parseInt(e.target.value))}
                                    className="bg-transparent border-none focus:outline-none font-semibold text-slate-700 cursor-pointer text-sm flex-1"
                                >
                                    {months.map((month, idx) => (
                                        <option key={idx} value={idx}>
                                            {month} {selectedYear}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="glass-card rounded-xl px-3 py-2 hover:shadow-lg transition-all relative"
                            >
                                <Filter className="w-4 h-4 text-purple-600" />
                                {activeFiltersCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </div>
                                )}
                            </button>

                            {/* Export Button */}
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="glass-button px-3 py-2 rounded-xl"
                            >
                                <Download className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Collapsible Filters */}
                        {showFilters && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                {/* Week Filter */}
                                <div className="glass-card rounded-xl px-3 py-2">
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
                                <div className="glass-card rounded-xl px-3 py-2">
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
                                        className="w-full glass-card rounded-xl px-3 py-2 hover:shadow-lg transition-all flex items-center justify-center gap-2 group bg-red-50 hover:bg-red-100"
                                    >
                                        <RefreshCw className="w-4 h-4 text-red-600 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="font-semibold text-red-600 text-sm">
                                            Reset Filter ({activeFiltersCount})
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <ExportModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    data={rawData}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
            )}
        </>
    );
}