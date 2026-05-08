"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StudentForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'POST',
      body: JSON.stringify({ name })
    });

    if (res.ok) {
      toast.success("New wrestler registered!");
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-xl shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. John Cena" 
          required 
        />
      </div>
      <Button type="submit" className="w-full">Add Student</Button>
    </form>
  );
}