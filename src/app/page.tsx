"use client";
import { useState, useEffect } from "react";
import AttendanceList from "@/components/AttendanceList";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // This effect only runs on the client after the page loads
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Daily Attendance
        </h1>
        <p className="text-muted-foreground h-6">
          {/* Only render the date once we are sure we are on the client */}
          {mounted ? (
            `Mark present students for ${new Date().toLocaleDateString()}`
          ) : (
            "Loading date..."
          )}
        </p>
      </div>
      
      <AttendanceList />
    </div>
  );
}