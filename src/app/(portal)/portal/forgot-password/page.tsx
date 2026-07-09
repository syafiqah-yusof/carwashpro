"use client";

import { useActionState } from "react";
import { resetPassword } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      alert("Password reset successfully! You can now login.");
      router.push("/portal/login");
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px]"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px]"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <i className="bi bi-key-fill text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset Password</h1>
            <p className="text-gray-400">Enter your vehicle plate to reset your PIN</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Vehicle Plate Number</label>
              <div className="relative">
                <i className="bi bi-car-front absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  name="vehiclePlate"
                  placeholder="e.g. VFC 1234"
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder:normal-case"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">New PIN / Password</label>
              <div className="relative">
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Enter new 4+ digit PIN"
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Confirm New PIN</label>
              <div className="relative">
                <i className="bi bi-lock-fill absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm new PIN"
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center">
                <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                {state.error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <span><i className="bi bi-arrow-repeat animate-spin mr-2"></i> Resetting...</span>
              ) : (
                <span>Reset Password <i className="bi bi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i></span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm">
              Remembered your PIN? <Link href="/portal/login" className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
