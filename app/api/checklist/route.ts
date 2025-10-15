import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET - Fetch checklist data
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '0');

    if (!month || !year) {
        return NextResponse.json(
            { error: 'Month and year are required' },
            { status: 400 }
        );
    }

    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch data
        const { data, error } = await supabase
            .from('checklist_data')
            .select(`
                *,
                uploaded_by_profile:profiles!checklist_data_uploaded_by_fkey(
                    id,
                    full_name,
                    email,
                    role
                )
            `)
            .eq('month', month)
            .eq('year', year)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
            count: data?.length || 0
        });

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new checklist entry
export async function POST(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { location, day, month, year, score, photo_url } = body;

        // Validation
        if (!location || !day || !month || !year || score === undefined || !photo_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert data
        const { data, error } = await supabase
            .from('checklist_data')
            .insert({
                location,
                day,
                month,
                year,
                score,
                photo_url,
                uploaded_by: session.user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
            message: 'Data berhasil disimpan'
        });

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}