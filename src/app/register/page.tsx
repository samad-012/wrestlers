"use client";
import { useState, useEffect } from "react";
import StudentForm from "@/components/StudentForm";
import StudentDelete from "@/components/StudentDelete"; // Import your new component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  // This handles the UI update when a child component deletes a student
  const handleRemoveFromList = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Manage Records</h1>
      
      <StudentForm />

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={2}><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="text-right">
                    {/* Call your new component here */}
                    <StudentDelete 
                      studentId={student.id} 
                      onDeleted={handleRemoveFromList} 
                    />
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