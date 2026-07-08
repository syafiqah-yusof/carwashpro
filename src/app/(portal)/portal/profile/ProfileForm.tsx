"use client";

import { useState } from 'react';
import { updateCustomerProfile } from '../actions';
import Link from 'next/link';

export default function ProfileForm({ customer }: { customer: any }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    
    try {
      const res = await updateCustomerProfile(null, formData);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else if (res?.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
    setIsPending(false);
  }

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-4">
          <Link href="/portal/status" className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
            <i className="bi bi-arrow-left mr-2"></i> Back to Dashboard
          </Link>
        </div>

        <div className="glass-card shadow-2xl p-8 border border-white/10 animate-fade-in">
          <div className="text-center mb-6">
            <i className="bi bi-person-badge-fill text-5xl text-blue-500 mb-3 block"></i>
            <h2 className="text-3xl font-bold text-white mb-1">Edit Profile</h2>
            <p className="text-gray-400 text-sm">Update your personal details below.</p>
          </div>

          {message && (
            <div className={`p-3 rounded-md mb-6 text-sm flex items-center ${
              message.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'
            }`}>
              <i className={`bi ${message.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} mr-2`}></i>
              {message.text}
            </div>
          )}

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit(new FormData(e.currentTarget));
            }} 
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">Vehicle Plate Number (Read Only)</label>
              <div className="flex bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden opacity-70">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-700 text-gray-500">
                  <i className="bi bi-car-front-fill"></i>
                </span>
                <input 
                  type="text" 
                  value={customer.primary_vehicle_plate} 
                  disabled
                  className="w-full bg-transparent text-gray-400 px-3 py-2.5 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input 
                  type="text" 
                  name="fullName"
                  defaultValue={customer.full_name}
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
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-telephone-fill"></i>
                </span>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  defaultValue={customer.phone_number || ''}
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <hr className="border-gray-700 my-6" />

            <div className="mb-2 text-yellow-500 text-sm font-semibold">
              <i className="bi bi-shield-lock mr-2"></i> Security Verification
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  name="oldPassword"
                  placeholder="Required to save changes" 
                  required 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1 text-sm flex justify-between">
                <span>New Password</span>
                <span className="text-gray-500 font-normal italic">(Optional)</span>
              </label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400">
                  <i className="bi bi-key-fill"></i>
                </span>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Leave blank to keep current" 
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all text-lg disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
