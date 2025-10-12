// ============================================
// components/layout/RoleGuard.tsx
// ============================================
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
    const { profile } = useAuth();

    if (!profile || !allowedRoles.includes(profile.role)) {
        return fallback || null;
    }

    return <>{children}</>;
}