'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, ArrowLeft, Check } from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/storage/cloudinary-upload';
import { addWatermarkToPhoto, getUserCoordinates } from '@/lib/utils/photo-watermark';
import { reverseGeocode } from '@/lib/utils/reverse-geocoding';
import { saveChecklistData } from '@/lib/database/checklist';
import { locations } from '@/lib/utils';
import { toast } from 'sonner';

export default function UploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [preview, setPreview] = useState<string>('');
    const [gpsData, setGpsData] = useState<any>(null);

    // ✅ ROLLBACK: Pakai 1-indexed (sesuai data lama)
    const [formData, setFormData] = useState({
        photo: null as File | null,
        location: locations[0] || '',
        day: new Date().getDate(),
        month: new Date().getMonth() + 1, // ✅ 1-12 (Oktober = 10)
        year: new Date().getFullYear(),
        score: 85,
    });

    // Auto-capture GPS on page load
    useEffect(() => {
        captureGPS();
    }, []);

    const captureGPS = async () => {
        setGpsLoading(true);

        try {
            if (!navigator.geolocation) {
                toast.error('Browser tidak support GPS!');
                return;
            }

            const coords = await getUserCoordinates();

            if (!coords) {
                toast.warning('GPS tidak tersedia');
                return;
            }

            setGpsData({
                latitude: coords.latitude,
                longitude: coords.longitude,
                address: 'Loading address...',
                isValid: true,
            });

            reverseGeocode(coords.latitude, coords.longitude)
                .then(addressData => {
                    setGpsData((prev: any) => ({
                        ...prev,
                        address: addressData.formatted,
                    }));
                })
                .catch(() => {
                    setGpsData((prev: any) => ({
                        ...prev,
                        address: `${coords.latitude.toFixed(6)}°, ${coords.longitude.toFixed(6)}°`,
                    }));
                });

            toast.success('GPS berhasil didapatkan!');
        } catch (error) {
            console.error('GPS error:', error);
        } finally {
            setGpsLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar!');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 10MB!');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, photo: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.photo) {
            toast.error('Pilih foto terlebih dahulu!');
            return;
        }

        console.log('📝 Form data sebelum submit:', formData);

        setLoading(true);

        try {
            const toastId = toast.loading('Mengupload foto...');

            const watermarkedFile = await addWatermarkToPhoto(formData.photo, {
                location: formData.location,
                timestamp: new Date(),
                coords: gpsData?.latitude && gpsData?.longitude ? {
                    latitude: gpsData.latitude,
                    longitude: gpsData.longitude,
                } : undefined,
            });

            const photoUrl = await uploadImageToCloudinary(
                watermarkedFile,
                'proservice-toilet'
            );

            await saveChecklistData({
                location: formData.location,
                day: formData.day,
                month: formData.month, // ✅ 1-12
                year: formData.year,
                score: formData.score,
                photo_url: photoUrl,
                latitude: gpsData?.latitude,
                longitude: gpsData?.longitude,
                gps_address: gpsData?.address,
                photo_timestamp: new Date(),
                is_gps_valid: gpsData?.isValid,
            });

            toast.success('Upload berhasil!', { id: toastId });

            setTimeout(() => {
                router.push('/dashboard');
            }, 500);

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Upload gagal!');
        } finally {
            setLoading(false);
        }
    };

    const getScoreLabel = () => {
        if (formData.score >= 95) return 'Excellent (100)';
        if (formData.score >= 85) return 'Good';
        if (formData.score >= 75) return 'Fair';
        return 'Poor (0)';
    };

    const getScoreColor = () => {
        if (formData.score >= 85) return 'bg-green-500';
        if (formData.score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Upload Data</h1>
                                <p className="text-sm text-gray-500">Tambahkan data kebersihan toilet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Camera className="w-4 h-4 text-gray-600" />
                            <label className="text-sm font-semibold text-gray-700">Foto Toilet</label>
                        </div>

                        {preview ? (
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, photo: null }));
                                        setPreview('');
                                    }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Pilih Foto</p>
                                    <p className="text-xs text-gray-500 mb-4">Camera atau Gallery</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="border-2 border-blue-500 text-blue-600 rounded-lg py-3 px-4 cursor-pointer hover:bg-blue-50 transition-colors">
                                            <div className="flex items-center justify-center gap-2">
                                                <Camera className="w-5 h-5" />
                                                <span className="font-medium">Camera</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className="border-2 border-purple-500 text-purple-600 rounded-lg py-3 px-4 cursor-pointer hover:bg-purple-50 transition-colors">
                                            <div className="flex items-center justify-center gap-2">
                                                <ImageIcon className="w-5 h-5" />
                                                <span className="font-medium">Gallery</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <label className="text-sm font-semibold text-gray-700">Lokasi Toilet</label>
                        </div>
                        <select
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Pilih Lokasi</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <label className="text-sm font-semibold text-gray-700">Tanggal</label>
                        </div>
                        <input
                            type="date"
                            value={`${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    day: date.getDate(),
                                    month: date.getMonth() + 1, // ✅ 1-12
                                    year: date.getFullYear()
                                }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Score Slider */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <label className="text-sm font-semibold text-gray-700">Skor Kebersihan</label>
                        </div>

                        <div className={`${getScoreColor()} rounded-xl p-4 mb-3`}>
                            <div className="flex items-center justify-between text-white mb-2">
                                <span className="text-3xl font-bold">{formData.score}</span>
                                <span className="text-sm font-medium">{getScoreLabel()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.score}
                                onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    accentColor: 'white'
                                }}
                            />
                            <div className="flex justify-between text-xs text-white/80 mt-1">
                                <span>Poor (0)</span>
                                <span>Excellent (100)</span>
                            </div>
                        </div>
                    </div>

                    {/* GPS Info */}
                    {gpsData && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-green-900">GPS Terdeteksi</p>
                                    <p className="text-xs text-green-700 mt-1">{gpsData.address}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formData.photo}
                        className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Simpan Data</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}