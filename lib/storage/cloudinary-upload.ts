// ============================================
// lib/storage/cloudinary-upload.ts - NEW FILE
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
    // 1. Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error(
            'Missing Cloudinary configuration. Please check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local'
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

    // 3. Prepare FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    // Add timestamp to filename for uniqueness
    const timestamp = Date.now();
    formData.append('public_id', `toilet-${timestamp}`);

    // Optional: Add tags for easy management
    formData.append('tags', 'toilet-checklist,proservice');

    // 4. Upload to Cloudinary (Direct from client browser!)
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload gagal');
        }

        const data: CloudinaryUploadResult = await response.json();

        // 5. Return secure HTTPS URL
        return data.secure_url;
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Upload gagal: ${error.message}`);
    }
}

/**
 * Delete image from Cloudinary (Optional - requires backend)
 * Note: Unsigned uploads cannot be deleted from client
 * You need API Secret for this, which should be kept on server
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
    // This requires backend API with API Secret
    // For now, we can just keep the images in Cloudinary
    // or implement backend deletion endpoint later
    console.warn('Delete from Cloudinary requires backend API');
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