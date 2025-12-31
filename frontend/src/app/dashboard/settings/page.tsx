'use client';

import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded text-gray-600">
              {/* In a real app, you'd fetch the user email here */}
              user@example.com (Placeholder)
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition"
            >
              Log Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
