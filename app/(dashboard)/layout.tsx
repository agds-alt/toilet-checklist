// ============================================
// 1. app/(dashboard)/layout.tsx - DASHBOARD LAYOUT WITH SIDEBAR
// ============================================
import NavigationSidebar from '@/components/layout/Sidebar';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedLayout>
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
                <NavigationSidebar />
                <main className="flex-1 ml-64">
                    {children}
                </main>
            </div>
        </ProtectedLayout>
    );
}
