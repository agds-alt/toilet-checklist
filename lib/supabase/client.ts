// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Config Check:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'LOADED ✅' : 'MISSING ❌');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials!');
    throw new Error('Missing Supabase environment variables. Check .env.local');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('❌ Supabase connection error:', error);
    } else {
        console.log('✅ Supabase connected successfully!');
    }
});