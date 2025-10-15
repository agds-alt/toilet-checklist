// lib/hooks/useRealtimeChecklist.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface RealtimeData {
    id: string;
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string;
    uploaded_by: string;
    created_at: string;
    updated_at: string;
}

export function useRealtimeChecklist(month: number, year: number) {
    const [data, setData] = useState<RealtimeData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);

            // ✅ month is already 1-12, use directly
            console.log('🔍 Querying checklist_data:', { month, year });

            const { data: checklistData, error } = await supabase
                .from('checklist_data')
                .select('*')
                .eq('month', month)
                .eq('year', year)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('✅ Data loaded:', checklistData?.length || 0, 'rows');
            if (checklistData && checklistData.length > 0) {
                console.log('📦 Sample data:', checklistData[0]);
            }

            setData(checklistData || []);
        } catch (error: any) {
            console.error('❌ Error loading data:', error);
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadData();
    }, [month, year]);

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('checklist-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'checklist_data',
                    filter: `month=eq.${month},year=eq.${year}`,
                },
                (payload) => {
                    console.log('🔔 Real-time update:', payload);

                    if (payload.eventType === 'INSERT') {
                        setData((prev) => [payload.new as RealtimeData, ...prev]);
                        toast.success('📥 Data baru ditambahkan!');
                    }

                    if (payload.eventType === 'UPDATE') {
                        setData((prev) =>
                            prev.map((item) =>
                                item.id === payload.new.id ? (payload.new as RealtimeData) : item
                            )
                        );
                        toast.info('🔄 Data diupdate!');
                    }

                    if (payload.eventType === 'DELETE') {
                        setData((prev) => prev.filter((item) => item.id !== payload.old.id));
                        toast.warning('🗑️ Data dihapus!');
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [month, year]);

    return { data, loading, refresh: loadData };
}