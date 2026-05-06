"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarDays, 
  Save, 
  Search, 
  UserSquare2, 
  CheckCircle2, 
  Circle,
  X,
  SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManagePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchAttendanceForDate();
  }, [viewDate]);

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("*").order("name", { ascending: true });
    if (data) setStudents(data);
  };

  const fetchAttendanceForDate = async () => {
    const formattedDate = format(viewDate, "yyyy-MM-dd");
    const { data } = await supabase.from("attendance").select("student_id").eq("date", formattedDate);
    if (data) setSelectedIds(data.map(item => item.student_id));
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from("students").update({ is_active: !currentStatus }).eq("id", id);
    fetchStudents();
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    const dateStr = format(viewDate, "yyyy-MM-dd");
    await supabase.from('attendance').delete().eq('date', dateStr);
    if (selectedIds.length > 0) {
      const payload = selectedIds.map(id => ({ student_id: id, date: dateStr, status: 'present' }));
      await supabase.from('attendance').insert(payload);
    }
    setLoading(false);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      <Navbar />
      
      <main className="max-w-md mx-auto p-6 space-y-6 pt-10">
        {/* Header Area */}
        <div className="flex justify-between items-center px-1">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic">STUDENTS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management Portal</p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-2xl font-bold bg-white border-slate-200 h-11 px-4 shadow-sm hover:bg-slate-50 transition-all">
                <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                {format(viewDate, "MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none rounded-[2.5rem] overflow-hidden shadow-2xl" align="end">
              <Calendar mode="single" selected={viewDate} onSelect={(d) => d && setViewDate(d)} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Pro Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Find a wrestler..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 pl-14 pr-12 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all font-bold text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-5 flex items-center"
            >
              <div className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </div>
            </button>
          )}
        </div>

        {/* Student List Stats */}
        <div className="flex items-center justify-between px-2 pt-2">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {searchTerm ? `Results (${filteredStudents.length})` : 'studnt list'}
          </span>
          <div className="h-px flex-1 mx-4 bg-slate-100" />
          <UserSquare2 className="w-4 h-4 text-slate-300" />
        </div>

        {/* Student List Items */}
        <div className="space-y-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className={cn(
                  "group relative p-4 rounded-[2rem] border transition-all duration-300",
                  student.is_active 
                    ? "bg-white border-slate-100 shadow-sm" 
                    : "bg-slate-100/50 border-transparent opacity-60 grayscale-[0.5]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <Checkbox 
                        id={`mark-${student.id}`}
                        disabled={!student.is_active}
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(prev => checked ? [...prev, student.id] : prev.filter(id => id !== student.id));
                        }}
                        className="peer h-8 w-8 rounded-full border-2 border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all shadow-sm"
                      />
                      {selectedIds.includes(student.id) ? (
                        <CheckCircle2 className="absolute pointer-events-none w-4 h-4 text-white animate-in zoom-in" />
                      ) : (
                        <Circle className="absolute pointer-events-none w-4 h-4 text-slate-200" />
                      )}
                    </div>

                    <label htmlFor={`mark-${student.id}`} className="flex flex-col cursor-pointer">
                      <span className="font-bold text-lg text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors">
                        {student.name}
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        {student.is_active ? "Member" : "Inactive"}
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pr-1">
                     <Switch 
                       checked={student.is_active} 
                       onCheckedChange={() => toggleStatus(student.id, student.is_active)}
                       className="data-[state=checked]:bg-emerald-500"
                     />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
              <div className="p-6 rounded-full bg-slate-50">
                <SearchX className="w-12 h-12" />
              </div>
              <p className="font-bold text-lg">No students found</p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-28 left-0 w-full px-6 pointer-events-none">
          <Button 
  onClick={handleSaveAttendance} 
  disabled={loading}
  className="w-full max-w-md mx-auto h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold gap-2 transition-all active:scale-95 shadow-md"
>
  <div className={cn(
    "p-1.5 rounded-md bg-white/10",
    loading && "animate-spin"
  )}>
    <Save className="w-4 h-4" />
  </div>
  {loading ? "Saving..." : "Save Changes"}
</Button>
        </div>
      </main>
    </div>
  );
}