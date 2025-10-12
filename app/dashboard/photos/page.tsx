// ============================================
// 3. app/dashboard/photos/page.tsx - FIXED EXPORT!
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Trash2, Eye, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

// DEFAULT EXPORT - IMPORTANT!
export default function PhotosPage() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const { profile } = useAuth();

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const { data, error } = await supabase
                .from('checklist_data')
                .select('*, profiles!uploaded_by(full_name)')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setPhotos(data || []);
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus foto ini?')) return;

        try {
            const { error } = await supabase
                .from('checklist_data')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await loadPhotos();
            alert('✅ Foto berhasil dihapus!');
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading photos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Photo Management</h1>
                <p className="text-slate-600">Total: {photos.length} photos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-48 bg-slate-900">
                            <img
                                src={photo.photo_url}
                                alt={photo.location}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="font-medium">{photo.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(photo.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${photo.score >= 95 ? 'bg-blue-100 text-blue-700' :
                                        photo.score >= 85 ? 'bg-green-100 text-green-700' :
                                            photo.score >= 75 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                    }`}>
                                    {photo.score}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedPhoto(photo)}
                                    className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>

                                {profile?.role === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(photo.id)}
                                        className="py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 fade-in">
                    <div className="glass-card rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
                        <div className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{selectedPhoto.location}</h3>
                                    <p className="text-sm text-blue-200">
                                        Score: {selectedPhoto.score} • {new Date(selectedPhoto.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="p-3 hover:bg-white/20 rounded-xl transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <img
                                src={selectedPhoto.photo_url}
                                alt={selectedPhoto.location}
                                className="w-full h-[500px] object-contain bg-slate-900 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}