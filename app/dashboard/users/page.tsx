// ============================================
// 4. app/(dashboard)/users/page.tsx - USER MANAGEMENT (ADMIN ONLY)
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserPlus, Edit, Trash2, Shield, User } from 'lucide-react';
import RoleGuard from '@/components/layout/RoleGuard';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return '👑';
            case 'supervisor': return '👨‍💼';
            case 'cleaner': return '🧹';
            default: return '👤';
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'supervisor':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cleaner':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">User Management</h1>
                        <p className="text-slate-600">Total: {users.length} users</p>
                    </div>
                    <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">User</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Joined</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-xl">
                                                {getRoleIcon(user.role)}
                                            </div>
                                            <span className="font-semibold text-slate-800">{user.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold border-2 ${getRoleBadge(user.role)} capitalize`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </RoleGuard>
    );
}