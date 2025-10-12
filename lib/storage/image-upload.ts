// ============================================
// lib/storage/image-upload.ts - IMAGE UPLOAD
// ============================================
import { supabase } from '@/lib/supabase/client';

export async function uploadImage(file: File, userId: string): Promise<string> {
    try {
        // Validate file
        if (!file.type.startsWith('image/')) {
            throw new Error('File harus berupa gambar');
        }

        if (file.size > 10 * 1024 * 1024) {
            throw new Error('Ukuran file maksimal 10MB');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('toilet-photos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('toilet-photos')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function deleteImage(photoUrl: string): Promise<void> {
    try {
        // Extract path from URL
        const path = photoUrl.split('/toilet-photos/')[1];

        const { error } = await supabase.storage
            .from('toilet-photos')
            .remove([path]);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}
