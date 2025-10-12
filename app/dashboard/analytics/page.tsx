'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TrendingUp, Image as ImageIcon, CheckCircle, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
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

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Get current month stats
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const { data, error } = await supabase
                .from('checklist_data')
                .select('score, approved_by')
                .eq('month', currentMonth)
                .eq('year', currentYear);

            if (error) throw error;

            const records = data || [];
            const scores = records.map(r => r.score);

            setStats({
                totalRecords: records.length,
                averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
                approvedCount: records.filter(r => r.approved_by).length,
                excellentCount: scores.filter(s => s >= 95).length,
                goodCount: scores.filter(s => s >= 85 && s < 95).length,
                fairCount: scores.filter(s => s >= 75 && s < 85).length,
                poorCount: scores.filter(s => s < 75).length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <ImageIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Total Records</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.totalRecords}</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Average Score</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.averageScore}</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Approved</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.approvedCount}</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-yellow-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Excellent (95+)</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.excellentCount}</p>
                    </div>
                </div>
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
                                style={{ width: `${stats.totalRecords ? (stats.excellentCount / stats.totalRecords * 100) : 0}%` }}
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
                                style={{ width: `${stats.totalRecords ? (stats.goodCount / stats.totalRecords * 100) : 0}%` }}
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
                                style={{ width: `${stats.totalRecords ? (stats.fairCount / stats.totalRecords * 100) : 0}%` }}
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
                                style={{ width: `${stats.totalRecords ? (stats.poorCount / stats.totalRecords * 100) : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}