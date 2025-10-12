// ============================================
// app/auth/confirm/route.ts - EMAIL CONFIRMATION CALLBACK
// ============================================
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (token_hash && type) {
        const supabase = createRouteHandlerClient({ cookies });

        const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        });

        if (!error) {
            // Redirect to dashboard or specified page
            return NextResponse.redirect(new URL(next, request.url));
        }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/auth/auth-error', request.url));
}