'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Controls from '@/components/Controls';
import ChecklistTable from '@/components/ChecklistTable';
import PhotoModal from '@/components/PhotoModal';
import Sidebar from '@/components/Sidebar';
import { getChecklistData } from '@/lib/database/checklist';
import { getAverageScore } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardPage() {
    const { profile } = useAuth();
    const [checklistData, setChecklistData] = useState<any>({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear] = useState(new Date().getFullYear());
    const [photoModalData, setPhotoModalData] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedMonth, selectedYear]);

    const loadData = async () => {
        try {
            const data = await getChecklistData(selectedMonth, selectedYear);
            const formatted = data.reduce((acc: any, item: any) => {
                const key = `${item.location}-${item.month}-${item.day}`;
                acc[key] = {
                    score: item.score,
                    photo: item.photo_url,
                    timestamp: item.created_at
                };
                return acc;
            }, {});
            setChecklistData(formatted);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (location: string, day: number) => {
        const key = `${location}-${selectedMonth}-${day}`;
        const data = checklistData[key];

        if (data?.photo) {
            setPhotoModalData(data);
        } else if (profile?.role === 'cleaner' || profile?.role === 'admin') {
            setSidebarOpen(true);
        }
    };

    const handleUpload = async () => {
        await loadData();
    };

    const averageScore = getAverageScore(checklistData);

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
            {/* Header with Upload Button */}
            <Header
                averageScore={averageScore}
                onUploadClick={() => setSidebarOpen(true)}
            />

            {/* Month Filter */}
            <Controls
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
            />

            {/* Main Checklist Table */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <ChecklistTable
                    data={checklistData}
                    selectedMonth={selectedMonth}
                    onCellClick={handleCellClick}
                />
            </div>

            {/* Upload Sidebar */}
            {(profile?.role === 'cleaner' || profile?.role === 'admin') && (
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onUpload={handleUpload}
                    selectedMonth={selectedMonth}
                />
            )}

            {/* Photo Modal */}
            {photoModalData && (
                <PhotoModal
                    data={photoModalData}
                    onClose={() => setPhotoModalData(null)}
                />
            )}
        </div>
    );
}