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
    const toastId = toast.loading('Signing in...');

    try {
      const res = await api.post('/auth/token', new URLSearchParams({
        username: email,
        password: password,
      }));
      
      localStorage.setItem('token', res.data.access_token);
      
      toast.success('Welcome back!', { id: toastId });
      router.push('/dashboard');

    } catch (err: any) {
      // DEBUG: Log the full error to console
      console.error("Login Error:", err);

      let message = 'Login failed';
      if (err.response) {
        // Server responded with an error (e.g. 401 Unauthorized)
        message = err.response.data.detail || 'Invalid email or password';
      } else if (err.request) {
        // Server did not respond (Network Error)
        message = 'Cannot connect to server. Please check your internet.';
      }
      
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm border-t pt-4">
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
