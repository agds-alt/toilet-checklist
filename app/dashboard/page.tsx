// ============================================
// app/dashboard/page.tsx - FIXED LAYOUT & SPACING
// ============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import ChecklistTable from '@/components/ChecklistTable';
import Controls from '@/components/Controls';
import Sidebar from '@/components/Sidebar';
import PhotoModal from '@/components/PhotoModal';
import Header from '@/components/Header';
import { getChecklistData, saveChecklistData } from '@/lib/database/checklist';
import { supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
    const { profile } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear] = useState(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [selectedUploader, setSelectedUploader] = useState<string>('all');
    const [uploaders, setUploaders] = useState<Array<{ id: string; name: string }>>([]);
    const [allChecklistData, setAllChecklistData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [photoModalData, setPhotoModalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch uploaders for filter
    useEffect(() => {
        const fetchUploaders = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .eq('is_active', true)
                    .order('full_name');

                if (error) throw error;

                setUploaders(data?.map(u => ({ id: u.id, name: u.full_name || u.id })) || []);
            } catch (error) {
                console.error('Error fetching uploaders:', error);
            }
        };

        fetchUploaders();
    }, []);

    // Load checklist data
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getChecklistData(selectedMonth, selectedYear);
            setAllChecklistData(data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filter data
    useEffect(() => {
        const filtered: any = {};

        allChecklistData.forEach((item: any) => {
            if (selectedUploader !== 'all' && item.uploaded_by !== selectedUploader) {
                return;
            }

            const key = `${item.location}-${item.month}-${item.day}`;
            filtered[key] = {
                score: item.score,
                photo: item.photo_url,
                photoData: item
            };
        });

        setFilteredData(filtered);
    }, [allChecklistData, selectedUploader]);

    const handleUpload = async (uploadData: any) => {
        try {
            await saveChecklistData(uploadData);
            await loadData();
            setSidebarOpen(false);
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Gagal upload data');
        }
    };

    const handleCellClick = (location: string, day: number) => {
        const key = `${location}-${selectedMonth}-${day}`;
        const data = filteredData[key];

        if (data?.photoData) {
            setPhotoModalData(data.photoData);
        } else if (profile?.role === 'cleaner' || profile?.role === 'admin') {
            setSidebarOpen(true);
        }
    };

    const handleResetFilters = () => {
        setSelectedWeek(null);
        setSelectedUploader('all');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <Header
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                data={filteredData}
                onOpenUpload={() => setSidebarOpen(true)}
            />

            <Controls
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedWeek={selectedWeek}
                selectedUploader={selectedUploader}
                uploaders={uploaders}
                onMonthChange={setSelectedMonth}
                onWeekChange={setSelectedWeek}
                onUploaderChange={setSelectedUploader}
                onReset={handleResetFilters}
                rawData={allChecklistData}
            />

            {/* IMPROVED: Better max-width and padding */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
                {(selectedWeek !== null || selectedUploader !== 'all') && (
                    <div className="mb-4 glass-card rounded-xl p-3 border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-slate-700">Filter Aktif:</span>
                            <span className="text-slate-600">
                                {allChecklistData.length} records
                                {selectedWeek !== null && ` • Minggu ke-${selectedWeek + 1}`}
                                {selectedUploader !== 'all' && ` • ${uploaders.find(u => u.id === selectedUploader)?.name}`}
                            </span>
                        </div>
                    </div>
                )}

                <ChecklistTable
                    data={filteredData}
                    selectedMonth={selectedMonth}
                    selectedWeek={selectedWeek}
                    onCellClick={handleCellClick}
                />
            </div>

            {(profile?.role === 'cleaner' || profile?.role === 'admin') && (
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onUpload={handleUpload}
                    selectedMonth={selectedMonth}
                />
            )}

            {photoModalData && (
                <PhotoModal
                    data={photoModalData}
                    onClose={() => setPhotoModalData(null)}
                />
            )}
        </div>
    );
}