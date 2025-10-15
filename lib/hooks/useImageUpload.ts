// lib/hooks/useImageUpload.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImageToCloudinary } from '@/lib/storage/cloudinary-upload';

interface UploadOptions {
    folder?: string;
    onProgress?: (progress: number) => void;
}

export function useImageUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File, options?: UploadOptions): Promise<string | null> => {
        setUploading(true);
        setProgress(0);
        setError(null);

        const toastId = toast.loading('📤 Mengupload gambar...');

        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('File harus berupa gambar (JPG, PNG, WebP)');
            }

            if (file.size > 10 * 1024 * 1024) {
                throw new Error('Ukuran file maksimal 10MB');
            }

            // Simulate progress
            setProgress(20);
            options?.onProgress?.(20);

            // Upload to Cloudinary
            const url = await uploadImageToCloudinary(
                file,
                options?.folder || 'proservice-toilet'
            );

            setProgress(100);
            options?.onProgress?.(100);

            toast.success('✅ Upload berhasil!', { id: toastId });
            return url;

        } catch (err: any) {
            const errorMessage = err.message || 'Upload gagal';
            setError(errorMessage);
            toast.error(`❌ ${errorMessage}`, { id: toastId });
            return null;

        } finally {
            setUploading(false);
            setTimeout(() => {
                setProgress(0);
                setError(null);
            }, 2000);
        }
    };

    const reset = () => {
        setUploading(false);
        setProgress(0);
        setError(null);
    };

    return {
        upload,
        uploading,
        progress,
        error,
        reset
    };
}