// ============================================
// components/Sidebar.tsx - FIXED CLOUDINARY UPLOAD
// ============================================
import { useState } from 'react';
import { Upload, X, CheckCircle2, Camera, MapPin, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/storage/cloudinary-upload';
import { saveChecklistData } from '@/lib/database/checklist';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: () => Promise<void>;
    selectedMonth: number;
}

export default function Sidebar({ isOpen, onClose, onUpload, selectedMonth }: SidebarProps) {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [score, setScore] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const locations = [
        'Toilet Lobby',
        'Toilet Lt 1 Depan',
        'Toilet Lt 1 Belakang',
        'Toilet Lt 2 Depan',
        'Toilet Lt 2 Belakang',
        'Toilet Lt 3 Depan',
        'Toilet Lt 3 Belakang',
        'Toilet Security'
    ];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                alert('⚠️ File harus berupa gambar (JPG, PNG, atau WebP)!');
                return;
            }

            // Validate file size (10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert('⚠️ Ukuran file maksimal 10MB!');
                return;
            }

            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        }
    };

    // Validate score input - only 1-100
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow empty string for clearing
        if (value === '') {
            setScore('');
            return;
        }

        const num = parseInt(value);

        // Only accept numbers between 1-100
        if (!isNaN(num) && num >= 1 && num <= 100) {
            setScore(value);
        } else if (num > 100) {
            setScore('100');
        } else if (num < 1) {
            setScore('1');
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!selectedLocation || !selectedDay || !score || !file) {
            alert('⚠️ Mohon lengkapi semua field!');
            return;
        }

        const scoreNum = parseInt(score);
        if (scoreNum < 1 || scoreNum > 100) {
            alert('⚠️ Nilai harus antara 1-100!');
            return;
        }

        const dayNum = parseInt(selectedDay);
        if (dayNum < 1 || dayNum > 31) {
            alert('⚠️ Tanggal harus antara 1-31!');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            console.log('🚀 Starting upload process...');

            // Step 1: Upload to Cloudinary
            setUploadProgress(20);
            console.log('📤 Uploading to Cloudinary...');

            const photoUrl = await uploadImageToCloudinary(file, 'proservice-toilet');

            console.log('✅ Cloudinary upload success:', photoUrl);
            setUploadProgress(60);

            // Step 2: Save to database
            console.log('💾 Saving to database...');
            await saveChecklistData({
                location: selectedLocation,
                day: dayNum,
                month: selectedMonth,
                year: new Date().getFullYear(),
                score: scoreNum,
                photo_url: photoUrl,
            });

            console.log('✅ Database save success!');
            setUploadProgress(100);

            // Step 3: Refresh data
            await onUpload();

            // Reset form and close
            handleReset();
            onClose();

            alert('✅ Data berhasil diupload ke Cloudinary dan disimpan!');
        } catch (error: any) {
            console.error('❌ Upload error:', error);
            alert(`❌ Error: ${error.message || 'Upload gagal, silakan coba lagi.'}`);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleReset = () => {
        setSelectedLocation('');
        setSelectedDay('');
        setScore('');
        setPreview(null);
        setFile(null);
    };

    const getScoreStyle = (scoreValue: string) => {
        const num = parseInt(scoreValue);
        if (num >= 95) return { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-300', text: 'text-blue-700', icon: '🌟', label: 'Excellent', shadow: 'shadow-blue-200' };
        if (num >= 85) return { bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-300', text: 'text-green-700', icon: '✅', label: 'Good', shadow: 'shadow-green-200' };
        if (num >= 75) return { bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', icon: '⚠️', label: 'Fair', shadow: 'shadow-yellow-200' };
        return { bg: 'bg-gradient-to-br from-red-50 to-red-100', border: 'border-red-300', text: 'text-red-700', icon: '❌', label: 'Poor', shadow: 'shadow-red-200' };
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 h-screen w-full md:w-[600px] z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="h-full bg-white/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(59, 130, 246, 0.15)' }}>

                    {/* Decorative overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse pointer-events-none"
                        style={{ animationDuration: '4s' }} />

                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white px-8 py-6"
                        style={{ boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)' }}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
                        </div>

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:blur-lg transition-all" />
                                    <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-2xl transform group-hover:scale-110 transition-all"
                                        style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                                        <Upload className="w-7 h-7" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold">Upload Data Kebersihan</h2>
                                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                                    </div>
                                    <p className="text-sm text-blue-200 flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        Upload langsung ke Cloudinary
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                disabled={uploading}
                                className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300 disabled:opacity-50">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="h-[calc(100vh-200px)] overflow-y-auto px-8 py-8 space-y-6"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#3b82f6 #f1f5f9'
                        }}>

                        {/* Location */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Lokasi Toilet
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    disabled={uploading}
                                    className="relative w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] disabled:opacity-50">
                                    <option value="">-- Pilih Lokasi Toilet --</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date & Score */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    Tanggal
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    disabled={uploading}
                                    placeholder="1-31"
                                    className="relative w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-slate-700 text-center text-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.05] disabled:opacity-50"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    Skor (1-100)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={score}
                                    onChange={handleScoreChange}
                                    disabled={uploading}
                                    placeholder="1-100"
                                    className="relative w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 font-bold text-slate-700 text-center text-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.05] disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Score Indicator */}
                        {score && parseInt(score) >= 1 && parseInt(score) <= 100 && (() => {
                            const style = getScoreStyle(score);
                            return (
                                <div className={`${style.bg} border-2 ${style.border} rounded-2xl p-5 ${style.shadow} shadow-2xl transform hover:scale-[1.02] transition-all animate-in fade-in duration-500`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{style.icon}</span>
                                            <div>
                                                <p className={`text-xl font-bold ${style.text}`}>{style.label}</p>
                                                <p className="text-sm text-slate-600 font-medium">Kualitas Kebersihan</p>
                                            </div>
                                        </div>
                                        <div className={`text-5xl font-black ${style.text}`}>{score}</div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Score Legend */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { range: '95-100', label: 'Excellent', icon: '🌟', colors: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700' },
                                { range: '85-94', label: 'Good', icon: '✅', colors: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700' },
                                { range: '75-84', label: 'Fair', icon: '⚠️', colors: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700' },
                                { range: '1-74', label: 'Poor', icon: '❌', colors: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700' }
                            ].map((item, idx) => (
                                <div key={idx} className={`${item.colors} border-2 rounded-xl p-3 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}>
                                    <div className="text-2xl mb-1">{item.icon}</div>
                                    <div className="font-bold text-sm">{item.range}</div>
                                    <div className="text-xs font-medium opacity-80">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Photo Upload */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                                <Camera className="w-4 h-4 text-orange-600" />
                                Foto Bukti Kebersihan
                            </label>

                            {!preview ? (
                                <label className={`relative block ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex flex-col items-center justify-center w-full h-72 border-3 border-dashed border-slate-300 rounded-3xl hover:border-blue-500 transition-all bg-gradient-to-br from-slate-50 to-blue-50/50 shadow-xl hover:shadow-2xl transform hover:scale-[1.01]">
                                        <div className="relative mb-5">
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                                            <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl transform group-hover:rotate-6 transition-all">
                                                <Camera className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-xl text-slate-700 font-bold mb-2">Klik untuk Upload Foto</p>
                                        <p className="text-sm text-slate-500 font-medium">PNG, JPG, atau WebP • Max 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="relative group rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all">
                                    <img src={preview} alt="Preview" className="w-full h-96 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={uploading}
                                        className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-2xl transform hover:rotate-6 disabled:opacity-50">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-green-700 px-5 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-2xl">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <span>Foto Siap Diupload ✨</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress */}
                        {uploading && (
                            <div className="space-y-3 animate-in fade-in duration-500">
                                <div className="flex justify-between text-sm font-bold text-slate-700">
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        Mengupload ke Cloudinary...
                                    </span>
                                    <span className="text-blue-600">{uploadProgress}%</span>
                                </div>
                                <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%`, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 px-8 py-6 space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading || !selectedLocation || !selectedDay || !score || !file}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all group">
                            {uploading ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Uploading {uploadProgress}%...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    <span>Upload ke Cloudinary</span>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={uploading}
                            className="w-full py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold border-2 border-slate-200 hover:border-slate-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}