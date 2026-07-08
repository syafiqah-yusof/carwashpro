"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { loginCustomer } from './actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError("");
    
    try {
      const res = await loginCustomer(null, formData);
      if (res?.error) {
        setError(res.error);
        setIsPending(false);
      } else if (res?.success) {
        window.location.href = '/portal/status';
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex justify-center mt-12 px-4">
      <div className="w-full max-w-lg">
        <div className="glass-card text-center shadow-2xl p-8 border border-white/10">
          <div className="mb-8">
            <i className="bi bi-person-circle text-6xl text-blue-500 mb-4 block"></i>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Track your car's progress and membership rewards.</p>
          </div>

          {registered && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-md mb-6 text-sm flex items-center justify-center">
              <i className="bi bi-check-circle-fill mr-2"></i>
              VIP Account created successfully! Please login.
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit(new FormData(e.currentTarget));
            }} 
            className="space-y-6 text-left"
          >
            <div>
              <label className="block text-gray-400 font-semibold mb-2">Plate Number</label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-car-front-fill"></i>
                </span>
                <input 
                  type="text" 
                  name="vehiclePlate"
                  placeholder="e.g. ABC 1234" 
                  required 
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">PIN / Password</label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  name="password"
                  placeholder="****" 
                  required 
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center text-lg disabled:opacity-50"
              >
                <i className="bi bi-box-arrow-in-right mr-2"></i> 
                {isPending ? 'Logging in...' : 'Track My Wash'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="/portal/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
