'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TrendingUp, Users, Image as ImageIcon, CheckCircle, Calendar } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState({
        totalRecords: 0,
        averageScore: 0,
        approvedCount: 0,
        excellentCount: 0,
        goodCount: 0,
        fairCount: 0,
        poorCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedMonth] = useState(new Date().getMonth());
    const [selectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadStats();
    }, [selectedMonth, selectedYear]);

    const loadStats = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_monthly_stats', {
                    p_month: selectedMonth,
                    p_year: selectedYear
                });

            if (error) throw error;
            if (data && data.length > 0) {
                setStats(data[0]);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Records',
            value: stats.totalRecords,
            icon: ImageIcon,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Average Score',
            value: stats.averageScore,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Approved',
            value: stats.approvedCount,
            icon: CheckCircle,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Excellent (95+)',
            value: stats.excellentCount,
            icon: TrendingUp,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
                <p className="text-slate-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedYear, selectedMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Score Distribution */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Score Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-700">Excellent</span>
                            <span className="text-2xl font-bold text-blue-700">{stats.excellentCount}</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${(stats.excellentCount / stats.totalRecords * 100) || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-green-700">Good</span>
                            <span className="text-2xl font-bold text-green-700">{stats.goodCount}</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${(stats.goodCount / stats.totalRecords * 100) || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-yellow-700">Fair</span>
                            <span className="text-2xl font-bold text-yellow-700">{stats.fairCount}</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                            <div
                                className="bg-yellow-600 h-2 rounded-full transition-all"
                                style={{ width: `${(stats.fairCount / stats.totalRecords * 100) || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-red-700">Poor</span>
                            <span className="text-2xl font-bold text-red-700">{stats.poorCount}</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                            <div
                                className="bg-red-600 h-2 rounded-full transition-all"
                                style={{ width: `${(stats.poorCount / stats.totalRecords * 100) || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
