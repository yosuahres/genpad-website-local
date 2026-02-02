'use client';

import React, { useState } from 'react';
import { createClient } from '../../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate user
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      if (data.user) {
        // 2. Cek data di tabel public.users
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role_id, is_active')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) throw new Error('User profile not found.');

        // 3. VALIDASI ROLE: Hanya Admin (role_id: 2) yang boleh login
        if (profile.role_id !== 2) {
          await supabase.auth.signOut(); // Tendang keluar jika bukan admin
          throw new Error('Access denied. Only Admins can login.');
        }

        if (!profile.is_active) {
          await supabase.auth.signOut();
          throw new Error('Your account is deactivated.');
        }

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Admin Login</h1>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-black">Admin Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-black">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Verifying Admin...' : 'Sign In as Admin'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Need an account? <Link href="/register" className="text-blue-600 hover:underline">Register Admin</Link>
        </p>
      </div>
    </div>
  );
}