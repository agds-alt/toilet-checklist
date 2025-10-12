// ============================================
// lib/auth/auth-context.tsx - FIXED STRUCTURE
// ============================================
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: 'admin' | 'supervisor' | 'cleaner';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('🔐 Session check:', session ? 'Logged in' : 'Not logged in');
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('🔐 Auth state changed:', _event);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            console.log('👤 Fetching profile for:', userId);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('❌ Profile fetch error:', error);
                if (error.code === 'PGRST116') {
                    console.log('⚠️ Profile not found');
                }
                throw error;
            }

            console.log('✅ Profile loaded:', data);
            setProfile(data);
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, fullName: string, role: string) => {
        try {
            console.log('🔐 Starting signup process...');

            // Step 1: Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    },
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (authError) {
                console.error('❌ Auth signup error:', authError);
                throw authError;
            }

            if (!authData.user) {
                throw new Error('Signup failed - no user returned');
            }

            console.log('✅ Auth user created:', authData.user.id);

            // Step 2: Wait a bit for the trigger to execute
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 3: Check if profile was created by trigger
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', authData.user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('❌ Error checking profile:', checkError);
            }

            // Step 4: If profile doesn't exist, create it manually
            if (!existingProfile) {
                console.log('⚠️ Profile not created by trigger, creating manually...');

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: email,
                        full_name: fullName,
                        role: role,
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (profileError && profileError.code !== '23505') {
                    console.error('❌ Profile creation error:', profileError);
                    throw new Error(`Failed to create profile: ${profileError.message}`);
                }

                console.log('✅ Profile created manually');
            } else {
                console.log('✅ Profile already exists from trigger');
            }

        } catch (error: any) {
            console.error('❌ Signup process error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);