// ============================================
// components/layout/Sidebar.tsx - WITH GPS & FRAUD DETECTION
// ============================================
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    LayoutDashboard,
    Image,
    Users,
    LogOut,
    TrendingUp,
    Upload,
    Menu,
    X,
    MapPin,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import LogoutConfirmation from '@/components/LogoutConfirmation';

export default function NavigationSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, signOut } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [badges, setBadges] = useState({
        users: 0,
        photos: 0,
        records: 0,
        todayRecords: 0,
        invalidGPS: 0, // NEW: For fraud detection
        withGPS: 0, // NEW: For GPS tracker
    });

    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved) setIsCollapsed(JSON.parse(saved));
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
        window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: newState }));
    };

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const { count: userCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                const { count: photoCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .not('photo_url', 'is', null);

                const { count: recordCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true });

                const today = new Date();
                const { count: todayCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('day', today.getDate())
                    .eq('month', today.getMonth() + 1)
                    .eq('year', today.getFullYear());

                // NEW: Count uploads with GPS
                const { count: gpsCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .not('latitude', 'is', null)
                    .not('longitude', 'is', null);

                // NEW: Count invalid GPS (fraud detection)
                const { count: invalidGPSCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_gps_valid', false);

                setBadges({
                    users: userCount || 0,
                    photos: photoCount || 0,
                    records: recordCount || 0,
                    todayRecords: todayCount || 0,
                    invalidGPS: invalidGPSCount || 0,
                    withGPS: gpsCount || 0,
                });
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        fetchBadges();
        const interval = setInterval(fetchBadges, 30000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            roles: ['admin', 'supervisor', 'cleaner'],
            badge: badges.todayRecords,
        },
        {
            title: 'Upload',
            icon: Upload,
            href: '/upload',
            roles: ['admin', 'cleaner'],
            highlight: true,
        },
        {
            title: 'Analytics',
            icon: TrendingUp,
            href: '/dashboard/analytics',
            roles: ['admin', 'supervisor'],
            badge: badges.records,
        },
        {
            title: 'Photos',
            icon: Image,
            href: '/dashboard/photos',
            roles: ['admin', 'supervisor', 'cleaner'],
            badge: badges.photos,
        },
        {
            title: 'GPS Tracker',
            icon: MapPin,
            href: '/dashboard/gps-map',
            roles: ['admin', 'supervisor'],
            badge: badges.withGPS,
            isNew: true, // NEW: Flag for new feature
        },
        {
            title: 'Fraud Detection',
            icon: AlertTriangle,
            href: '/dashboard/fraud-detection',
            roles: ['admin', 'supervisor'],
            badge: badges.invalidGPS,
            isNew: true, // NEW: Flag for new feature
            isAlert: true, // NEW: Red style for alerts
        },
        {
            title: 'Users',
            icon: Users,
            href: '/dashboard/users',
            roles: ['admin'],
            badge: badges.users,
        }
    ];

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(profile?.role || 'cleaner')
    );

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);

        toast.promise(
            async () => {
                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;

                    localStorage.removeItem('sidebarCollapsed');
                    await new Promise(resolve => setTimeout(resolve, 500));

                    window.location.href = '/login';
                } catch (error) {
                    console.error('Logout error:', error);
                    throw error;
                }
            },
            {
                loading: 'Logging out...',
                success: 'Logged out successfully! 👋',
                error: 'Failed to logout. Please try again.',
            }
        );
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-30 transition-all duration-300 ease-out overflow-hidden flex flex-col ${isCollapsed ? 'w-[64px]' : 'w-[240px]'
                    }`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between border-b border-gray-100 flex-shrink-0 px-4">
                    {/* Logo */}
                    <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                        }`}>
                        <img
                            src="/logo-prenacons.png"
                            alt="Logo"
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                            <h1 className="text-sm font-bold text-gray-900 whitespace-nowrap">Prenacons</h1>
                            <p className="text-[10px] text-gray-500 whitespace-nowrap">Toilet Checklist</p>
                        </div>
                    </div>

                    {/* Collapsed Logo - Center */}
                    {isCollapsed && (
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <img
                                src="/logo-prenacons.png"
                                alt="Logo"
                                className="w-8 h-8 rounded-lg"
                            />
                        </div>
                    )}

                    {/* Modern Toggle Button */}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group z-10"
                        aria-label="Toggle sidebar"
                    >
                        {isCollapsed ? (
                            <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                        ) : (
                            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                        )}
                    </button>
                </div>

                {/* User Info */}
                <div className={`py-3 border-b border-gray-100 flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-4'
                    }`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'
                        }`}>
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {profile?.full_name?.charAt(0) || 'U'}
                        </div>

                        <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                            }`}>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {profile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 capitalize truncate">
                                {profile?.role || 'cleaner'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    <div className={isCollapsed ? 'px-2' : 'px-3'}>
                        {filteredMenu.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={`group relative w-full flex items-center rounded-lg transition-all mb-1 ${isActive
                                            ? 'bg-gray-900 text-white'
                                            : item.highlight
                                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                : item.isAlert
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } ${isCollapsed
                                            ? 'justify-center px-0 py-2.5 w-12 h-12 mx-auto'
                                            : 'gap-3 px-3 py-2.5'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />

                                    {!isCollapsed && (
                                        <>
                                            <span className="text-sm font-medium flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                                                {item.title}
                                            </span>

                                            {/* NEW Badge - untuk fitur baru */}
                                            {item.isNew && !isActive && (
                                                <span className="flex-shrink-0 px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded">
                                                    NEW
                                                </span>
                                            )}

                                            {/* Count Badge */}
                                            {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                                                <span className={`flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-md flex items-center justify-center text-[10px] font-bold ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : item.isAlert
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-red-500 text-white'
                                                    }`}>
                                                    {item.badge > 99 ? '99+' : item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}

                                    {/* Collapsed Badge - Fixed positioning */}
                                    {isCollapsed && item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}

                                    {/* NEW indicator for collapsed mode */}
                                    {isCollapsed && item.isNew && !item.badge && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                                    )}

                                    {/* Tooltip for collapsed */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                            {item.title}
                                            {item.isNew && <span className="ml-1 text-blue-400">NEW</span>}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div className={`border-t border-gray-100 flex-shrink-0 ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'
                    }`}>
                    <button
                        onClick={handleLogout}
                        className={`group relative w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-all ${isCollapsed
                                ? 'justify-center px-0 py-2.5 w-12 h-12 mx-auto'
                                : 'gap-3 px-3 py-2.5'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />

                        {!isCollapsed && (
                            <span className="text-sm font-medium">Logout</span>
                        )}

                        {/* Tooltip for collapsed */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmation
                isOpen={showLogoutModal}
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
}