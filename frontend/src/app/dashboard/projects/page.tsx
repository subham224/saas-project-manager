'use client';

import Link from 'next/link';

export default function AllProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Projects</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Projects live inside Organizations</h3>
        <p className="text-blue-600 mb-6">
          To view your projects, please select an Organization from the Dashboard.
        </p>
        <Link 
          href="/dashboard" 
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
