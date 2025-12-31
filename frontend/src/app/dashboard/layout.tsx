'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Settings, FolderKanban } from 'lucide-react'; // Icons

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Simple Security Check
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isAuthenticated) return null; // Prevent flashing content

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 h-16 flex items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">SaaS PM</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
            <FolderKanban size={20} />
            Projects
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto">
        {/* Top Header (Mobile specific usually, keeping simple for now) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 md:hidden">
          {/* Mobile Menu Toggle would go here */}
          <span className="font-bold text-blue-600">SaaS PM</span>
        </header>

        <div className="p-8">
          {children} 
        </div>
      </main>
    </div>
  );
}