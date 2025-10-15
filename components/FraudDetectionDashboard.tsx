'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
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

export default function FraudDetectionDashboard() {
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
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-slate-600">Total Uploads</h3>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl shadow-lg border-2 border-green-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-green-700">Valid GPS</h3>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-800">{stats.validGPS}</p>
                        <p className="text-xs text-green-600 mt-1">
                            {stats.total > 0 ? ((stats.validGPS / stats.total) * 100).toFixed(0) : 0}% dari total
                        </p>
                    </div>

                    <div className="bg-red-50 p-6 rounded-2xl shadow-lg border-2 border-red-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-red-700">Invalid GPS</h3>
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-800">{stats.invalidGPS}</p>
                        <p className="text-xs text-red-600 mt-1">
                            Suspicious uploads
                        </p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-orange-700">No GPS</h3>
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold text-orange-800">{stats.noGPS}</p>
                        <p className="text-xs text-orange-600 mt-1">
                            GPS unavailable
                        </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-blue-700">Avg Score</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-800">
                            {stats.avgScore.toFixed(0)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Out of 100
                        </p>
                    </div>
                </div>
            )}

            {/* Fraud Detection Table */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Fraud Detection Report</h2>
                        </div>
                        <button
                            onClick={loadData}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                    <p className="text-sm text-red-100 mt-2">
                        Monitoring suspicious uploads dan GPS validation
                    </p>
                </div>

                {fraudEntries.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-green-800">No Suspicious Activity</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Semua uploads terverifikasi dengan baik ✓
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b-2 border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        Upload Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        Photo Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        GPS Info
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                                        Fraud Flag
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {fraudEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 ${getFlagColor(entry.fraud_flag)}`}>
                                                {getFlagIcon(entry.fraud_flag)}
                                                <span className="text-xs font-semibold">
                                                    {entry.is_gps_valid ? 'Valid' : 'Invalid'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">{entry.location}</p>
                                            <p className="text-xs text-slate-500">{entry.uploaded_by}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                {new Date(entry.created_at).toLocaleString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                {entry.photo_timestamp
                                                    ? new Date(entry.photo_timestamp).toLocaleString('id-ID')
                                                    : 'N/A'
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {entry.latitude && entry.longitude ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <MapPin className="w-4 h-4" />
                                                        {entry.latitude.toFixed(6)}°, {entry.longitude.toFixed(6)}°
                                                    </div>
                                                    <p className="text-xs text-slate-500">{entry.gps_address}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">GPS unavailable</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getFlagColor(entry.fraud_flag)}`}>
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
        </div>
    );
}