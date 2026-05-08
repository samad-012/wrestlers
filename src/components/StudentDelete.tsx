"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StudentDeleteProps {
  studentId: string;
  onDeleted: (id: string) => void; // To tell the parent to update the list
}

export default function StudentDelete({ studentId, onDeleted }: StudentDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will remove all attendance records for this student.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin?type=student&id=${studentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Student deleted");
        onDeleted(studentId); // Trigger the UI refresh in the parent
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Error deleting student");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </>
      )}
    </Button>
  );
}