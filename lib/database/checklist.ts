// ============================================
// lib/database/checklist.ts - DATABASE OPERATIONS
// ============================================
import { supabase } from '@/lib/supabase/client';
import { ChecklistData } from '@/types';

export async function saveChecklistData(data: {
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string;
}): Promise<ChecklistData> {
    const { data: result, error } = await supabase
        .from('checklist_data')
        .upsert({
            ...data,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function getChecklistData(month: number, year: number): Promise<ChecklistData[]> {
    const { data, error } = await supabase
        .from('checklist_data')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .order('day', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function approveChecklistData(id: string): Promise<void> {
    const { error } = await supabase
        .from('checklist_data')
        .update({
            approved_by: (await supabase.auth.getUser()).data.user?.id,
            approved_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) throw error;
}