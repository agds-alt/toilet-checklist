// ============================================
// components/layout/Sidebar.tsx - WITH STATE SYNC (NO GAP)
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
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface NavigationSidebarProps {
    onUploadClick?: () => void;
}

export default function NavigationSidebar({ onUploadClick }: NavigationSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, signOut } = useAuth();

    // Collapse state - saved to localStorage
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Badge counts
    const [badges, setBadges] = useState({
        users: 0,
        photos: 0,
        records: 0,
        todayRecords: 0
    });

    // Load collapse state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved) {
            const collapsed = JSON.parse(saved);
            setIsCollapsed(collapsed);
            updateBodyMargin(collapsed);
        }
    }, []);

    // Update body margin when sidebar state changes
    const updateBodyMargin = (collapsed: boolean) => {
        document.documentElement.style.setProperty(
            '--sidebar-width',
            collapsed ? '80px' : '256px'
        );
    };

    // Fetch badge counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Count users
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true);

                // Count photos (this month)
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                const { count: photosCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('month', currentMonth)
                    .eq('year', currentYear)
                    .not('photo_url', 'is', null);

                // Count all records (this month)
                const { count: recordsCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('month', currentMonth)
                    .eq('year', currentYear);

                // Count today's records
                const today = new Date().getDate();
                const { count: todayCount } = await supabase
                    .from('checklist_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('day', today)
                    .eq('month', currentMonth)
                    .eq('year', currentYear);

                setBadges({
                    users: usersCount || 0,
                    photos: photosCount || 0,
                    records: recordsCount || 0,
                    todayRecords: todayCount || 0
                });
            } catch (error) {
                console.error('Error fetching badge counts:', error);
            }
        };

        fetchCounts();

        // Refresh counts every 30 seconds
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
        updateBodyMargin(newState);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            roles: ['admin', 'supervisor', 'cleaner'],
            action: 'navigate',
            badge: badges.todayRecords,
            badgeColor: 'bg-blue-500'
        },
        {
            title: 'Upload Data',
            icon: Upload,
            href: '#',
            roles: ['admin', 'cleaner'],
            action: 'upload',
            highlight: true,
            badge: null
        },
        {
            title: 'Analytics',
            icon: TrendingUp,
            href: '/dashboard/analytics',
            roles: ['admin', 'supervisor'],
            action: 'navigate',
            badge: badges.records,
            badgeColor: 'bg-purple-500'
        },
        {
            title: 'Manage Photos',
            icon: Image,
            href: '/dashboard/photos',
            roles: ['admin', 'supervisor', 'cleaner'],
            action: 'navigate',
            badge: badges.photos,
            badgeColor: 'bg-pink-500'
        },
        {
            title: 'Manage Users',
            icon: Users,
            href: '/dashboard/users',
            roles: ['admin'],
            action: 'navigate',
            badge: badges.users,
            badgeColor: 'bg-orange-500'
        }
    ];

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(profile?.role || 'cleaner')
    );

    const handleMenuClick = (item: any) => {
        if (item.action === 'upload' && onUploadClick) {
            onUploadClick();
        } else if (item.action === 'navigate') {
            router.push(item.href);
        }
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen glass-card border-r shadow-xl z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b relative">
                    <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'
                        }`}>
                        {/* Logo Image - Always centered when collapsed */}
                        <div className="flex-shrink-0">
                            <img
                                src="/logo-prenacons.png"
                                alt="Prenacons Logo"
                                className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'
                                    }`}
                            />
                        </div>

                        {/* Logo Text - Hidden when collapsed */}
                        <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                            <h2 className="font-bold text-slate-800 whitespace-nowrap">Prenacons</h2>
                            <p className="text-xs text-slate-500 whitespace-nowrap">Toilet Checklist</p>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b">
                    <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'
                        }`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">
                                {profile?.role === 'admin' ? '👑' :
                                    profile?.role === 'supervisor' ? '👨‍💼' : '🧹'}
                            </span>
                        </div>
                        <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                            <p className="font-semibold text-sm text-slate-800 truncate whitespace-nowrap">
                                {profile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 capitalize whitespace-nowrap">{profile?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {filteredMenu.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={index}>
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        title={isCollapsed ? item.title : undefined}
                                        className={`w-full flex items-center transition-all group relative ${item.highlight
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700'
                                                : isActive
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                    : 'hover:bg-slate-100 text-slate-700'
                                            } ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'} rounded-xl`}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'animate-bounce-subtle' : ''
                                            }`} />

                                        <span className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                            }`}>
                                            {item.title}
                                        </span>

                                        {/* Badge - Show when expanded OR when collapsed (absolute positioned) */}
                                        {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                                            <>
                                                {/* Badge when expanded */}
                                                {!isCollapsed && (
                                                    <span className={`ml-auto px-2 py-0.5 ${item.badgeColor || 'bg-red-500'} text-white text-xs font-bold rounded-full min-w-[24px] text-center`}>
                                                        {item.badge > 99 ? '99+' : item.badge}
                                                    </span>
                                                )}

                                                {/* Badge when collapsed - absolute positioned */}
                                                {isCollapsed && (
                                                    <span className={`absolute -top-1 -right-1 w-5 h-5 ${item.badgeColor || 'bg-red-500'} text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg`}>
                                                        {item.badge > 9 ? '9+' : item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        {/* "New" badge for upload button */}
                                        {item.highlight && !isCollapsed && (
                                            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                New
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleSignOut}
                        title={isCollapsed ? 'Logout' : undefined}
                        className={`w-full flex items-center hover:bg-red-50 text-red-600 transition-all rounded-xl ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
}