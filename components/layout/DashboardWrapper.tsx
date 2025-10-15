// ============================================
// components/layout/DashboardWrapper.tsx - CLEANED
// ============================================
'use client';

import { useState, useEffect } from 'react';
import NavigationSidebar from '@/components/layout/Sidebar';

import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function DashboardWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <NavigationSidebar />

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

       

            {/* WhatsApp Floating Button */}
            <WhatsAppButton />
        </div>
    );
}