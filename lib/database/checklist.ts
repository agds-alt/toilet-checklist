// lib/database/checklist.ts
import { supabase } from '@/lib/supabase/client';

export interface ChecklistData {
    id: string;
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string | null;
    uploaded_by: string | null;
    approved_by: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

export async function saveChecklistData(data: {
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string;
}): Promise<ChecklistData> {
    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Auth error:', userError);
            throw new Error('Not authenticated');
        }

        if (!user) {
            throw new Error('User not found');
        }

        console.log('💾 Saving data for user:', user.id);

        // Upsert data
        const { data: result, error } = await supabase
            .from('checklist_data')
            .upsert({
                ...data,
                uploaded_by: user.id,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        console.log('✅ Data saved successfully!');
        return result;
    } catch (error: any) {
        console.error('❌ Save error:', error);
        throw error;
    }
}

export async function getChecklistData(month: number, year: number): Promise<ChecklistData[]> {
    try {
        console.log(`📊 Fetching data for ${month}/${year}...`);

        const { data, error } = await supabase
            .from('checklist_data')
            .select('*')
            .eq('month', month)
            .eq('year', year)
            .order('day', { ascending: true });

        if (error) {
            console.error('❌ Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        console.log(`✅ Fetched ${data?.length || 0} records`);
        return data || [];
    } catch (error: any) {
        console.error('❌ Fetch error:', error);
        // Return empty array instead of throwing
        return [];
    }
}

export async function approveChecklistData(id: string): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('checklist_data')
            .update({
                approved_by: user.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
        console.log('✅ Data approved!');
    } catch (error) {
        console.error('❌ Approve error:', error);
        throw error;
    }
}