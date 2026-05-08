"use client";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AttendanceList() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/students')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          // Ensure data is an array before setting state
          setStudents(Array.isArray(data) ? data : []);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        if (isMounted) {
          toast.error("Could not load student list");
        }
      });

    return () => { 
      isMounted = false; 
    };
  }, []);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? students.map(s => s.id) : []);
  };

  const submitAttendance = async () => {
    if (selectedIds.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedIds,
          date: new Date().toISOString().split('T')[0],
          status: 'present'
        })
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Attendance marked successfully!");
      setSelectedIds([]); // Clear selection after success
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="all" 
            checked={selectedIds.length === students.length && students.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="all" className="text-sm font-medium cursor-pointer">
            Select All Students ({students.length})
          </label>
        </div>
        <Button 
          onClick={submitAttendance} 
          disabled={loading || selectedIds.length === 0}
        >
          {loading ? "Saving..." : `Submit (${selectedIds.length})`}
        </Button>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Student Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                  No active students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(student.id)}
                      onCheckedChange={(checked) => {
                        setSelectedIds(prev => checked 
                          ? [...prev, student.id] 
                          : prev.filter(id => id !== student.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {student.name}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}