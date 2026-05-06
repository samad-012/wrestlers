"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronRight, Activity, Flame, CalendarDays, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChartContainer } from "@/components/ui/chart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Navbar } from "@/components/Navbar";

export default function RosterPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [studentStats, setStudentStats] = useState({ attended: 0, total: 1 });

  useEffect(() => { 
    fetchActiveStudents(); 
  }, []);

  useEffect(() => { 
    fetchHistoryAttendance(); 
  }, [viewDate]);

  const fetchActiveStudents = async () => {
    // We only show 'active' students on the main analytics roster
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("is_active", true) 
      .order("name", { ascending: true });
    if (data) setStudents(data);
  };

  const fetchHistoryAttendance = async () => {
    const formattedDate = format(viewDate, "yyyy-MM-dd");
    const { data } = await supabase.from("attendance").select("student_id").eq("date", formattedDate);
    setHistoryIds(data ? data.map(i => i.student_id) : []);
  };

  const fetchIndividualStats = async (studentId: string) => {
    const { count: attended } = await supabase.from("attendance").select("*", { count: 'exact', head: true }).eq("student_id", studentId);
    const { data: totalDays } = await supabase.from("attendance").select("date");
    const uniqueDays = new Set(totalDays?.map(d => d.date)).size;
    setStudentStats({ attended: attended || 0, total: uniqueDays || 1 });
  };

  const chartData = [
    { name: "Attended", value: studentStats.attended, color: "#10b981" },
    { name: "Absent", value: Math.max(0, studentStats.total - studentStats.attended), color: "#f1f5f9" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Navbar />
      
      <div className="max-w-md mx-auto p-4 pt-8 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-end px-2">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Overview</p>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">students list</h2>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-2xl font-bold bg-white border-slate-200 shadow-sm gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                {format(viewDate, "MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[2rem] overflow-hidden shadow-2xl border-none" align="end">
              <Calendar mode="single" selected={viewDate} onSelect={(d) => d && setViewDate(d)} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {students.map(student => (
            <Sheet key={student.id}>
              <SheetTrigger asChild>
                <div 
                  onClick={() => fetchIndividualStats(student.id)} 
                  className="group bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-primary/20 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-inner ${historyIds.includes(student.id) ? 'bg-primary' : 'bg-slate-200 text-slate-400'}`}>
                      {student.name.split(' ').map((n:any) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{student.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <div className={`w-1.5 h-1.5 rounded-full ${historyIds.includes(student.id) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {historyIds.includes(student.id) ? "Present" : "Absent"}
                         </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </SheetTrigger>

              <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] bg-slate-50 border-none p-0 overflow-hidden">
                <div className="h-2 w-12 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
                <div className="p-8 space-y-6 overflow-y-auto h-full pb-32">
                  <header>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Performance Data</p>
                    <h3 className="text-4xl font-black tracking-tighter text-slate-900">{student.name}</h3>
                  </header>

                  {/* Consistency Chart */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center border border-white">
                    <div className="w-full max-w-[200px] aspect-square relative">
                      <ChartContainer config={{}} className="w-full h-full">
                        <PieChart>
                          <Pie data={chartData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                            <Label
                              content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                  return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-4xl font-black">
                                        {Math.round((studentStats.attended / studentStats.total) * 100)}%
                                      </tspan>
                                      <tspan x={viewBox.cx} y={viewBox.cy + 24} className="fill-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        Consistency
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-emerald-500 p-6 rounded-[2rem] text-white flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl"><TrendingUp className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Days</p>
                        <p className="text-2xl font-bold">{studentStats.attended} Sessions</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                      <div className="bg-orange-100 p-3 rounded-2xl"><Flame className="w-6 h-6 text-orange-600" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {studentStats.attended > 5 ? "Elite Athlete" : "In Training"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </div>
    </div>
  );
}