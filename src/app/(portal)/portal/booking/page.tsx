"use client";

import { useActionState, useEffect } from "react";
import { bookAppointment } from "../actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all flex items-center justify-center text-lg disabled:opacity-50"
    >
      <i className="bi bi-calendar-check-fill mr-2"></i> 
      {pending ? 'Booking...' : 'Book Appointment'}
    </button>
  );
}

export default function BookAppointmentPage() {
  const [state, formAction] = useActionState(bookAppointment, null);

  useEffect(() => {
    if (state?.success) {
      alert("Appointment request submitted successfully! Please wait for our team to approve or assign a time.");
      window.location.href = '/portal/status';
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
            <i className="bi bi-calendar-plus text-5xl text-blue-500 mb-4 block"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Book an Appointment</h2>
            <p className="text-gray-400 text-sm">Skip the queue by booking a wash slot in advance.</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm flex items-center">
              <i className="bi bi-exclamation-triangle-fill mr-2"></i> {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-gray-400 font-semibold mb-2">Select Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="date"
                required 
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Preferred Time (Optional)</label>
              <input 
                type="time" 
                name="time"
                min="09:00"
                max="21:00"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">If left blank, our team will assign an available time. Operating hours: 9:00 AM - 9:00 PM.</p>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Service Requested / Notes</label>
              <textarea 
                name="notes"
                placeholder="e.g. Wash + Polish, remove tree sap" 
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500"
              ></textarea>
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
