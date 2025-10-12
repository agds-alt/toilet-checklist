// ============================================
// components/ExportModal.tsx - EXPORT MODAL (FIXED + MOBILE RESPONSIVE)
// ============================================
'use client';

import { useState } from 'react';
import { X, FileSpreadsheet, FileText, Download, Loader2 } from 'lucide-react';
import { ChecklistData } from '@/lib/database/checklist';
import { exportToExcel, exportToPDF } from '@/lib/export/export-utils';
import { months } from '@/lib/utils';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ChecklistData[];
    selectedMonth: number;
    selectedYear: number;
}

export default function ExportModal({
    isOpen,
    onClose,
    data = [], // ← FIX: Default empty array
    selectedMonth,
    selectedYear
}: ExportModalProps) {
    const [loading, setLoading] = useState(false);
    const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);

    if (!isOpen) return null;

    const handleExport = async (type: 'excel' | 'pdf') => {
        if (!data || data.length === 0) {
            alert('⚠️ Tidak ada data untuk di-export!');
            return;
        }

        setLoading(true);
        setExportType(type);

        try {
            if (type === 'excel') {
                await exportToExcel(data, selectedMonth, selectedYear);
            } else {
                await exportToPDF(data, selectedMonth, selectedYear);
            }

            // Success notification
            setTimeout(() => {
                alert('✅ File berhasil di-download!');
                onClose();
            }, 500);
        } catch (error: any) {
            alert(`❌ ${error.message}`);
        } finally {
            setLoading(false);
            setExportType(null);
        }
    };

    const recordCount = data?.length || 0;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-50 fade-in">
            <div className="glass-card rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-4 md:p-6">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                    </div>
                    <div className="relative flex justify-between items-start">
                        <div className="space-y-1 md:space-y-2 flex-1 pr-4">
                            <h3 className="text-xl md:text-2xl font-bold">📊 Export Data</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm text-blue-200">
                                <span>Periode: {months[selectedMonth]} {selectedYear}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{recordCount} records</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-2 md:p-3 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300 disabled:opacity-50 flex-shrink-0"
                        >
                            <X className="w-5 h-5 md:w-7 md:h-7" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8">
                    <div className="space-y-4">
                        {/* Info Card */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
                            <p className="text-xs md:text-sm text-blue-800 font-medium">
                                ℹ️ File akan berisi: Lokasi, Tanggal, Nilai, Link Foto, Status Approval, Timestamp
                            </p>
                        </div>

                        {/* Export Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {/* Excel Export */}
                            <button
                                onClick={() => handleExport('excel')}
                                disabled={loading}
                                className={`group relative overflow-hidden rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all ${loading && exportType === 'excel'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-green-200 hover:border-green-500 hover:bg-green-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        {loading && exportType === 'excel' ? (
                                            <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
                                        ) : (
                                            <FileSpreadsheet className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        )}
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-1 md:mb-2">
                                        Export Excel
                                    </h4>
                                    <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                                        Format .xlsx dengan 2 sheet: Data & Summary
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-green-700 font-semibold text-xs md:text-sm">
                                        <Download className="w-3 h-3 md:w-4 md:h-4" />
                                        <span>Download XLSX</span>
                                    </div>
                                </div>
                                {loading && exportType === 'excel' && (
                                    <div className="absolute inset-0 bg-green-100/50 shimmer"></div>
                                )}
                            </button>

                            {/* PDF Export */}
                            <button
                                onClick={() => handleExport('pdf')}
                                disabled={loading}
                                className={`group relative overflow-hidden rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all ${loading && exportType === 'pdf'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-red-200 hover:border-red-500 hover:bg-red-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        {loading && exportType === 'pdf' ? (
                                            <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
                                        ) : (
                                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        )}
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-1 md:mb-2">
                                        Export PDF
                                    </h4>
                                    <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                                        Format .pdf dengan tabel dan statistik
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-xs md:text-sm">
                                        <Download className="w-3 h-3 md:w-4 md:h-4" />
                                        <span>Download PDF</span>
                                    </div>
                                </div>
                                {loading && exportType === 'pdf' && (
                                    <div className="absolute inset-0 bg-red-100/50 shimmer"></div>
                                )}
                            </button>
                        </div>

                        {/* Stats Preview */}
                        {recordCount > 0 && (
                            <div className="glass-card rounded-xl p-3 md:p-4 mt-4 md:mt-6">
                                <h5 className="font-bold text-slate-800 mb-2 md:mb-3 text-sm md:text-base">📈 Preview Data</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-center">
                                    <div className="bg-blue-50 rounded-lg p-2 md:p-3">
                                        <div className="text-xl md:text-2xl font-bold text-blue-700">
                                            {data.filter(d => d.score >= 95).length}
                                        </div>
                                        <div className="text-xs text-blue-600">Excellent</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-2 md:p-3">
                                        <div className="text-xl md:text-2xl font-bold text-green-700">
                                            {data.filter(d => d.score >= 85 && d.score < 95).length}
                                        </div>
                                        <div className="text-xs text-green-600">Good</div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-2 md:p-3">
                                        <div className="text-xl md:text-2xl font-bold text-yellow-700">
                                            {data.filter(d => d.score >= 75 && d.score < 85).length}
                                        </div>
                                        <div className="text-xs text-yellow-600">Fair</div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-2 md:p-3">
                                        <div className="text-xl md:text-2xl font-bold text-red-700">
                                            {data.filter(d => d.score < 75).length}
                                        </div>
                                        <div className="text-xs text-red-600">Poor</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}