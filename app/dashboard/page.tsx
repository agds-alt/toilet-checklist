'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Controls from '@/components/Controls';
import PhotoModal from '@/components/PhotoModal';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase/client';
import { useRealtimeChecklist } from '@/lib/hooks/useRealtimeChecklist';

const ChecklistTable = dynamic(() => import('@/components/ChecklistTable'), {
    loading: () => <LoadingSkeleton />
});

export default function DashboardPage() {
    const { profile } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear] = useState(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [selectedUploader, setSelectedUploader] = useState<string>('all');
    const [uploaders, setUploaders] = useState<Array<{ id: string; name: string }>>([]);
    const [filteredData, setFilteredData] = useState<any>({});
    const [photoModalData, setPhotoModalData] = useState<any>(null);

    const { data: allChecklistData, loading, refresh } = useRealtimeChecklist(
        selectedMonth,
        selectedYear
    );

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

    // Filter data based on week and uploader
    useEffect(() => {
        const filtered: any = {};

        if (!allChecklistData || allChecklistData.length === 0) {
            console.log('⚠️ No data available');
            setFilteredData({});
            return;
        }

        console.log('🔍 Processing', allChecklistData.length, 'items');

        allChecklistData.forEach((item: any) => {
            // Filter by uploader
            if (selectedUploader !== 'all' && item.uploaded_by !== selectedUploader) {
                return;
            }

            // Filter by week
            if (selectedWeek !== null) {
                const weekStart = selectedWeek * 7 + 1;
                const weekEnd = weekStart + 6;
                if (item.day < weekStart || item.day > weekEnd) {
                    return;
                }
            }

            // ✅ Use month as-is (1-12)
            const key = item.location + '-' + item.month + '-' + item.day;

            filtered[key] = {
                score: item.score,
                photo: item.photo_url,
                photoData: item
            };
        });

        console.log('✅ Filtered:', Object.keys(filtered).length, 'items');
        setFilteredData(filtered);
    }, [allChecklistData, selectedUploader, selectedWeek]);

    const handleCellClick = (location: string, day: number) => {
        const key = location + '-' + selectedMonth + '-' + day;
        const data = filteredData[key];

        if (data?.photoData) {
            setPhotoModalData(data.photoData);
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
                rawData={allChecklistData || []}
            />

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
                {(selectedWeek !== null || selectedUploader !== 'all') && (
                    <div className="mb-4 glass-card rounded-xl p-3 border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-slate-700">Filter Aktif:</span>
                            <span className="text-slate-600">
                                {allChecklistData?.length || 0} records
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

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Real-time updates active</span>
                </div>
            </div>

            <PhotoModal
                data={photoModalData}
                onClose={() => setPhotoModalData(null)}
            />
        </div>
    );
}