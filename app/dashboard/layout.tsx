// ============================================
// app/dashboard/layout.tsx - FIXED (Server Component)
// ============================================
import DashboardWrapper from '@/components/layout/DashboardWrapper';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedLayout>
            <DashboardWrapper>
                {children}

            </DashboardWrapper>
        </ProtectedLayout>
    );
}