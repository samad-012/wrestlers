"use client";
import StatsView from "@/components/StatsView";

export default function StatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Institute Analytics</h1>
        <p className="text-muted-foreground">Monitor performance and attendance trends by date range.</p>
      </div>
      
      <StatsView />
    </div>
  );
}