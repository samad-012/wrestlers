"use client";
import StudentForm from "@/components/StudentForm";

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Records</h1>
        <p className="text-muted-foreground">Add new students to the institute database.</p>
      </div>
      
      <div className="grid gap-8">
        <StudentForm />
        
        {/* Placeholder for a student list/management table if you add one later */}
        <div className="rounded-xl border border-dashed p-8 text-center bg-white">
          <p className="text-sm text-muted-foreground">
            Student list management coming soon. Use the form above to add new wrestlers.
          </p>
        </div>
      </div>
    </div>
  );
}