'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFraudDetectionReport, getStatisticsWithGPS } from '@/lib/database/checklist';

interface FraudEntry {
    id: string;
    location: string;
    uploaded_by: string;
    photo_timestamp: string;
    created_at: string;
    latitude: number;
    longitude: number;
    gps_address: string;
    is_gps_valid: boolean;
    fraud_flag: string;
}

export default function FraudDetectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fraudEntries, setFraudEntries] = useState<FraudEntry[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [selectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fraudData, statsData] = await Promise.all([
                getFraudDetectionReport(),
                getStatisticsWithGPS(selectedMonth, selectedYear),
            ]);

            setFraudEntries(fraudData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading fraud detection data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFlagColor = (flag: string) => {
        if (flag === 'OK') return 'bg-green-100 text-green-800 border-green-200';
        if (flag.includes('GPS tidak valid')) return 'bg-red-100 text-red-800 border-red-200';
        if (flag.includes('Timestamp mismatch')) return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    const getFlagIcon = (flag: string) => {
        if (flag === 'OK') return <CheckCircle className="w-5 h-5" />;
        return <AlertTriangle className="w-5 h-5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-16 h-16 animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold text-lg">Loading fraud detection data...</p>
                </div>
            </div>
        );
    }

    const validRate = stats && stats.total > 0 ? ((stats.validGPS / stats.total) * 100).toFixed(1) : 0;
    const invalidRate = stats && stats.total > 0 ? ((stats.invalidGPS / stats.total) * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
            {/* Header */}
            <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <AlertTriangle className="w-7 h-7 text-red-600" />
                                    Fraud Detection System
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Monitoring suspicious uploads dan GPS validation
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-slate-600">Total Uploads</h3>
                            </div>
                            <p className="text-4xl font-bold text-slate-800">{stats.total}</p>
                            <p className="text-xs text-slate-500 mt-2">This month</p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-2xl shadow-lg border-2 border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-green-700">Valid GPS</h3>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-4xl font-bold text-green-800">{stats.validGPS}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-3 h-3 text-green-600" />
                                <p className="text-xs text-green-600 font-semibold">
                                    {validRate}% dari total
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-2xl shadow-lg border-2 border-red-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-red-700">Invalid GPS</h3>
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-4xl font-bold text-red-800">{stats.invalidGPS}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingDown className="w-3 h-3 text-red-600" />
                                <p className="text-xs text-red-600 font-semibold">
                                    {invalidRate}% suspicious
                                </p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-orange-700">No GPS</h3>
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-4xl font-bold text-orange-800">{stats.noGPS}</p>
                            <p className="text-xs text-orange-600 mt-2 font-semibold">
                                GPS unavailable
                            </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-blue-700">Avg Score</h3>
                            </div>
                            <p className="text-4xl font-bold text-blue-800">
                                {stats.avgScore.toFixed(0)}
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                                Out of 100
                            </p>
                        </div>
                    </div>
                )}

                {/* Alert if high fraud rate */}
                {stats && stats.total > 0 && ((stats.invalidGPS / stats.total) > 0.15) && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-red-800 mb-2">
                                    ⚠️ High Fraud Rate Detected
                                </h3>
                                <p className="text-red-700">
                                    Lebih dari 15% uploads memiliki GPS tidak valid. Harap review data dengan teliti dan lakukan investigasi lebih lanjut.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fraud Detection Table */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6" />
                                <div>
                                    <h2 className="text-xl font-bold">Suspicious Uploads Report</h2>
                                    <p className="text-sm text-red-100 mt-1">
                                        List dari uploads yang memiliki flag fraud
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {fraudEntries.length === 0 ? (
                        <div className="p-16 text-center">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-green-800 mb-3">
                                No Suspicious Activity Detected
                            </h3>
                            <p className="text-slate-600 text-lg">
                                Semua uploads terverifikasi dengan baik ✓
                            </p>
                            <p className="text-slate-500 text-sm mt-2">
                                System monitoring: Active
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b-2 border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Upload Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Photo Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            GPS Info
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Fraud Flag
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {fraudEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getFlagColor(entry.fraud_flag)}`}>
                                                    {getFlagIcon(entry.fraud_flag)}
                                                    <span className="text-xs font-bold">
                                                        {entry.is_gps_valid ? 'Valid' : 'Invalid'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-800 text-base">{entry.location}</p>
                                                <p className="text-xs text-slate-500 mt-1">{entry.uploaded_by}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">{new Date(entry.created_at).toLocaleDateString('id-ID')}</p>
                                                        <p className="text-xs text-slate-500">{new Date(entry.created_at).toLocaleTimeString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Clock className="w-4 h-4 text-purple-600" />
                                                    <div>
                                                        {entry.photo_timestamp ? (
                                                            <>
                                                                <p className="font-medium">{new Date(entry.photo_timestamp).toLocaleDateString('id-ID')}</p>
                                                                <p className="text-xs text-slate-500">{new Date(entry.photo_timestamp).toLocaleTimeString('id-ID')}</p>
                                                            </>
                                                        ) : (
                                                            <p className="text-xs text-slate-400">N/A</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {entry.latitude && entry.longitude ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin className="w-4 h-4 text-blue-600" />
                                                            <p className="font-mono text-xs text-slate-700">
                                                                {entry.latitude.toFixed(6)}°, {entry.longitude.toFixed(6)}°
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-slate-500 line-clamp-2">
                                                            {entry.gps_address}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                window.open(
                                                                    `https://www.google.com/maps?q=${entry.latitude},${entry.longitude}`,
                                                                    '_blank'
                                                                );
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                                                        >
                                                            View on map →
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">GPS unavailable</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-block px-4 py-2 rounded-xl text-xs font-bold ${getFlagColor(entry.fraud_flag)}`}>
                                                    {entry.fraud_flag}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Action Recommendations */}
                {fraudEntries.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Recommended Actions
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                <p className="text-blue-900">
                                    <strong>Review Invalid GPS Uploads:</strong> Hubungi user yang upload dengan GPS tidak valid untuk konfirmasi lokasi sebenarnya.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                <p className="text-blue-900">
                                    <strong>Check Timestamp Mismatch:</strong> Foto dengan selisih waktu &gt;5 menit mungkin foto lama yang diupload ulang.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                                <p className="text-blue-900">
                                    <strong>Update GPS Coordinates:</strong> Pastikan koordinat GPS di EXPECTED_LOCATIONS sudah benar untuk setiap toilet.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                                <p className="text-blue-900">
                                    <strong>Export Report:</strong> Download fraud report untuk dokumentasi dan investigasi lebih lanjut.
                                </p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}