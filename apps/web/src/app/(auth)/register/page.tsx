"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "ui";
import { createClient } from "../../../utils/supabase/client";
import Link from "next/link";

export default function RegisterPage(): React.ReactNode {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw new Error(signUpError.message);

      if (signUpData.user) {
        setSuccessMessage("Account created successfully!");
        
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
      
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
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
            {loading ? "Creating Account..." : "Register"}
          </Button>

          {errorMessage && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-center text-sm font-medium text-red-600">{errorMessage}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-center text-sm font-medium text-green-600">{successMessage}</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}