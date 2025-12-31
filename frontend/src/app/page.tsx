import Link from 'next/link';
import { ArrowRight, CheckCircle, Layout, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="font-bold text-2xl text-blue-600 flex items-center gap-2">
          <Layout /> TaskMaster
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">
            Log in
          </Link>
          {/* THE FIX: Pointing correctly to /register */}
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Sign Up Free
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Manage Projects without the chaos.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          The simplest way to organize tasks, collaborate with your team, and track progress. 
          Built for speed and simplicity.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
            Get Started <ArrowRight size={20} />
          </Link>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Kanban Boards</h3>
            <p className="text-gray-500">Drag and drop tasks effortlessly. Visualize your workflow like never before.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-500">Your data is yours. We use industry-standard encryption to keep it safe.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
            <p className="text-gray-500">Changes update instantly across all your devices. Never miss a beat.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
