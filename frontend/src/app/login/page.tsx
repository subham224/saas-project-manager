'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Authenticating...');

    try {
      // Create a URL-encoded string manually to ensure 100% compatibility
      const details: Record<string, string> = {
        'username': email,
        'password': password,
        'grant_type': 'password',
      };

      const formBody = Object.keys(details)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
        .join('&');

      const res = await api.post('/auth/token', formBody, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      
      localStorage.setItem('token', res.data.access_token);
      toast.success('Welcome back!', { id: toastId });
      
      // Give the toast a moment to show before redirecting
      setTimeout(() => router.push('/dashboard'), 1000);

    } catch (err: any) {
      console.error("Login Error:", err.response?.data);
      // 422 usually means 'username' or 'password' field was missing/misnamed
      const message = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Invalid email or password';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-500 mt-2">Welcome back to TaskMaster</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="name@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition shadow-md"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm border-t pt-6">
          <span className="text-gray-500">Don't have an account? </span>
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold transition">
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
}
