import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WrestleTrack | Attendance System",
  description: "Professional attendance management for wrestling institutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/50 antialiased`}>
        <Navbar />
        <main className="flex-1 container py-6 sm:py-10">
          {children}
        </main>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}