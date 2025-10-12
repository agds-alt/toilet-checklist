'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Controls from '@/components/Controls';
import ChecklistTable from '@/components/ChecklistTable';
import PhotoModal from '@/components/PhotoModal';
import Sidebar from '@/components/Sidebar';
import { getChecklistData, ChecklistData } from '@/lib/database/checklist'; // ← UPDATE: Import ChecklistData type
import { getAverageScore, periods } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/supabase/client';

interface ChecklistItem {
    id: string;
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string | null;
    uploaded_by: string | null;
    created_at: string;
}

interface Uploader {
    id: string;
    name: string;
}

export default function DashboardPage() {
    const { profile } = useAuth();
    const [allChecklistData, setAllChecklistData] = useState<ChecklistItem[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear] = useState(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [selectedUploader, setSelectedUploader] = useState('all');
    const [uploaders, setUploaders] = useState<Uploader[]>([]);
    const [photoModalData, setPhotoModalData] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        loadUploaders();
    }, [selectedMonth, selectedYear]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getChecklistData(selectedMonth, selectedYear);
            setAllChecklistData(data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUploaders = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name')
                .order('full_name');

            if (error) throw error;

            const uploaderList: Uploader[] = data.map(profile => ({
                id: profile.id,
                name: profile.full_name || 'Unknown User'
            }));

            setUploaders(uploaderList);
        } catch (error) {
            console.error('Error loading uploaders:', error);
        }
    };

    const filteredData = useMemo(() => {
        let filtered = [...allChecklistData];

        if (selectedWeek !== null && periods[selectedWeek]) {
            const weekDays = periods[selectedWeek].days;
            filtered = filtered.filter(item => weekDays.includes(item.day));
        }

        if (selectedUploader !== 'all') {
            filtered = filtered.filter(item => item.uploaded_by === selectedUploader);
        }

        return filtered.reduce((acc: any, item: ChecklistItem) => {
            const key = `${item.location}-${item.month}-${item.day}`;
            acc[key] = {
                score: item.score,
                photo: item.photo_url,
                timestamp: item.created_at,
                uploadedBy: item.uploaded_by
            };
            return acc;
        }, {});
    }, [allChecklistData, selectedWeek, selectedUploader]);

    const handleCellClick = (location: string, day: number) => {
        const key = `${location}-${selectedMonth}-${day}`;
        const data = filteredData[key];

        if (data?.photo) {
            setPhotoModalData(data);
        } else if (profile?.role === 'cleaner' || profile?.role === 'admin') {
            setSidebarOpen(true);
        }
    };

    const handleUpload = async () => {
        await loadData();
    };

    const handleResetFilters = () => {
        setSelectedWeek(null);
        setSelectedUploader('all');
    };

    const averageScore = getAverageScore(filteredData);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading checklist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header
                averageScore={averageScore}
                onUploadClick={() => setSidebarOpen(true)}
            />

            {/* ← UPDATE: Pass rawData to Controls for export */}
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
                rawData={allChecklistData} // ← ADD: Pass raw data for export
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {(selectedWeek !== null || selectedUploader !== 'all') && (
                    <div className="mb-6 glass-card rounded-2xl p-4 border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-slate-700">
                                Menampilkan:
                            </span>
                            <span className="text-slate-600">
                                {allChecklistData.length} total records
                                {selectedWeek !== null && ` - ${periods[selectedWeek].name}`}
                                {selectedUploader !== 'all' && ` - ${uploaders.find(u => u.id === selectedUploader)?.name}`}
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