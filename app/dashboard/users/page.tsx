// ============================================
// app/dashboard/users/page.tsx - FIXED ADD USER FUNCTION
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserPlus, Edit, Trash2, X, Mail, Lock, User as UserIcon, Shield, AlertCircle } from 'lucide-react';
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
    const [error, setError] = useState('');
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
        setError('');

        // Validation
        if (!newUser.email || !newUser.password || !newUser.full_name) {
            setError('Mohon lengkapi semua field!');
            return;
        }

        if (newUser.password.length < 6) {
            setError('Password minimal 6 karakter!');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            setError('Format email tidak valid!');
            return;
        }

        setSubmitting(true);

        try {
            console.log('🔐 Starting user creation...');

            // Step 1: Create profile first (manual approach)
            // Generate a temporary user ID
            const tempUserId = crypto.randomUUID();

            // Try to sign up user through Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newUser.email,
                password: newUser.password,
                options: {
                    data: {
                        full_name: newUser.full_name,
                        role: newUser.role
                    },
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            });

            // If auth signup fails due to database trigger, try manual approach
            if (authError) {
                console.error('❌ Auth error (will try manual approach):', authError);

                // If it's a database error, we need to handle it differently
                if (authError.message.includes('Database error')) {
                    setError('Signup error detected. Please contact admin to check database trigger.');
                    throw new Error('Database trigger issue. Check Supabase SQL console.');
                }

                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error('User creation failed - no user returned');
            }

            console.log('✅ Auth user created:', authData.user.id);

            // Step 2: Wait for trigger to potentially create profile
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 3: Check if profile exists
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', authData.user.id)
                .single();

            // Step 4: Create profile manually if it doesn't exist
            if (!existingProfile) {
                console.log('⚠️ Creating profile manually...');

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: newUser.email,
                        full_name: newUser.full_name,
                        role: newUser.role,
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (profileError && profileError.code !== '23505') {
                    console.error('❌ Profile creation error:', profileError);
                    throw new Error(`Profile creation failed: ${profileError.message}`);
                }

                console.log('✅ Profile created manually');
            } else {
                console.log('✅ Profile exists from trigger');
            }

            // Success!
            alert('✅ User berhasil ditambahkan!');

            // Reset form
            setNewUser({
                email: '',
                password: '',
                full_name: '',
                role: 'cleaner'
            });

            setShowAddModal(false);
            await loadUsers();

        } catch (error: any) {
            console.error('❌ Add user error:', error);
            setError(error.message || 'Terjadi kesalahan saat menambahkan user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (!confirm(`Yakin ingin menghapus user ${userEmail}?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('id', userId);

            if (error) throw error;

            alert('✅ User berhasil dinonaktifkan!');
            await loadUsers();
        } catch (error) {
            console.error('Delete error:', error);
            alert('❌ Gagal menghapus user');
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">User Management</h1>
                        <p className="text-slate-600">Total: {users.length} users</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setError('');
                        }}
                        className="glass-button px-6 py-3 rounded-xl flex items-center gap-2"
                    >
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
                                        <div className="font-semibold text-slate-800">{user.full_name || 'No Name'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'supervisor' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card rounded-2xl p-8 max-w-md w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Add New User</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-red-800 text-sm">Error</p>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleAddUser} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={newUser.full_name}
                                            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                            required
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
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                            required
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
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="••••••••"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
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
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                                        >
                                            <option value="cleaner">Cleaner</option>
                                            <option value="supervisor">Supervisor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 glass-button px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                <span>Add User</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}