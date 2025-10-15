// ============================================
// lib/storage/cloudinary-upload.ts - FIXED VERSION
// ============================================

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    created_at: string;
}

/**
 * Upload image directly to Cloudinary from client browser
 * @param file - Image file to upload
 * @param folder - Optional folder in Cloudinary (default: proservice-toilet)
 * @returns Public URL of uploaded image
 */
export async function uploadImageToCloudinary(
    file: File,
    folder: string = 'proservice-toilet'
): Promise<string> {

    console.log('🚀 Starting Cloudinary upload...');

    // 1. Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log('🔍 Config check:', {
        cloudName: cloudName ? '✅ Set' : '❌ Missing',
        uploadPreset: uploadPreset ? '✅ Set' : '❌ Missing'
    });

    if (!cloudName || !uploadPreset) {
        const missingVars = [];
        if (!cloudName) missingVars.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
        if (!uploadPreset) missingVars.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');

        throw new Error(
            `Missing Cloudinary config: ${missingVars.join(', ')}. Please check your .env.local file.`
        );
    }

    // 2. Validate file
    if (!file.type.startsWith('image/')) {
        throw new Error('File harus berupa gambar (JPG, PNG, atau WebP)');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 10MB');
    }

    console.log('✅ File validation passed:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    // 3. Prepare FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    // Add timestamp to filename for uniqueness
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    formData.append('public_id', `toilet-${timestamp}-${randomStr}`);

    // Optional: Add tags for easy management
    formData.append('tags', 'toilet-checklist,proservice');

    // 4. Upload to Cloudinary
    try {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        console.log('📤 Uploading to:', uploadUrl);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Cloudinary error:', errorData);
            throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
        }

        const data: CloudinaryUploadResult = await response.json();

        console.log('✅ Upload successful!', {
            url: data.secure_url,
            format: data.format,
            size: `${data.width}x${data.height}`,
            bytes: `${(data.bytes / 1024).toFixed(2)}KB`
        });

        // 5. Return secure HTTPS URL
        return data.secure_url;

    } catch (error: any) {
        console.error('❌ Cloudinary upload error:', error);

        if (error.message.includes('fetch')) {
            throw new Error('Network error: Tidak dapat terhubung ke Cloudinary. Periksa koneksi internet Anda.');
        }

        throw new Error(`Upload gagal: ${error.message}`);
    }
}

/**
 * Get optimized image URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: 'auto' | number;
        format?: 'auto' | 'jpg' | 'png' | 'webp';
    } = {}
): string {
    // If not a Cloudinary URL, return as is
    if (!url.includes('cloudinary.com')) {
        return url;
    }

    const { width = 800, height, quality = 'auto', format = 'auto' } = options;

    // Extract parts from URL
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    // Build transformation string
    const transformations = [
        width && `w_${width}`,
        height && `h_${height}`,
        quality && `q_${quality}`,
        format && `f_${format}`,
        'c_limit', // Maintain aspect ratio
    ]
        .filter(Boolean)
        .join(',');

    // Return optimized URL
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}

/**
 * Verify Cloudinary configuration
 * @returns boolean indicating if config is valid
 */
export function verifyCloudinaryConfig(): {
    valid: boolean;
    cloudName?: string;
    uploadPreset?: string;
    errors: string[];
} {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const errors: string[] = [];

    if (!cloudName) {
        errors.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    }

    if (!uploadPreset) {
        errors.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set');
    }

    return {
        valid: errors.length === 0,
        cloudName,
        uploadPreset,
        errors
    };
}