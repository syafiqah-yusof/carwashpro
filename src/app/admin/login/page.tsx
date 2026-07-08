"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin");
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="glass-card w-full max-w-md p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4 border border-blue-500/20">
            <i className="bi bi-shield-lock-fill text-3xl text-blue-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Sign in to the Car Wash Management Portal
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-envelope text-gray-500"></i>
              </div>
              <input
                type="email"
                name="email"
                required
                className="input-field pl-10 w-full"
                placeholder="admin@akccarwash.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-key text-gray-500"></i>
              </div>
              <input
                type="password"
                name="password"
                required
                className="input-field pl-10 w-full"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center">
              <i className="bi bi-exclamation-circle mr-2"></i>
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-primary bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all font-medium flex justify-center items-center"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
