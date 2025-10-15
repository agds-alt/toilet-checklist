// lib/utils/error-handler.ts
export function getUserFriendlyError(error: any): string {
    if (error.message?.includes('duplicate key')) {
        return 'Data sudah ada untuk tanggal ini!';
    }
    if (error.message?.includes('foreign key')) {
        return 'Data terkait tidak ditemukan!';
    }
    return 'Terjadi kesalahan, silakan coba lagi.';
}