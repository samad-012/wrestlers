import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { studentIds, date, status } = await request.json()

  // Bulk insert for the "Select All" feature
  const { data, error } = await supabase
    .from('attendance')
    .insert(
      studentIds.map((id: string) => ({
        student_id: id,
        date: date,
        status: status,
      }))
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Attendance updated successfully' })
}