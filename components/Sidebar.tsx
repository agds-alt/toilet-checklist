// ============================================
// components/Sidebar.tsx - PREMIUM SIDEBAR
// ============================================
'use client';

import { useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (score: number, photo: string, location: string, day: number) => void;
    selectedMonth: number;
}

export default function Sidebar({ isOpen, onClose, onUpload, selectedMonth }: SidebarProps) {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [score, setScore] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const locations = [
        'Toilet Lobby', 'Toilet Lt 1 Depan', 'Toilet Lt 1 Belakang',
        'Toilet Lt 2 Depan', 'Toilet Lt 2 Belakang', 'Toilet Lt 3 Depan',
        'Toilet Lt 3 Belakang', 'Toilet Security'
    ];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedLocation || !selectedDay || !score || !preview) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        const scoreNum = parseInt(score);
        if (scoreNum < 0 || scoreNum > 100) {
            alert('Nilai harus antara 0-100!');
            return;
        }

        setUploading(true);

        try {
            // 1. Convert base64 to File
            const response = await fetch(preview);
            const blob = await response.blob();
            const file = new File([blob], 'toilet-photo.jpg', { type: 'image/jpeg' });

            // 2. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 3. Upload image to Supabase Storage
            const photoUrl = await uploadImage(file, user.id);

            // 4. Save to database
            await saveChecklistData({
                location: selectedLocation,
                day: parseInt(selectedDay),
                month: selectedMonth,
                year: new Date().getFullYear(),
                score: scoreNum,
                photo_url: photoUrl
            });

            // 5. Success - Refresh & close
            await onUpload();
            setSelectedLocation('');
            setSelectedDay('');
            setScore('');
            setPreview(null);
            onClose();

            alert('✅ Data berhasil diupload!');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 h-full w-[480px] glass-card shadow-2xl transform transition-all duration-300 ease-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} slide-in-right`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-8 overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Upload Data</h2>
                                </div>
                                <p className="text-blue-100 text-sm font-medium ml-14">
                                    Upload bukti kebersihan toilet
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white to-slate-50">
                        {/* Location */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Lokasi Toilet
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-5 py-4 glass-card rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700"
                            >
                                <option value="">Pilih Lokasi...</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Day & Score */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Tanggal
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    placeholder="1-31"
                                    className="w-full px-5 py-4 glass-card rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-700 text-center text-xl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Skor (0-100)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    placeholder="0-100"
                                    className="w-full px-5 py-4 glass-card rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-700 text-center text-xl"
                                />
                            </div>
                        </div>

                        {/* Score Indicator */}
                        {score && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${parseInt(score) >= 95 ? 'bg-blue-50 border-2 border-blue-200' :
                                    parseInt(score) >= 85 ? 'bg-green-50 border-2 border-green-200' :
                                        parseInt(score) >= 75 ? 'bg-yellow-50 border-2 border-yellow-200' :
                                            'bg-red-50 border-2 border-red-200'
                                }`}>
                                {parseInt(score) >= 75 ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className="font-bold text-slate-700">
                                    {parseInt(score) >= 95 ? '🌟 Excellent!' :
                                        parseInt(score) >= 85 ? '✅ Good' :
                                            parseInt(score) >= 75 ? '⚠️ Fair' : '❌ Perlu Perbaikan'}
                                </span>
                            </div>
                        )}

                        {/* Photo Upload */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                Foto Bukti
                            </label>

                            {!preview ? (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-slate-300 rounded-3xl hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all group glass-card">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="p-5 bg-blue-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <p className="text-lg text-slate-700 font-bold">Klik untuk upload foto</p>
                                        <p className="text-sm text-slate-500 font-medium mt-2">PNG, JPG hingga 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="relative group rounded-3xl overflow-hidden">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-80 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <button
                                        onClick={handleReset}
                                        className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Foto siap diupload
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-slate-50 p-6 space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading || !selectedLocation || !selectedDay || !score || !preview}
                            className="w-full py-4 glass-button rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Mengupload...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload Data Sekarang
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full py-4 bg-white text-slate-700 rounded-2xl font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
