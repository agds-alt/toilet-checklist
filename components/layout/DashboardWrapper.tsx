// ============================================
// components/layout/DashboardWrapper.tsx - WITH FOOTER & EXTRAS
// ============================================
'use client';

import { useState, useEffect } from 'react';
import NavigationSidebar from '@/components/layout/Sidebar';
import Sidebar from '@/components/Sidebar';
import ScoreLegendSidebar from '@/components/ScoreLegendSidebar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile } = useAuth();
    const [uploadSidebarOpen, setUploadSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Only show upload sidebar for admin and cleaner
    const canUpload = profile?.role === 'admin' || profile?.role === 'cleaner';

    // Listen to sidebar collapse state from localStorage
    useEffect(() => {
        // Initial check
        const checkCollapsed = () => {
            const saved = localStorage.getItem('sidebarCollapsed');
            if (saved) {
                setIsSidebarCollapsed(JSON.parse(saved));
            }
        };

        checkCollapsed();

        // Listen for storage changes (sidebar updates)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'sidebarCollapsed' && e.newValue) {
                setIsSidebarCollapsed(JSON.parse(e.newValue));
            }
        };

        // Custom event for same-window updates
        const handleCustom = (e: CustomEvent) => {
            setIsSidebarCollapsed(e.detail);
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('sidebarToggle' as any, handleCustom);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('sidebarToggle' as any, handleCustom);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            {/* Left Navigation Sidebar */}
            <NavigationSidebar
                onUploadClick={canUpload ? () => setUploadSidebarOpen(true) : undefined}
            />

            {/* Main content with dynamic margin and smooth transition */}
            <main
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {/* Page Content */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Footer */}
                <Footer />
            </main>

            {/* Right Score Legend Sidebar */}
            <ScoreLegendSidebar />

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

            {/* WhatsApp Floating Button */}
            <WhatsAppButton />
        </div>
    );
}