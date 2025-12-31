'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Loading Effect
    const loadingToast = toast.loading('Creating your account...');

    try {
      await api.post('/auth/register', { email, password, full_name: fullName });
      
      // 2. Success Effect
      toast.dismiss(loadingToast);
      toast.success('Account created! Redirecting to login...', { duration: 4000 });
      
      // Wait 2 seconds so user sees the message, then move them
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      toast.dismiss(loadingToast);
      // 3. Error Effect (Show exact reason)
      const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={fullName} onChange={(e) => setFullName(e.target.value)} required 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={email} onChange={(e) => setEmail(e.target.value)} required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={password} onChange={(e) => setPassword(e.target.value)} required 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm border-t pt-4">
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
