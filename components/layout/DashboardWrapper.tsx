// ============================================
// components/layout/DashboardWrapper.tsx - CLIENT COMPONENT
// ============================================
'use client';

import { useState } from 'react';
import NavigationSidebar from '@/components/layout/Sidebar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile } = useAuth();
    const [uploadSidebarOpen, setUploadSidebarOpen] = useState(false);

    // Only show upload sidebar for admin and cleaner
    const canUpload = profile?.role === 'admin' || profile?.role === 'cleaner';

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <NavigationSidebar
                onUploadClick={canUpload ? () => setUploadSidebarOpen(true) : undefined}
            />
            <main className="flex-1 ml-64">
                {children}
            </main>

            {/* Upload Sidebar - Global untuk semua pages */}
            {canUpload && (
                <Sidebar
                    isOpen={uploadSidebarOpen}
                    onClose={() => setUploadSidebarOpen(false)}
                    onUpload={async () => {
                        setUploadSidebarOpen(false);
                        // Refresh page to show new data
                        window.location.reload();
                    }}
                    selectedMonth={new Date().getMonth()}
                />
            )}
        </div>
    );
}