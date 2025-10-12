// ============================================
// app/page.tsx - MOBILE-FIRST LANDING PAGE
// ============================================
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import {
    Activity,
    Shield,
    TrendingUp,
    Users,
    Camera,
    CheckCircle2,
    ArrowRight,
    BarChart3,
    Clock
} from 'lucide-react';

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-lg sm:text-xl">🏢</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-bold text-sm sm:text-base md:text-lg truncate">Proservice Indonesia</h1>
                                <p className="text-[10px] sm:text-xs text-blue-200 hidden sm:block">Toilet Monitoring System</p>
                            </div>
                        </div>
                        <Link
                            href="/login"
                            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base flex-shrink-0"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                                <span className="text-xs sm:text-sm font-medium text-blue-200">Real-time Monitoring</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Sistem Monitoring
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Kebersihan Toilet
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
                                Platform digital modern untuk monitoring, tracking, dan analytics kebersihan toilet
                                secara real-time dengan bukti foto dan scoring system.
                            </p>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/login"
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:scale-105 transition-all"
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all text-center"
                                >
                                    Sign Up Free
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                                <div className="space-y-1">
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-400">24/7</div>
                                    <div className="text-xs sm:text-sm text-blue-200">Monitoring</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl sm:text-3xl font-bold text-green-400">95%</div>
                                    <div className="text-xs sm:text-sm text-blue-200">Compliance</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-400">100+</div>
                                    <div className="text-xs sm:text-sm text-blue-200">Locations</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Dashboard Preview */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Preview Card 1 */}
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-xs sm:text-sm text-blue-100">Average Score</div>
                                                    <div className="text-2xl sm:text-3xl font-bold">95</div>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-300" />
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                                            <div className="bg-white h-1.5 sm:h-2 rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>

                                    {/* Preview Card 2 */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                                            <div className="text-xl sm:text-2xl font-bold mb-1">1,234</div>
                                            <div className="text-xs sm:text-sm text-slate-400">Photos</div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
                                            <div className="text-xl sm:text-2xl font-bold mb-1">98%</div>
                                            <div className="text-xs sm:text-sm text-slate-400">Approved</div>
                                        </div>
                                    </div>

                                    {/* Preview Card 3 */}
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs sm:text-sm text-slate-400">Last Updated</div>
                                            <div className="font-semibold text-sm sm:text-base truncate">2 minutes ago</div>
                                        </div>
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Powerful Features</h2>
                        <p className="text-base sm:text-xl text-blue-200">Everything you need to maintain cleanliness standards</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: Camera,
                                title: 'Photo Documentation',
                                description: 'Upload dan simpan bukti foto setiap pembersihan dengan timestamp otomatis',
                                color: 'from-blue-500 to-blue-600'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Real-time Analytics',
                                description: 'Dashboard analytics dengan score tracking dan performance metrics',
                                color: 'from-green-500 to-green-600'
                            },
                            {
                                icon: Users,
                                title: 'Multi-role Access',
                                description: 'Admin, Supervisor, dan Cleaner dengan permission berbeda',
                                color: 'from-purple-500 to-purple-600'
                            },
                            {
                                icon: Shield,
                                title: 'Secure & Reliable',
                                description: 'Data aman dengan authentication dan backup otomatis',
                                color: 'from-orange-500 to-orange-600'
                            },
                            {
                                icon: BarChart3,
                                title: 'Detailed Reports',
                                description: 'Export laporan lengkap ke Excel dan PDF format',
                                color: 'from-pink-500 to-pink-600'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Approval Workflow',
                                description: 'Supervisor dapat approve dan validate setiap cleaning activity',
                                color: 'from-cyan-500 to-cyan-600'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all group">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-blue-200">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-base sm:text-xl text-blue-200 mb-6 sm:mb-8">
                        Join Proservice Indonesia dan tingkatkan standar kebersihan Anda
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Create Free Account
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
                        >
                            Login to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 sm:py-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center text-blue-200 text-sm sm:text-base">
                    <p>&copy; 2025 Proservice Indonesia. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}