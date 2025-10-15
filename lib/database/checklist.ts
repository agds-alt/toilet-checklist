// lib/database/checklist.ts - Updated version dengan GPS metadata

import { supabase } from '@/lib/supabase/client';

export interface ChecklistData {
    id?: string;
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url?: string;
    uploaded_by?: string;
    approved_by?: string | null;
    approved_at?: string | null;
    created_at?: string;
    updated_at?: string;
    // New GPS metadata fields
    latitude?: number;
    longitude?: number;
    gps_address?: string;
    photo_timestamp?: Date | string;
    is_gps_valid?: boolean;
    device_info?: any;
}

/**
 * Save checklist data dengan GPS metadata
 */
export async function saveChecklistData(data: ChecklistData): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get device info untuk audit trail
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
        };

        const insertData = {
            location: data.location,
            day: data.day,
            month: data.month,
            year: data.year,
            score: data.score,
            photo_url: data.photo_url,
            uploaded_by: user.id,
            // GPS metadata
            latitude: data.latitude,
            longitude: data.longitude,
            gps_address: data.gps_address,
            photo_timestamp: data.photo_timestamp,
            is_gps_valid: data.is_gps_valid,
            device_info: deviceInfo,
        };

        const { error } = await supabase
            .from('checklist_data')
            .upsert(insertData, {
                onConflict: 'location,day,month,year',
            });

        if (error) throw error;

        console.log('✅ Checklist data saved dengan GPS metadata:', {
            location: data.location,
            gps: data.latitude && data.longitude
                ? `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`
                : 'N/A',
            timestamp: data.photo_timestamp,
        });

    } catch (error) {
        console.error('Error saving checklist data:', error);
        throw error;
    }
}

/**
 * Get checklist data untuk bulan tertentu
 */
export async function getChecklistData(
    month: number,
    year: number
): Promise<ChecklistData[]> {
    try {
        const { data, error } = await supabase
            .from('checklist_data')
            .select(`
                *,
                uploader:uploaded_by(full_name, email),
                approver:approved_by(full_name, email)
            `)
            .eq('month', month)
            .eq('year', year)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching checklist data:', error);
        throw error;
    }
}

/**
 * Get fraud detection report
 * Menampilkan data yang suspicious (GPS tidak valid, timestamp mismatch, dll)
 */
export async function getFraudDetectionReport(): Promise<any[]> {
    try {
        const { data, error } = await supabase
            .from('checklist_fraud_detection')
            .select('*')
            .neq('fraud_flag', 'OK')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching fraud detection:', error);
        throw error;
    }
}

/**
 * Get checklist data dengan GPS info untuk analytics
 */
export async function getChecklistWithGPS(
    month?: number,
    year?: number
): Promise<ChecklistData[]> {
    try {
        let query = supabase
            .from('checklist_data')
            .select('*')
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);

        if (month) query = query.eq('month', month);
        if (year) query = query.eq('year', year);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching GPS data:', error);
        throw error;
    }
}

/**
 * Approve checklist entry (untuk supervisor)
 */
export async function approveChecklistEntry(id: string): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('checklist_data')
            .update({
                approved_by: user.id,
                approved_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error approving entry:', error);
        throw error;
    }
}

/**
 * Delete checklist entry (admin only)
 */
export async function deleteChecklistEntry(id: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('checklist_data')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
}

/**
 * Get statistics dengan GPS validation info
 */
export async function getStatisticsWithGPS(
    month: number,
    year: number
): Promise<{
    total: number;
    withGPS: number;
    validGPS: number;
    invalidGPS: number;
    noGPS: number;
    avgScore: number;
}> {
    try {
        const { data, error } = await supabase
            .from('checklist_data')
            .select('score, latitude, longitude, is_gps_valid')
            .eq('month', month)
            .eq('year', year);

        if (error) throw error;

        const stats = {
            total: data.length,
            withGPS: data.filter(d => d.latitude && d.longitude).length,
            validGPS: data.filter(d => d.is_gps_valid === true).length,
            invalidGPS: data.filter(d => d.is_gps_valid === false).length,
            noGPS: data.filter(d => !d.latitude || !d.longitude).length,
            avgScore: data.length > 0
                ? data.reduce((sum, d) => sum + (d.score || 0), 0) / data.length
                : 0,
        };

        return stats;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
}