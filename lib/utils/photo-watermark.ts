// lib/utils/photo-watermark.ts

interface WatermarkData {
    location: string;
    timestamp: Date;
    coords?: {
        latitude: number;
        longitude: number;
    };
}

export async function addWatermarkToPhoto(
    file: File,
    data: WatermarkData
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas context not available');

                    // Set canvas size sama dengan image
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Format data
                    const dateStr = data.timestamp.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });
                    const timeStr = data.timestamp.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });

                    const coordsStr = data.coords
                        ? `${data.coords.latitude.toFixed(6)}°, ${data.coords.longitude.toFixed(6)}°`
                        : 'GPS unavailable';

                    // Calculate font size based on image width (responsive)
                    const baseFontSize = Math.max(img.width / 30, 24);
                    const lineHeight = baseFontSize * 1.4;

                    // Padding
                    const padding = baseFontSize * 0.8;
                    const startY = img.height - (lineHeight * 4) - padding;

                    // Style text
                    ctx.font = `bold ${baseFontSize}px Inter, system-ui, -apple-system, sans-serif`;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';

                    // Semi-transparent background untuk readability
                    const maxWidth = Math.max(
                        ctx.measureText(`📍 ${data.location}`).width,
                        ctx.measureText(`📅 ${dateStr}`).width,
                        ctx.measureText(`🕐 ${timeStr}`).width,
                        ctx.measureText(`🌍 ${coordsStr}`).width
                    );

                    const bgHeight = (lineHeight * 4) + (padding * 2);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                    ctx.fillRect(0, img.height - bgHeight, maxWidth + (padding * 2), bgHeight);

                    // Draw text with shadow untuk better readability
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillStyle = '#FFFFFF';

                    // Draw each line
                    ctx.fillText(`📍 ${data.location}`, padding, startY);
                    ctx.fillText(`📅 ${dateStr}`, padding, startY + lineHeight);
                    ctx.fillText(`🕐 ${timeStr}`, padding, startY + (lineHeight * 2));
                    ctx.fillText(`🌍 ${coordsStr}`, padding, startY + (lineHeight * 3));

                    // Convert canvas to blob
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Failed to create blob'));
                                return;
                            }

                            // Create new file with watermark
                            const watermarkedFile = new File(
                                [blob],
                                file.name,
                                { type: file.type }
                            );

                            resolve(watermarkedFile);
                        },
                        file.type,
                        0.95 // Quality
                    );
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Get user GPS coordinates
export async function getUserCoordinates(): Promise<{
    latitude: number;
    longitude: number;
} | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported');
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}