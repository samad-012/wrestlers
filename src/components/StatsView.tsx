"use client";
import { useState, useEffect } from "react"; // 1. Add useEffect
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StatsView() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false); // 2. State for hydration

  // 3. Set mounted to true on load
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStats = async (r: DateRange) => {
    if (!r.from || !r.to) return;
    const res = await fetch('/api/attendance/range', {
      method: 'POST',
      body: JSON.stringify({
        startDate: format(r.from, 'yyyy-MM-dd'),
        endDate: format(r.to, 'yyyy-MM-dd')
      })
    });
    const result = await res.json();
    setData(result);
  };

  // 4. Return null or a skeleton until mounted
  if (!mounted) return <div className="p-4 border rounded-xl bg-white h-[350px] animate-pulse" />;

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(r) => { 
                        setRange(r); 
                        if (r?.from && r?.to) { // Only fetch when both dates are selected
                        fetchStats(r); 
                    } 
                }}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Days Present</TableHead>
              <TableHead>Total Classes</TableHead>
              <TableHead>Attendance %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? data.map((item) => (
              <TableRow key={item.studentId}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{item.present}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell className="text-green-600 font-semibold">{item.percentage}%</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Select a date range to view statistics
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}