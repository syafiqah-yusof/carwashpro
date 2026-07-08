"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import { registerCustomer } from './actions';

export default function PortalRegisterPage() {
  const [state, formAction, isPending] = useActionState(registerCustomer, null);

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-lg">
        <div className="glass-card shadow-2xl p-8 border border-white/10 animate-fade-in">
          <div className="text-center mb-6">
            <i className="bi bi-star-fill text-5xl text-yellow-500 mb-3 block drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"></i>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-1">
              Join VIP
            </h2>
            <p className="text-gray-400 text-sm">Sign up to track washes and earn free rewards.</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-4 text-sm text-center">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. John Doe" 
                  required 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Vehicle Plate Number <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-car-front-fill"></i>
                </span>
                <input 
                  type="text" 
                  name="vehiclePlate"
                  placeholder="e.g. ABC 1234" 
                  required 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm flex justify-between">
                <span>Phone Number</span>
                <span className="text-gray-500 font-normal italic">(Optional)</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-telephone-fill"></i>
                </span>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  placeholder="e.g. 012-3456789" 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Create a password" 
                  required 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-shield-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Re-enter password" 
                  required 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-yellow-500/25 transition-all text-lg disabled:opacity-50"
              >
                {isPending ? 'Creating Account...' : 'Create VIP Account'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/portal/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
