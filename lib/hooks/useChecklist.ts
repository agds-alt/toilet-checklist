// lib/hooks/useChecklist.ts
import useSWR from 'swr';

// Fetcher function untuk SWR
const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to fetch' }));
        throw new Error(error.message || 'Failed to fetch data');
    }
    return res.json();
};

interface UseChecklistOptions {
    month: number;
    year: number;
    enabled?: boolean;
}

export function useChecklistData({ month, year, enabled = true }: UseChecklistOptions) {
    const { data, error, mutate, isLoading } = useSWR(
        enabled ? `/api/checklist?month=${month}&year=${year}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // Cache 5 detik
            refreshInterval: 0, // Tidak auto-refresh
        }
    );

    return {
        data: data?.data || [],
        isLoading,
        isError: error,
        error: error?.message,
        refresh: mutate,
        mutate,
    };
}

// Hook untuk single checklist item
export function useChecklistItem(id: string) {
    const { data, error, mutate, isLoading } = useSWR(
        id ? `/api/checklist/${id}` : null,
        fetcher
    );

    return {
        data: data?.data,
        isLoading,
        isError: error,
        error: error?.message,
        refresh: mutate,
    };
}