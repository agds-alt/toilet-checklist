'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner'; // ← Import toast
import { UserPlus, Edit, Trash2, X, Mail, Lock, User as UserIcon, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import RoleGuard from '@/components/layout/RoleGuard';

interface NewUser {
    email: string;
    password: string;
    full_name: string;
    role: 'admin' | 'supervisor' | 'cleaner';
}

const ITEMS_PER_PAGE = 20; // ← Constant

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // ✅ ADD PAGINATION STATE
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [newUser, setNewUser] = useState<NewUser>({
        email: '',
        password: '',
        full_name: '',
        role: 'cleaner'
    });

    useEffect(() => {
        loadUsers();
    }, [page]); // ← Reload when page changes

    // ✅ UPDATED loadUsers dengan pagination
    const loadUsers = async () => {
        try {
            setLoading(true);

            // Calculate range
            const from = (page - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            // Fetch with count
            const { data, error, count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            setUsers(data || []);
            setTotalCount(count || 0);
            setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Gagal memuat data users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!newUser.email || !newUser.password || !newUser.full_name) {
            // ❌ BEFORE: setError('Mohon lengkapi semua field!');
            // ✅ AFTER:
            toast.error('Mohon lengkapi semua field!');
            return;
        }

        if (newUser.password.length < 6) {
            toast.error('Password minimal 6 karakter!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            toast.error('Format email tidak valid!');
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading('Membuat user baru...');

        try {
            // Create auth user
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
            if (!authData.user) throw new Error('User creation failed');

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    email: newUser.email,
                    full_name: newUser.full_name,
                    role: newUser.role,
                    is_active: true
                });

            if (profileError) throw profileError;

            toast.success('User berhasil dibuat!', { id: toastId });
            setShowAddModal(false);
            setNewUser({ email: '', password: '', full_name: '', role: 'cleaner' });
            loadUsers();

        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error(error.message || 'Gagal membuat user', { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;

        const toastId = toast.loading('Menghapus user...');

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            toast.success('User berhasil dihapus!', { id: toastId });
            loadUsers();

        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error('Gagal menghapus user', { id: toastId });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-gray-600">
                            Showing {users.length} of {totalCount} users
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <UserPlus size={20} />
                        Add User
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ PAGINATION CONTROLS */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Page {page} of {totalPages} ({totalCount} total users)
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-4 py-2 border rounded-lg ${page === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Add User Modal - sama seperti sebelumnya */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        {/* Modal content... */}
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}