"use client";

import { useActionState, useEffect } from "react";
import { uploadReceipt } from "../actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center text-lg disabled:opacity-50"
    >
      <i className="bi bi-cloud-arrow-up-fill mr-2"></i> 
      {pending ? 'Uploading...' : 'Upload Receipt'}
    </button>
  );
}

export default function UploadReceiptPage() {
  const [state, formAction] = useActionState(uploadReceipt, null);

  useEffect(() => {
    if (state?.success) {
      alert("Receipt uploaded successfully! We will verify it shortly.");
      window.location.href = '/portal/history';
    }
  }, [state]);

  return (
    <div className="flex justify-center mt-8 px-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="mb-4">
          <Link href="/portal/status" className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors">
            <i className="bi bi-arrow-left mr-2"></i> Back to Dashboard
          </Link>
        </div>

        <div className="glass-card shadow-2xl p-8 border border-white/10">
          <div className="mb-8 text-center">
            <i className="bi bi-receipt text-5xl text-blue-500 mb-4 block"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Upload Payment Receipt</h2>
            <p className="text-gray-400 text-sm">Upload your QR Pay or Bank Transfer screenshot for verification.</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm flex items-center">
              <i className="bi bi-exclamation-triangle-fill mr-2"></i> {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-gray-400 font-semibold mb-2">Total Amount Paid (RM)</label>
              <div className="flex bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 transition-all">
                <span className="flex items-center justify-center px-4 bg-gray-800 border-r border-gray-600 text-gray-400 font-bold">
                  RM
                </span>
                <input 
                  type="number" 
                  name="amount"
                  step="0.01"
                  placeholder="0.00" 
                  required 
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500 font-bold text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Service / Notes</label>
              <input 
                type="text" 
                name="notes"
                placeholder="e.g. Wash + Vacuum" 
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Receipt Image</label>
              <input 
                type="file" 
                name="receiptFile"
                accept="image/*"
                required 
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
              />
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
