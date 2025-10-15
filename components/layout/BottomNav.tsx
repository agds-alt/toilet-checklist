'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Upload, FileText, Image, Shield } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard',
            color: 'blue'
        },
        {
            label: 'Upload',
            icon: Upload,
            path: '/upload',
            color: 'green',
            special: true // Highlighted button
        },
        {
            label: 'Reports',
            icon: FileText,
            path: '/reports',
            color: 'purple'
        },
        {
            label: 'Photos',
            icon: Image,
            path: '/photos',
            color: 'pink'
        },
        {
            label: 'Anti-Fraud',
            icon: Shield,
            path: '/anti-fraud',
            color: 'red'
        }
    ];

    const handleNavClick = (path: string) => {
        router.push(path);
    };

    return (
        <>
            {/* Bottom Navigation - Mobile Only */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
                <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        if (item.special) {
                            // Special Upload Button (Center, Elevated)
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavClick(item.path)}
                                    className="relative -mt-6"
                                >
                                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg"></div>
                                    <div className={`
                                        relative flex flex-col items-center justify-center
                                        w-14 h-14 rounded-full
                                        bg-gradient-to-br from-green-500 to-green-600
                                        shadow-lg hover:shadow-xl
                                        transform hover:scale-110 active:scale-95
                                        transition-all duration-200
                                        ${isActive ? 'ring-4 ring-green-200' : ''}
                                    `}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </button>
                            );
                        }

                        // Regular Nav Items
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavClick(item.path)}
                                className={`
                                    flex flex-col items-center justify-center
                                    min-w-[64px] py-1.5 px-2 rounded-xl
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className="relative">
                                    <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                                <span className={`
                                    text-[10px] font-medium mt-1 leading-tight
                                    ${isActive ? 'font-bold' : ''}
                                `}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Spacer for Bottom Nav - Mobile Only */}
            <div className="md:hidden h-20"></div>
        </>
    );
}