
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('projects')
        .select('slug, title, technical_summary, demo_checklist');

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
}
