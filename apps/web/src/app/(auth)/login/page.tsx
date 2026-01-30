'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'ui'; 
import { createClient } from '../../../utils/supabase/client';
import Link from 'next/link';

export default function LoginPage(): React.ReactNode {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) {
        setErrorMessage(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles') 
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        const isAdmin = profile?.role === 'admin';

        if (profileError || !isAdmin) {
          await supabase.auth.signOut();
          setErrorMessage('Access Denied: You do not have administrator privileges.');
          setLoading(false);
          return;
        }

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-500">GenPad Admin Only</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <Button 
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : 'Sign In'}
          </Button>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3 ring-1 ring-red-200">
              <p className="text-center text-sm font-medium text-red-600">{errorMessage}</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Back to{' '}
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Main Site
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}