"use client";

import { Navbar } from "@/components/Navbar";
import { AddStudentModal } from "@/components/AddStudentModal";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      <Navbar />
      <main className="max-w-md mx-auto p-6 pt-12 text-center space-y-8">
        <div className="bg-primary/10 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto">
          <UserPlus className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">New Entry</h1>
          <p className="text-slate-500 font-medium">Add a new student to the student list to begin tracking their performance.</p>
        </div>
        
        {/* We reuse your existing component but trigger it with a large button */}
        <AddStudentModal onStudentAdded={() => {}} />
      </main>
    </div>
  );
}