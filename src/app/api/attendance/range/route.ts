import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and End dates are required" }, { status: 400 });
    }

    // Fetch all attendance records in the range, joined with student info
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        student_id,
        students ( name ),
        status,
        date
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Aggregate attendance by student
    const studentAttendanceMap: Record<string, { name: string; total: number; present: number }> = {};

    data?.forEach(record => {
      const studentId = record.student_id;
      
      // Fix: Access the first element of the students array returned by Supabase join
      const studentInfo = Array.isArray(record.students) ? record.students[0] : record.students;

      if (!studentAttendanceMap[studentId]) {
        studentAttendanceMap[studentId] = {
          name: studentInfo?.name || 'Unknown Student',
          total: 0,
          present: 0,
        };
      }

      studentAttendanceMap[studentId].total += 1;
      if (record.status === 'present') {
        studentAttendanceMap[studentId].present += 1;
      }
    });

    // Format response and calculate percentages safely
    const result = Object.keys(studentAttendanceMap).map(studentId => {
      const { name, total, present } = studentAttendanceMap[studentId];
      const percentage = total > 0 ? (present / total) * 100 : 0;

      return {
        studentId,
        name,
        total,
        present,
        percentage: percentage.toFixed(2),
      };
    });

    // Optional: Sort by name alphabetically
    result.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}