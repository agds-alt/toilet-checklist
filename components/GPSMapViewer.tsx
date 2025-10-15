import { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

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
}

export default function GPSMapViewer() {
    const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState<GPSPoint | null>(null);

    useEffect(() => {
        // Simulate loading GPS data
        // Dalam real app, fetch from getChecklistWithGPS()
        setTimeout(() => {
            const mockData: GPSPoint[] = [
                {
                    id: '1',
                    location: 'Toilet Lobby',
                    latitude: -6.2088,
                    longitude: 106.8456,
                    gps_address: 'Jl. Sudirman No. 1, Jakarta',
                    is_gps_valid: true,
                    score: 95,
                    photo_url: 'https://via.placeholder.com/400',
                    created_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    location: 'Toilet Lt. 1',
                    latitude: -6.2089,
                    longitude: 106.8457,
                    gps_address: 'Jl. Sudirman No. 2, Jakarta',
                    is_gps_valid: true,
                    score: 88,
                    photo_url: 'https://via.placeholder.com/400',
                    created_at: new Date().toISOString(),
                },
                {
                    id: '3',
                    location: 'Toilet Lt. 2',
                    latitude: -6.2095,
                    longitude: 106.8465,
                    gps_address: 'Jl. Thamrin No. 3, Jakarta',
                    is_gps_valid: false,
                    score: 72,
                    photo_url: 'https://via.placeholder.com/400',
                    created_at: new Date().toISOString(),
                },
            ];
            setGpsPoints(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'bg-blue-500';
        if (score >= 85) return 'bg-green-500';
        if (score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 bg-slate-50 rounded-2xl">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading GPS data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        <div>
                            <h2 className="text-xl font-bold">GPS Location Map</h2>
                            <p className="text-sm text-blue-100 mt-1">
                                Visualisasi lokasi upload foto dengan GPS tracking
                            </p>
                        </div>
                    </div>
                </div>

                {/* Map Container - Placeholder */}
                <div className="relative bg-slate-100 h-96 p-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-semibold text-lg mb-2">
                                Interactive Map View
                            </p>
                            <p className="text-slate-500 text-sm max-w-md">
                                Integrate dengan Leaflet atau Google Maps untuk visualisasi interaktif.<br />
                                Di bawah ini ditampilkan list view dari GPS data.
                            </p>
                        </div>
                    </div>

                    {/* Map Points Overlay - Visual representation */}
                    <div className="absolute inset-0 pointer-events-none">
                        {gpsPoints.map((point, index) => (
                            <div
                                key={point.id}
                                className="absolute"
                                style={{
                                    left: `${20 + index * 25}%`,
                                    top: `${30 + index * 15}%`,
                                }}
                            >
                                <div className={`w-4 h-4 rounded-full ${getScoreColor(point.score)} animate-pulse shadow-lg`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* GPS Points List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gpsPoints.map((point) => (
                    <div
                        key={point.id}
                        onClick={() => setSelectedPoint(point)}
                        className={`bg-white rounded-2xl shadow-lg border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${point.is_gps_valid
                                ? 'border-green-200 hover:border-green-400'
                                : 'border-red-200 hover:border-red-400'
                            }`}
                    >
                        {/* Photo */}
                        <div className="relative h-48 bg-slate-200 rounded-t-2xl overflow-hidden">
                            <img
                                src={point.photo_url}
                                alt={point.location}
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg font-bold text-white shadow-lg ${getScoreColor(point.score)}`}>
                                {point.score}
                            </div>
                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-lg ${point.is_gps_valid ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                {point.is_gps_valid ? '✓ Valid GPS' : '⚠ Invalid GPS'}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-1">{point.location}</h3>
                                <p className="text-xs text-slate-500">
                                    {new Date(point.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700">
                                            {point.latitude.toFixed(6)}°, {point.longitude.toFixed(6)}°
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {point.gps_address}
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
                                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-colors text-sm"
                            >
                                Buka di Google Maps →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedPoint && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPoint(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <img
                                src={selectedPoint.photo_url}
                                alt={selectedPoint.location}
                                className="w-full h-96 object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedPoint(null)}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                    {selectedPoint.location}
                                </h3>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${selectedPoint.is_gps_valid
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {selectedPoint.is_gps_valid ? '✓ GPS Valid' : '⚠ GPS Invalid'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm text-blue-700 font-semibold mb-1">Score</p>
                                    <p className="text-3xl font-bold text-blue-900">{selectedPoint.score}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <p className="text-sm text-purple-700 font-semibold mb-1">Upload Time</p>
                                    <p className="text-sm font-semibold text-purple-900">
                                        {new Date(selectedPoint.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    GPS Coordinates
                                </p>
                                <p className="text-lg font-mono text-slate-900">
                                    {selectedPoint.latitude.toFixed(6)}°, {selectedPoint.longitude.toFixed(6)}°
                                </p>
                                <p className="text-sm text-slate-600">{selectedPoint.gps_address}</p>
                            </div>

                            <button
                                onClick={() => {
                                    window.open(
                                        `https://www.google.com/maps?q=${selectedPoint.latitude},${selectedPoint.longitude}`,
                                        '_blank'
                                    );
                                }}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                            >
                                View in Google Maps →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Score Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Excellent</p>
                            <p className="text-xs text-slate-500">95-100</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Good</p>
                            <p className="text-xs text-slate-500">85-94</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Fair</p>
                            <p className="text-xs text-slate-500">75-84</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Poor</p>
                            <p className="text-xs text-slate-500">0-74</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}