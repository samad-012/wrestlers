import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    // Log what we are trying to send
    console.log("Attempting to insert student:", name);

    const { data, error } = await supabase
      .from('students')
      .insert([{ name, is_active: true }])
      .select();

    if (error) {
      // THIS WILL PRINT THE ACTUAL DATABASE ERROR IN YOUR TERMINAL
      console.error("Supabase Error Details:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error("Server Crash Details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}