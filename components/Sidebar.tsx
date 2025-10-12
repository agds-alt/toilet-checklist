// ============================================
// 4. components/layout/Sidebar.tsx - FIXED NAVIGATION
// ============================================
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
    LayoutDashboard,
    Image,
    Users,
    LogOut,
    Settings,
    TrendingUp
} from 'lucide-react';

export default function NavigationSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            roles: ['admin', 'supervisor', 'cleaner']
        },
        {
            title: 'Analytics',
            icon: TrendingUp,
            href: '/dashboard/analytics',
            roles: ['admin', 'supervisor']
        },
        {
            title: 'Manage Photos',
            icon: Image,
            href: '/dashboard/photos',
            roles: ['admin', 'supervisor', 'cleaner']
        },
        {
            title: 'Manage Users',
            icon: Users,
            href: '/dashboard/users',
            roles: ['admin']
        },
        {
            title: 'Settings',
            icon: Settings,
            href: '/dashboard/settings',
            roles: ['admin', 'supervisor', 'cleaner']
        }
    ];

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(profile?.role || 'cleaner')
    );

    const handleNavigation = (href: string) => {
        console.log('Navigating to:', href);
        router.push(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r shadow-xl z-30">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🏢</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Proservice</h2>
                            <p className="text-xs text-slate-500">Toilet Checklist</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <span className="text-lg">
                                {profile?.role === 'admin' ? '👑' :
                                    profile?.role === 'supervisor' ? '👨‍💼' : '🧹'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 truncate">
                                {profile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {filteredMenu.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <button
                                        onClick={() => handleNavigation(item.href)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                : 'hover:bg-slate-100 text-slate-700'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.title}</span>
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
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}