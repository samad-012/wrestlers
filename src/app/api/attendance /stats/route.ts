import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

  // Fetch attendance records joined with student names
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      status,
      student_id,
      students ( name )
    `)
    .eq('date', date);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const presentCount = data.filter(record => record.status === 'present').length;

  return NextResponse.json({
    records: data,
    presentCount,
    totalRegistered: null // We'll handle this in the frontend
  });
}