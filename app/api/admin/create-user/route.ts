// app/api/admin/create-user/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify admin role FIRST
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (profile?.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // NOW create user
    const { email, password, full_name, role } = await request.json();
    // ... rest of signup logic
}