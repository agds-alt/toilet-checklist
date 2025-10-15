'use client';

import { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getChecklistWithGPS } from '@/lib/database/checklist';

interface GPSPoint {
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    gps_address: string;
    is_gps_valid: boolean;
    score: number;
    photo_url: string;
    created_at: string;
    uploaded_by: string;
    day: number;
    month: number;
    year: number;
}

export default function GPSMapPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<GPSPoint | null>(null);
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadGPSData();
    }, [filterMonth, filterYear]);

    const loadGPSData = async () => {
        setLoading(true);
        try {
            const data = await getChecklistWithGPS(filterMonth, filterYear);
            setGpsPoints(data as GPSPoint[]);
        } catch (error) {
            console.error('Error loading GPS data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'bg-blue-500';
        if (score >= 85) return 'bg-green-500';
        if (score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreColorText = (score: number) => {
        if (score >= 95) return 'text-blue-500';
        if (score >= 85) return 'text-green-500';
        if (score >= 75) return 'text-yellow-500';
        return 'text-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold text-lg">Loading GPS data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
                                    <MapPin className="w-7 h-7 text-blue-600" />
                                    GPS Location Tracker
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Visualisasi lokasi upload foto dengan GPS tracking
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                                className="px-4 py-2 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>
                                        {new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                                className="px-4 py-2 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Statistics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Uploads</h3>
                        <p className="text-3xl font-bold text-slate-800">{gpsPoints.length}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl shadow-lg border-2 border-green-200">
                        <h3 className="text-sm font-semibold text-green-700 mb-2">Valid GPS</h3>
                        <p className="text-3xl font-bold text-green-800">
                            {gpsPoints.filter(p => p.is_gps_valid).length}
                        </p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl shadow-lg border-2 border-red-200">
                        <h3 className="text-sm font-semibold text-red-700 mb-2">Invalid GPS</h3>
                        <p className="text-3xl font-bold text-red-800">
                            {gpsPoints.filter(p => !p.is_gps_valid).length}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                        <h3 className="text-sm font-semibold text-blue-700 mb-2">Avg Score</h3>
                        <p className="text-3xl font-bold text-blue-800">
                            {gpsPoints.length > 0
                                ? (gpsPoints.reduce((sum, p) => sum + p.score, 0) / gpsPoints.length).toFixed(0)
                                : 0
                            }
                        </p>
                    </div>
                </div>

                {/* Map Container Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">Interactive Map View</h2>
                                <p className="text-sm text-blue-100 mt-1">
                                    {gpsPoints.length} lokasi dengan GPS tracking
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 h-[500px] p-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <MapPin className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-slate-700 mb-3">
                                    Map Integration Coming Soon
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    Untuk full interactive map, integrate dengan:
                                </p>
                                <div className="space-y-2 text-left bg-white p-4 rounded-xl shadow-lg">
                                    <p className="text-sm text-slate-700">
                                        • <strong>Leaflet.js</strong> - Open source & free
                                    </p>
                                    <p className="text-sm text-slate-700">
                                        • <strong>Google Maps API</strong> - Powerful features
                                    </p>
                                    <p className="text-sm text-slate-700">
                                        • <strong>Mapbox</strong> - Beautiful styling
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 mt-4">
                                    Scroll down untuk list view dengan GPS info lengkap
                                </p>
                            </div>
                        </div>

                        {/* Visual representation of points */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {gpsPoints.slice(0, 15).map((point, index) => {
                                const x = 10 + (index * 6) % 80;
                                const y = 15 + (index * 8) % 70;
                                return (
                                    <div
                                        key={point.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                        }}
                                    >
                                        <div className={`w-4 h-4 rounded-full ${getScoreColor(point.score)} animate-pulse shadow-lg ring-4 ring-white/50`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* GPS Points Grid */}
                {gpsPoints.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-12 text-center">
                        <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">
                            Tidak Ada Data GPS
                        </h3>
                        <p className="text-slate-600">
                            Belum ada upload foto dengan GPS tracking untuk bulan ini
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gpsPoints.map((point) => (
                            <div
                                key={point.id}
                                onClick={() => setSelectedPoint(point)}
                                className={`bg-white rounded-2xl shadow-lg border-2 cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02] ${point.is_gps_valid
                                        ? 'border-green-200 hover:border-green-400'
                                        : 'border-red-200 hover:border-red-400'
                                    }`}
                            >
                                {/* Photo */}
                                <div className="relative h-56 bg-slate-200 rounded-t-2xl overflow-hidden">
                                    <img
                                        src={point.photo_url}
                                        alt={point.location}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl font-bold text-white shadow-lg ${getScoreColor(point.score)}`}>
                                        {point.score}
                                    </div>
                                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg ${point.is_gps_valid ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                        {point.is_gps_valid ? '✓ Valid' : '⚠ Invalid'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-1">{point.location}</h3>
                                        <p className="text-xs text-slate-500">
                                            {point.day} {new Date(2000, point.month - 1).toLocaleString('id-ID', { month: 'long' })} {point.year}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-mono font-medium text-slate-700">
                                                    {point.latitude?.toFixed(6)}°, {point.longitude?.toFixed(6)}°
                                                </p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {point.gps_address || 'Address not available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                                `https://www.google.com/maps?q=${point.latitude},${point.longitude}`,
                                                '_blank'
                                            );
                                        }}
                                        className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-colors text-sm"
                                    >
                                        Buka di Google Maps →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Legend */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Score Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-lg" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Excellent</p>
                                <p className="text-xs text-slate-500">95-100</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 shadow-lg" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Good</p>
                                <p className="text-xs text-slate-500">85-94</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-lg" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Fair</p>
                                <p className="text-xs text-slate-500">75-84</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 shadow-lg" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Poor</p>
                                <p className="text-xs text-slate-500">0-74</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedPoint && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPoint(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <img
                                src={selectedPoint.photo_url}
                                alt={selectedPoint.location}
                                className="w-full h-[400px] object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedPoint(null)}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white font-bold text-slate-700"
                            >
                                ✕
                            </button>
                            <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg ${selectedPoint.is_gps_valid ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                {selectedPoint.is_gps_valid ? '✓ GPS Valid' : '⚠ GPS Invalid'}
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                                    {selectedPoint.location}
                                </h3>
                                <p className="text-slate-600">
                                    {selectedPoint.day} {new Date(2000, selectedPoint.month - 1).toLocaleString('id-ID', { month: 'long' })} {selectedPoint.year}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${getScoreColor(selectedPoint.score).replace('bg-', 'bg-')}/10 p-6 rounded-2xl border-2 ${getScoreColor(selectedPoint.score).replace('bg-', 'border-')}`}>
                                    <p className={`text-sm font-semibold mb-2 ${getScoreColorText(selectedPoint.score)}`}>
                                        Score
                                    </p>
                                    <p className={`text-4xl font-bold ${getScoreColorText(selectedPoint.score)}`}>
                                        {selectedPoint.score}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                                    <p className="text-sm text-purple-700 font-semibold mb-2">Upload Time</p>
                                    <p className="text-lg font-semibold text-purple-900">
                                        {new Date(selectedPoint.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 space-y-3">
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    GPS Coordinates
                                </p>
                                <p className="text-2xl font-mono font-bold text-slate-900">
                                    {selectedPoint.latitude?.toFixed(6)}°, {selectedPoint.longitude?.toFixed(6)}°
                                </p>
                                <p className="text-base text-slate-700 font-medium">
                                    {selectedPoint.gps_address || 'Address not available'}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    window.open(
                                        `https://www.google.com/maps?q=${selectedPoint.latitude},${selectedPoint.longitude}`,
                                        '_blank'
                                    );
                                }}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-lg"
                            >
                                View in Google Maps →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}