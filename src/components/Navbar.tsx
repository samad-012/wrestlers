"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Attendance', href: '/' },
    { name: 'Analytics', href: '/stats' },
    { name: 'Manage Students', href: '/register' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">W</div>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">WRESTLE-TRACK</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "bg-slate-100 text-primary" : "text-muted-foreground"
              )}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}