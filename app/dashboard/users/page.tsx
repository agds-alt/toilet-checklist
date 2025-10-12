// ============================================
// app/dashboard/users/page.tsx - WORKING ADD USER
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserPlus, Edit, Trash2, X, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import RoleGuard from '@/components/layout/RoleGuard';

interface NewUser {
    email: string;
    password: string;
    full_name: string;
    role: 'admin' | 'supervisor' | 'cleaner';
}

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newUser, setNewUser] = useState<NewUser>({
        email: '',
        password: '',
        full_name: '',
        role: 'cleaner'
    });

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

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!newUser.email || !newUser.password || !newUser.full_name) {
            alert('⚠️ Mohon lengkapi semua field!');
            return;
        }

        if (newUser.password.length < 6) {
            alert('⚠️ Password minimal 6 karakter!');
            return;
        }

        setSubmitting(true);

        try {
            // Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newUser.email,
                password: newUser.password,
                options: {
                    data: {
                        full_name: newUser.full_name,
                        role: newUser.role
                    }
                }
            });

            if (authError) throw authError;

            // If signup successful, create profile manually (in case trigger doesn't work)
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: newUser.email,
                        full_name: newUser.full_name,
                        role: newUser.role,
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (profileError && profileError.code !== '23505') { // Ignore duplicate error
                    console.error('Profile creation error:', profileError);
                }
            }

            alert('✅ User berhasil ditambahkan!');

            // Reset form
            setNewUser({
                email: '',
                password: '',
                full_name: '',
                role: 'cleaner'
            });

            setShowAddModal(false);

            // Reload users
            await loadUsers();

        } catch (error: any) {
            console.error('Add user error:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (!confirm(`Yakin ingin menghapus user ${userEmail}?`)) return;

        try {
            // Note: Deleting auth users requires admin privileges
            // For now, we'll just deactivate the profile
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('id', userId);

            if (error) throw error;

            alert('✅ User berhasil dinonaktifkan!');
            await loadUsers();
        } catch (error: any) {
            console.error('Delete error:', error);
            alert(`❌ Error: ${error.message}`);
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
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">User Management</h1>
                        <p className="text-slate-600">Total: {users.length} users</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="glass-button px-6 py-3 rounded-xl flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                {/* Users Table */}
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
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors">
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

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                    <UserPlus className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Add New User</h2>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                disabled={submitting}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddUser} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={newUser.full_name}
                                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="John Doe"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="user@example.com"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Minimal 6 karakter"
                                        required
                                        disabled={submitting}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Role
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                        className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                                        required
                                        disabled={submitting}>
                                        <option value="cleaner">Cleaner 🧹</option>
                                        <option value="supervisor">Supervisor 👨‍💼</option>
                                        <option value="admin">Admin 👑</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors disabled:opacity-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 glass-button rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Create User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RoleGuard>
    );
}