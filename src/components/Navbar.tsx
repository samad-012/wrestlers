"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Settings2, UserPlus, Trophy } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Analytics", href: "/", icon: BarChart3 },
    { name: "Manage", href: "/attendance", icon: Settings2 },
    { name: "Register", href: "/register", icon: UserPlus },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-2xl">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter italic">WRESTLERS</span>
          </Link>
        </div>
      </nav>

      {/* 3-Route Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-white border-t border-slate-100 grid grid-cols-3 z-50 pb-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1.5 transition-all ${
              pathname === item.href ? "text-primary scale-110" : "text-slate-400"
            }`}
          >
            <item.icon className={`w-6 h-6 ${pathname === item.href ? "stroke-[3px]" : "stroke-[2px]"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}