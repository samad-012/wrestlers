import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// --- NEW GET METHOD ---
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []); 
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- YOUR EXISTING POST METHOD ---
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    console.log("Attempting to insert student:", name);

    const { data, error } = await supabase
      .from('students')
      .insert([{ name, is_active: true }])
      .select();

    if (error) {
      console.error("Supabase Error Details:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error("Server Crash Details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}