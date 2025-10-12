export const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const locations = [
    'Toilet Lobby',
    'Toilet Lt 1 Depan',
    'Toilet Lt 1 Belakang',
    'Toilet Lt 2 Depan',
    'Toilet Lt 2 Belakang',
    'Toilet Lt 3 Depan',
    'Toilet Lt 3 Belakang',
    'Toilet Security'
];

export const periods = [
    { name: 'Minggu ke-1', days: [1, 2, 3, 4, 5, 6, 7] },
    { name: 'Minggu ke-2', days: [8, 9, 10, 11, 12, 13, 14] },
    { name: 'Minggu ke-3', days: [15, 16, 17, 18, 19, 20, 21] },
    { name: 'Minggu ke-4', days: [22, 23, 24, 25, 26, 27, 28] }
];

export const getDataKey = (location: string, month: number, day: number): string => {
    return `${location}-${month}-${day}`;
};

export const getCellColor = (score: number | null): string => {
    if (!score) return 'bg-white hover:bg-gray-50';
    if (score >= 95) return 'bg-blue-50 text-blue-900 hover:bg-blue-100';
    if (score >= 85) return 'bg-green-50 text-green-900 hover:bg-green-100';
    if (score >= 75) return 'bg-yellow-50 text-yellow-900 hover:bg-yellow-100';
    return 'bg-red-50 text-red-900 hover:bg-red-100';
};

export const getAverageScore = (data: any): number => {
    const scores = Object.values(data)
        .filter((d: any) => d.score)
        .map((d: any) => d.score);

    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};