// ============================================
// app/page.tsx - UPDATE MAIN PAGE WITH PROTECTED LAYOUT
// ============================================
'use client';

import { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import Header from '@/components/Header';
import Controls from '@/components/Controls';
import ChecklistTable from '@/components/ChecklistTable';
import PhotoModal from '@/components/PhotoModal';
import Sidebar from '@/components/Sidebar';
import { getChecklistData } from '@/lib/database/checklist';
import { getAverageScore } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';

export default function Home() {
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

    return (
        <ProtectedLayout>
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
                <Header averageScore={averageScore} onUploadClick={() => setSidebarOpen(true)} />
                <Controls
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                />

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-slate-600">Loading data...</p>
                        </div>
                    ) : (
                        <ChecklistTable
                            data={checklistData}
                            selectedMonth={selectedMonth}
                            onCellClick={handleCellClick}
                        />
                    )}
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
            </main>
        </ProtectedLayout>
    );
}
