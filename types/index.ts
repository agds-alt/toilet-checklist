// ============================================
// types/index.ts - UPDATE
// ============================================
export type UserRole = 'admin' | 'supervisor' | 'cleaner';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface ChecklistData {
    id: string;
    location: string;
    day: number;
    month: number;
    year: number;
    score: number;
    photo_url: string | null;
    uploaded_by: string;
    approved_by: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ChecklistRecord {
    [key: string]: ChecklistData;
}
